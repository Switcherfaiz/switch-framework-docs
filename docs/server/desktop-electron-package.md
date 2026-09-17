## switch-framework-electron

**`switch-framework-electron@0.2.9`** is the desktop companion package for Switch Framework. It hides Electron-specific plumbing — child server forking, dynamic ports, IPC, splash bootstrap, local auth cookies, and window controls — so your app only keeps **`electron/servers.js`**, **`electron/preload.js`**, and your own **`server.js`**.

Installed automatically when you scaffold with:

```bash
npx create-switch-framework-app my-app --app-type electron
```

> [!TIP]
> Related: [[Desktop Server|docs/server/desktop]] · [[Multiple child servers|docs/server/desktop-multi-server]] · [[Splash window|docs/server/desktop-splash]]

---

### What stays in your app vs the package

```params-table
{"headers":["Your project","Package (<code>switch-framework-electron</code>)"],"htmlColumns":[0,1],"rows":[["<code>server.js</code> — UI + API backend","<code>child.js</code> — fork entry, listen patch, IPC send"],["<code>electron/servers.js</code> — which processes to start","<code>lib/servers.js</code> — fork registry, env injection"],["<code>electron/main.js</code> — thin bootstrap call","<code>lib/bootstrap.js</code> — splash, window, cookie, quit"],["<code>electron/preload.js</code> — expose <code>window.switchApp</code>","<code>lib/ipc.js</code> — ready collection + window IPC handlers"],["<code>constants/index.js</code>, routes, UI","<code>lib/session.js</code>, paths, packaged app roots"]]}

```

---

### Minimal `electron/main.js`

```javascript title:electron/main.js
const path = require('node:path');
const { bootstrapElectronApp } = require('switch-framework-electron');
const servers = require('./servers.js');

bootstrapElectronApp({
  servers,
  preloadPath: path.join(__dirname, 'preload.js'),
  splashHtmlPath: path.join(__dirname, 'splash.html'),
  appRoot: path.join(__dirname, '..'),
  cwd: path.join(__dirname, '..'),
});
```

**`main.js`** at the project root re-exports this file so Electron finds the entry (`"main": "main.js"` in `package.json`).

---

### Public API

```javascript title:require('switch-framework-electron')
const swElectron = require('switch-framework-electron');

// Bootstrap (recommended)
swElectron.bootstrapElectronApp(options);

// Child servers
swElectron.startServers(serverList, session, { appRoot, cwd });
swElectron.startServerProcess(spec, session, options);
swElectron.stopServerProcess(name);

// IPC / readiness
swElectron.onServerReady((ports) => { /* ports.app, ports.worker */ });
swElectron.whenServerReady(); // Promise
swElectron.getServerPorts();
swElectron.registerWindowIpc(mainWindow);

// Session + paths
swElectron.createLocalSession();
swElectron.configurePackagedPaths();
swElectron.getAppRoot(appRoot);

// Low-level
swElectron.childEntry; // path to child.js inside the package
```

```params-table
{"headers":["Export","Purpose"],"htmlColumns":[0,1],"rows":[["<code>bootstrapElectronApp</code>","Splash → fork servers → open main window when all ready"],["<code>startServers</code> / <code>startServerProcess</code>","Fork one or more entry files from <code>electron/servers.js</code>"],["<code>onServerReady</code> / <code>whenServerReady</code>","Callback or Promise when every expected <code>name</code> reported a port"],["<code>registerWindowIpc</code>","Wire <code>window:minimize</code>, maximize, close for <code>ElectronTitleBar</code>"],["<code>createLocalSession</code>","Random token for local auth cookie"],["<code>childEntry</code>","Path used internally when forking — do not call directly"]]}

```

---

### Peer dependency

```json title:package.json
{
  "dependencies": {
    "switch-framework-electron": "^0.2.9"
  },
  "devDependencies": {
    "electron": "^41.7.1"
  }
}
```

**`electron`** is a **peer dependency** — install it in your app (`npm install electron --save-dev`). The CLI template pins **Electron 41.x** for compatibility with native module prebuilds.

---

### Local development (`npm link`)

When using **`create-switch-framework-app --use-local`**:

```bash
cd switch-framework && npm link
cd switch-framework-backend && npm link
cd switch-framework-electron && npm link
cd my-app && npm link switch-framework switch-framework-backend switch-framework-electron
```

---

### npm package

| | |
|---|---|
| **Name** | `switch-framework-electron` |
| **Version** | `0.2.9` |
| **License** | MIT |
| **Repo** | [github.com/Switcherfaiz/switch-framework-electron](https://github.com/Switcherfaiz/switch-framework-electron) |

Publish order with the rest of the stack: **`switch-framework`** → **`switch-framework-backend`** → **`switch-framework-electron`** → **`create-switch-framework-app`**.
