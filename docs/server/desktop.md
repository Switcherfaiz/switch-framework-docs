## Desktop Server (Electron)

Electron apps scaffolded with `create-switch-framework-app@0.2.9` fork the Express server as a **child process** with a **dynamic port** (`PORT=0` on `127.0.0.1`). The main window loads the URL reported over IPC — you do not hardcode a port in `main.js`.

### Where to find the port

| When | Where |
|------|--------|
| **Electron dev / packaged app** | Terminal log: `[electron/child:app] http://127.0.0.1:<port>` |
| **Renderer (inside the app)** | `window.switchApp.runtime.port` and `.host` from preload |
| **Web-only dev (`npm run dev`)** | Terminal: `Switch Framework app running at http://localhost:<port>` — uses `switchFramework.port` from `package.json` or `PORT` env |
| **Your own logging** | Read `PORT` from `constants/index.js` inside `server.js`, or log inside `app.initServer` after listen |

```javascript title:Log the bound port in server.js
const { PORT } = require('./constants/index.js');
console.log(`[my-app] Server configured for port ${PORT}`);
```

In Electron child mode, `PORT` is `0` until the OS assigns one; the authoritative value is the `[electron/child:app]` log line or IPC `{ type: 'ready', port, host }`.

### server.js — web viewing flag

Set **`ALLOW_WEB_VIEWING`** in `constants/index.js` (re-exported through `server.js`) to control browser access when the Electron auth token is active:

```javascript title:constants/index.js
/** true = open http://127.0.0.1:<port> in any browser without token (debugging) */
const ALLOW_WEB_VIEWING = false;
```

```javascript title:server.js
const { ALLOW_WEB_VIEWING } = require('./constants/index.js');
process.env.ALLOW_WEB_VIEWING = ALLOW_WEB_VIEWING ? '1' : '0';
```

| `ALLOW_WEB_VIEWING` | Behaviour |
|---------------------|-----------|
| **`false`** (default) | Electron sets `SWITCH_LOCAL_AUTH_TOKEN`. Browser access without the cookie/header returns **403**. |
| **`true`** | Token check skipped — use to debug in Chrome/Edge at `http://127.0.0.1:<port>`. |

`server/local-auth.js` implements the middleware. Plain `npm run dev` (no Electron) leaves the token unset, so the middleware is a no-op.

### Architecture

```
electron/main.js
  └─ fork child (ELECTRON_RUN_AS_NODE=1)
       └─ server.js  →  switch-framework-backend  →  listen(0, '127.0.0.1')
            └─ IPC { type: 'ready', name, port, host }
  └─ BrowserWindow.loadURL(`http://${host}:${port}/`)
```

`electron/servers.js` lists child servers (default: `{ name: 'app', entry: 'server.js' }`). Add entries for extra Node workers.

### switch-framework-backend (0.2.9)

- **`config({ onHttpServer(httpServer) })`** — hook to patch `listen()` before bind (used by Electron child bootstrap).
- **`http.createServer(expressApp)`** instead of `app.listen()` directly — enables the hook above.
- Same `config({ PORT, staticRoot, session })` and `initServer(callback)` API as web apps.

### create-switch-framework-app (0.2.9)

- Electron template uses **child fork + dynamic port** (not in-process `require('./server.js')`).
- **`constants/index.js`** replaces dotenv for bundled Electron builds.
- **`server/local-auth.js`** + **`ALLOW_WEB_VIEWING`** flag.
- **`electron/electron-builder.json`** with explicit `files` / `asar` config.
- Preload exposes **`window.switchApp.runtime.host`** / **`.port`** and window controls.
- Pins **`switch-framework@^0.2.9`** and **`switch-framework-backend@^0.2.9`**.

### Using the CLI

```bash
npx create-switch-framework-app my-app --app-type electron
cd my-app
npm run electron:dev
```

Watch the terminal for `[electron/child:app] http://127.0.0.1:…` when debugging browser access with `ALLOW_WEB_VIEWING = true`.
