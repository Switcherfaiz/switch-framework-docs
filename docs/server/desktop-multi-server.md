## Multiple Child Servers

The Electron template can run **more than one Node child process**. Each entry in **`electron/servers.js`** is forked separately, gets its **own dynamic port**, and reports **`{ type: 'ready', name, port, host }`** when listening. Use this for workers, media pipelines, background sync, or any task that should not block the main UI server.

---

### Server registry

```javascript title:electron/servers.js
module.exports = [
  { name: 'app', entry: 'server.js' },
  { name: 'worker', entry: 'worker-server.js', env: { WORKER_MODE: '1' } },
];
```

```params-table
{"headers":["Field","Required","Purpose"],"htmlColumns":[0,1,2],"rows":[["<code>name</code>","Yes","Unique id used in IPC messages and in the ports map passed to <code>onServerReady</code>."],["<code>entry</code>","Yes","Path relative to app root (folder containing <code>server.js</code>). Child process <code>require()</code>s this file."],["<code>env</code>","No","Extra env vars merged into the child environment alongside the defaults below."]]}
```

---

### What happens when Electron starts

1. **`startServers(session)`** in `electron/child.js` reads the registry.
2. **`expectServers(['app', 'worker', …])`** in `electron/ipc.js` marks which names must report ready.
3. For each entry, **`fork(electron/child.js)`** with:

```params-table
{"headers":["Env var","Value","Meaning"],"htmlColumns":[0,1,2],"rows":[["<code>ELECTRON_RUN_AS_NODE</code>","<code>1</code>","Run child as plain Node, not Electron."],["<code>SWITCH_SERVER_CHILD</code>","<code>1</code>","Child mode — patch <code>listen()</code> and send IPC."],["<code>SWITCH_SERVER_NAME</code>","registry <code>name</code>","Identifies this process in ready messages."],["<code>SWITCH_SERVER_ENTRY</code>","registry <code>entry</code>","Which file to <code>require</code>."],["<code>SWITCH_APP_ROOT</code>","app root path","Base path for resolving <code>entry</code>."],["<code>PORT</code>","<code>0</code>","Let OS assign a free port."],["<code>SWITCH_BIND_HOST</code>","<code>127.0.0.1</code>","Bind localhost only."],["<code>SWITCH_LOCAL_AUTH_TOKEN</code>","random hex","Auth cookie for Electron window (see auth page)."],["<code>…spec.env</code>","your values","Custom per-server config."]]}
```

4. Child loads **`entry`**, backend listens, sends IPC **`ready`**.
5. When **every** expected name has reported, **`onServerReady`** fires with a ports map.

---

### IPC ready message

```javascript title:Message shape (child → main)
{
  type: 'ready',
  name: 'app',           // matches servers.js name
  port: 54321,
  host: '127.0.0.1'
}
```

Terminal log (same info):

```text
[electron/child:app] http://127.0.0.1:54321
[electron/child:worker] http://127.0.0.1:54322
```

---

### Waiting for servers — `onServerReady`

`electron/ipc.js` exposes a callback API:

```javascript title:electron/main.js
const { onServerReady } = require('./ipc.js');
const { startServers } = require('./child.js');

onServerReady((ports) => {
  // ports.app    → { port, host }
  // ports.worker → { port, host }
  console.log('All servers ready:', ports);
  openMainWindow(ports);
});

startServers(localSession);
```

**`ports`** is an object keyed by **`name`** from `servers.js`.

To **`await`** all servers (async/await style), wrap the callback:

```javascript title:Optional helper (add to electron/ipc.js)
function whenServerReady() {
  return new Promise((resolve) => onServerReady(resolve));
}

// electron/main.js
async function bootstrap() {
  startServers(localSession);
  const ports = await whenServerReady();
  await openMainWindow(ports);
}
```

---

### Checking status

```params-table
{"headers":["Need","Approach"],"htmlColumns":[0,1],"rows":[["Know when **all** servers are up","Use <code>onServerReady</code> or <code>whenServerReady()</code> — fires once every expected <code>name</code> reported."],["Read ports after ready","Use the <code>ports</code> argument: <code>ports.app.port</code>, <code>ports.worker.port</code>."],["Expose to renderer","Pass via preload env (<code>switchApp.runtime.port</code> for main UI) or add your own IPC handlers."],["Health-check a worker","From main or UI server, <code>fetch('http://127.0.0.1:' + ports.worker.port + '/health')</code> after ready."],["Detect child crash","Listen to <code>child.on('exit', …)</code> in <code>electron/child.js</code> (already logs non-zero exits)."]]}
```

---

### Example: UI server + worker server

**`worker-server.js`** — minimal second process:

```javascript title:worker-server.js
const http = require('node:http');

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ service: 'worker', ok: true }));
});

const port = Number(process.env.PORT) || 0;
const host = process.env.SWITCH_BIND_HOST || '127.0.0.1';
server.listen(port, host);
```

Register it in **`servers.js`**, restart Electron, watch for two `[electron/child:…]` log lines.

**From your UI server** (`server.js`), call the worker after boot:

```javascript title:server.js (inside initServer)
app.initServer((server) => {
  server.get('/api/worker-status', async (_req, res) => {
    const workerPort = process.env.WORKER_PORT;
    if (!workerPort) return res.json({ ok: false, reason: 'no worker port' });
    const r = await fetch(`http://127.0.0.1:${workerPort}/`);
    const body = await r.json();
    res.json(body);
  });
});
```

Pass **`WORKER_PORT`** to the app child via `servers.js`:

```javascript
{ name: 'app', entry: 'server.js', env: { WORKER_PORT: '' } }
```

Set it from main after `onServerReady`:

```javascript
onServerReady((ports) => {
  process.env.WORKER_PORT = String(ports.worker?.port || '');
  // re-fork or set on child env before fork for production — pattern varies by app
});
```

> [!NOTE]
> For production, inject worker port into the app child **env at fork time** (extend `startServerProcess` in `child.js`) rather than relying on main-process env.

---

### Adding a server — checklist

1. Create **`my-service.js`** at app root (or subfolder — adjust `entry` path).
2. Add `{ name: 'myservice', entry: 'my-service.js' }` to **`electron/servers.js`**.
3. Ensure the entry file calls **`listen`** (directly or via `switch-framework-backend`).
4. Handle **`ports.myservice`** in **`onServerReady`** before opening the window (if the UI depends on it).
5. Log or expose the port for debugging.
