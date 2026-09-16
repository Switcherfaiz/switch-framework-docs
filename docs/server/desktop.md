## Desktop Server (Electron)

Electron apps from **`create-switch-framework-app@0.2.9`** do **not** run `server.js` inside the main process. Instead, **`electron/main.js`** forks a **child Node process** that runs the same `server.js` you would use on the web. The child binds **`PORT=0`** on **`127.0.0.1`**, reports the real port over IPC, and the BrowserWindow loads that URL.

> [!TIP]
> Related pages: [[Multiple child servers|docs/server/desktop-multi-server]] · [[Splash window|docs/server/desktop-splash]] · [[Web viewing & auth|docs/server/desktop-auth]]

---

### Architecture

```text
electron/main.js
  ├─ createSplashWindow()          ← optional loading UI
  ├─ startServers(session)
  │    └─ fork electron/child.js (ELECTRON_RUN_AS_NODE=1)
  │         └─ require('server.js')
  │              └─ switch-framework-backend → listen(0, '127.0.0.1')
  │                   └─ IPC { type: 'ready', name, port, host }
  └─ onServerReady → BrowserWindow.loadURL(http://host:port/)
```

Your **`server.js`** and **`switch-framework-backend.config()`** are identical to the web case — only the **process** and **port assignment** differ.

---

### Finding the port

```params-table
{"headers":["When","Where to look","Example"],"htmlColumns":[0,1,2],"rows":[["Electron dev / packaged app","Terminal stdout from child","<code>[electron/child:app] http://127.0.0.1:54321</code>"],["Inside the renderer","Preload API","<code>window.switchApp.runtime.port</code> and <code>.host</code>"],["Web-only dev (<code>npm run dev</code>)","Backend startup log","<code>Switch Framework app running at http://localhost:3000</code>"],["Your own code","Log inside <code>initServer</code> or read env","Child sees <code>PORT=0</code> until listen completes — use IPC log or preload for Electron"]]}
```

The **authoritative** Electron port is the `[electron/child:…]` line or the IPC `{ type: 'ready', port, host }` message — not a hardcoded value in `main.js`.

---

### Key files (CLI Electron scaffold)

```params-table
{"headers":["File","Role"],"htmlColumns":[0,1],"rows":[["<code>server.js</code>","Express entry — same backend API as web."],["<code>constants/index.js</code>","App config: preferred port, session secret, <code>ALLOW_WEB_VIEWING</code>."],["<code>server/local-auth.js</code>","Optional token middleware for browser debugging (see auth page)."],["<code>electron/main.js</code>","Splash, fork servers, open main window when ready."],["<code>electron/child.js</code>","Fork helper + child-side listen patch + IPC send."],["<code>electron/servers.js</code>","Registry of child servers to start (name + entry file)."],["<code>electron/ipc.js</code>","Collects ready messages; exposes <code>onServerReady</code>."],["<code>electron/preload.js</code>","Exposes <code>window.switchApp</code> to the renderer."],["<code>electron/electron-builder.json</code>","Packaging: explicit <code>files</code>, <code>asar</code> settings."]]}
```

---

### `switch-framework-backend` in Electron

The child process patches `http.Server.prototype.listen` **before** your `server.js` loads. When your backend calls `listen(PORT)`:

- Child env sets **`PORT=0`** → OS assigns a free port
- **`SWITCH_BIND_HOST=127.0.0.1`** → not exposed on LAN by default
- On **`listening`**, child sends IPC `{ type: 'ready', name, port, host }`

Use **`config({ onHttpServer })`** if you need the raw `http.Server` before bind (advanced — the CLI child bootstrap handles the common case).

---

### npm scripts

```json title:package.json (Electron)
{
  "main": "main.js",
  "scripts": {
    "dev": "node server.js",
    "electron:dev": "electron .",
    "build": "electron-builder --config electron/electron-builder.json"
  }
}
```

- **`npm run dev`** — run the UI server alone (fixed port, no Electron) — useful for quick API/UI work in the browser.
- **`npm run electron:dev`** — full desktop flow with dynamic port + splash + window.

---

### CLI scaffold (0.2.9)

```bash
npx create-switch-framework-app my-app --app-type electron
cd my-app
npm install
npm run electron:dev
```

Pins **`switch-framework@^0.2.9`** and **`switch-framework-backend@^0.2.9`**.

---

### Next steps

```params-table
{"headers":["Topic","Page"],"htmlColumns":[0,1],"rows":[["Run more than one child server (workers, media, etc.)","[[Multiple child servers|docs/server/desktop-multi-server]]"],["Show a window while the server boots","[[Splash window|docs/server/desktop-splash]]"],["Open the app in Chrome for debugging","[[Web viewing & auth|docs/server/desktop-auth]]"],["Frameless title bar + window controls","[[ElectronTitleBar|docs/components/electron-titlebar]]"]]}
```
