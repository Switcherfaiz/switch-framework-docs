## Multiple Child Servers

Electron apps can run **more than one Node child process**. Each entry in **`electron/servers.js`** is forked separately, gets its **own dynamic port**, and reports **`{ type: 'ready', name, port, host }`** when listening. Use this for workers, media pipelines, background sync, or any backend task that should not block the main UI server.

The fork helper, listen patch, and IPC collection live in **`switch-framework-electron`** — your app only lists servers and writes the entry files.

> [!TIP]
> Related pages: [[Desktop Server|docs/server/desktop]] · [[switch-framework-electron|docs/server/desktop-electron-package]] · [[Web viewing & auth|docs/server/desktop-auth]]

---

### Server registry (`electron/servers.js`)

This is the **only** place you declare which child processes Electron should start:

```javascript title:electron/servers.js
module.exports = [
  { name: 'app', entry: 'server.js' },
  { name: 'worker', entry: 'worker-server.js', env: { WORKER_MODE: '1' } },
];
```

```params-table
{"headers":["Field","Required","Purpose"],"htmlColumns":[0,1,2],"rows":[["<code>name</code>","Yes","Unique id used in IPC messages and in the <code>ports</code> map passed to <code>onServerReady</code>."],["<code>entry</code>","Yes","Path relative to app root (folder containing <code>server.js</code>). The child <code>require()</code>s this file."],["<code>env</code>","No","Extra env vars merged into the child environment (see below)."]]}
```

**`electron/main.js`** passes this list to **`bootstrapElectronApp({ servers })`** from `switch-framework-electron`. You do not fork processes yourself.

---

### What the package does on startup

1. **`startServers(servers, session, { appRoot, cwd })`** reads your registry.
2. **`expectServers(['app', 'worker', …])`** marks which names must report ready.
3. For each entry, the package forks **`switch-framework-electron/child.js`** with:

```params-table
{"headers":["Env var","Value","Meaning"],"htmlColumns":[0,1,2],"rows":[["<code>ELECTRON_RUN_AS_NODE</code>","<code>1</code>","Run child as plain Node, not Electron."],["<code>SWITCH_SERVER_CHILD</code>","<code>1</code>","Child mode — patch <code>listen()</code> and send IPC."],["<code>SWITCH_SERVER_NAME</code>","registry <code>name</code>","Identifies this process in ready messages."],["<code>SWITCH_SERVER_ENTRY</code>","registry <code>entry</code>","Which file to <code>require</code>."],["<code>SWITCH_APP_ROOT</code>","app root path","Base path for resolving <code>entry</code>."],["<code>PORT</code>","<code>0</code>","Let OS assign a free port."],["<code>SWITCH_BIND_HOST</code>","<code>127.0.0.1</code>","Bind localhost only."],["<code>SWITCH_LOCAL_AUTH_TOKEN</code>","random hex","Auth cookie for Electron window (see auth page)."],["<code>…spec.env</code>","your values","Custom per-server config — available as <code>process.env</code> in the entry file."]]}
```

4. The child **`require()`s your entry file**. When that file calls **`listen`**, the package sends IPC **`ready`**.
5. When **every** expected name has reported, **`bootstrapElectronApp`** opens the main window with the app server port.

---

### Writing entry files (you choose the style)

Each **`entry`** is a normal Node file at your app root (or a subpath). It must start an HTTP server (directly or via **`switch-framework-backend`**). The package handles dynamic ports — your file just calls **`listen`**.

#### Example A — main UI server (`server.js`)

Same as web. Uses **`switch-framework-backend`** to serve the Switch UI and your API:

```javascript title:server.js
'use strict';

const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const { PORT, SESSION_SECRET, ALLOW_WEB_VIEWING } = require('./constants/index.js');
const { localAuthMiddleware } = require('./server/local-auth.js');

process.env.ALLOW_WEB_VIEWING = ALLOW_WEB_VIEWING ? '1' : '0';

switchFrameworkBackend.config({
  PORT, // ignored in Electron child — OS assigns port via PORT=0
  staticRoot: path.join(__dirname, '.'),
  session: { secret: SESSION_SECRET, resave: false, saveUninitialized: false },
});

const app = switchFrameworkBackend();
app.initServer((server) => {
  server.use(localAuthMiddleware);
  // your routes…
});
```

When Electron forks this as **`{ name: 'app', entry: 'server.js' }`**, the terminal shows:

```text
[switch-framework-electron:app] http://127.0.0.1:54321
```

#### Example B — custom worker (`worker-server.js`)

Any HTTP server works. Use this for FFmpeg wrappers, sync jobs, ML inference, etc.:

```javascript title:worker-server.js
'use strict';

const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ service: 'worker', ok: true }));
  }
  if (req.url === '/run' && req.method === 'POST') {
    // long-running or CPU work here…
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ done: true }));
  }
  res.writeHead(404).end();
});

const port = Number(process.env.PORT) || 0;
const host = process.env.SWITCH_BIND_HOST || '127.0.0.1';
server.listen(port, host);
```

Register it:

```javascript title:electron/servers.js
module.exports = [
  { name: 'app', entry: 'server.js' },
  { name: 'worker', entry: 'worker-server.js' },
];
```

#### Example C — pass worker port into the app child

Inject env at fork time so **`server.js`** can call the worker without hardcoding ports:

```javascript title:electron/servers.js
module.exports = [
  {
    name: 'worker',
    entry: 'worker-server.js',
  },
  {
    name: 'app',
    entry: 'server.js',
    env: {
      // filled dynamically — see custom bootstrap below
    },
  },
];
```

For dynamic env (e.g. set **`WORKER_PORT`** after worker is ready), use **`bootstrapElectronApp`** with a custom **`onReady`** hook or import **`onServerReady`** / **`startServers`** from `switch-framework-electron` instead of the default bootstrap. Most apps only need the **`app`** server; add workers when you have a concrete backend task.

Inside **`server.js`**, read the worker URL from env:

```javascript title:server.js (route example)
server.get('/api/worker-status', async (_req, res) => {
  const workerPort = process.env.WORKER_PORT;
  if (!workerPort) return res.json({ ok: false, reason: 'worker not configured' });
  const r = await fetch(`http://127.0.0.1:${workerPort}/health`);
  res.json(await r.json());
});
```

---

### IPC ready message

```javascript title:Message shape (child → main)
{
  type: 'ready',
  name: 'app',
  port: 54321,
  host: '127.0.0.1'
}
```

Terminal log:

```text
[switch-framework-electron:app] http://127.0.0.1:54321
[switch-framework-electron:worker] http://127.0.0.1:54322
```

---

### Waiting for servers (advanced)

The CLI template uses **`bootstrapElectronApp`**, which waits for all servers automatically. For custom flows, import from the package:

```javascript title:Custom electron/main.js
const path = require('node:path');
const {
  bootstrapElectronApp,
  onServerReady,
  whenServerReady,
  startServers,
  createLocalSession,
} = require('switch-framework-electron');
const servers = require('./servers.js');

// Default — recommended
bootstrapElectronApp({
  servers,
  preloadPath: path.join(__dirname, 'preload.js'),
  splashHtmlPath: path.join(__dirname, 'splash.html'),
  appRoot: path.join(__dirname, '..'),
  cwd: path.join(__dirname, '..'),
});

// Or manual control:
// const session = createLocalSession();
// startServers(servers, session, { appRoot: '…', cwd: '…' });
// const ports = await whenServerReady();
// ports.app.port, ports.worker.port
```

```params-table
{"headers":["Need","Approach"],"htmlColumns":[0,1],"rows":[["Know when **all** servers are up","<code>bootstrapElectronApp</code> (default) or <code>whenServerReady()</code>"],["Read ports after ready","<code>ports.app.port</code>, <code>ports.worker.port</code> from <code>onServerReady</code>"],["Expose to renderer","Preload: <code>window.switchApp.runtime.port</code> for main UI"],["Health-check a worker","<code>fetch('http://127.0.0.1:' + ports.worker.port + '/health')</code> after ready"],["Detect child crash","Package logs non-zero exits; extend with your own <code>child.on('exit')</code> if needed"]]}

```

---

### Adding a server — checklist

1. Create **`my-service.js`** at app root (any style — Express, raw HTTP, or `switch-framework-backend`).
2. Add **`{ name: 'myservice', entry: 'my-service.js' }`** to **`electron/servers.js`**.
3. Ensure the entry calls **`listen`** (the package patches it in child mode).
4. Restart Electron and confirm **`[switch-framework-electron:myservice] http://…`** in the terminal.
5. If the UI depends on it, pass its port via **`spec.env`** or fetch it after **`whenServerReady()`**.
