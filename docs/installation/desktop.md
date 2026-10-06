## Desktop App Installation

Use the CLI to scaffold a Switch Framework Electron app. The template forks the Express server, picks a free port automatically, shows a splash window while booting, and opens a native frameless window.

> [!NOTE]
> New projects pin **`switch-framework@^0.3.0`**, **`switch-framework-backend@^0.3.0`**, **`switch-framework-router@^0.3.0`**, **`switch-framework-icons@^0.3.0`**, and **`switch-framework-electron@^0.3.0`**.

### Create a desktop app

```bash title:Create Electron app
npx create-switch-framework-app my-desktop-app --app-type electron
cd my-desktop-app
npm install
npm run electron:dev
```

### Finding the server port

```params-table
{"headers":["Command","Where the port appears"],"htmlColumns":[0,1],"rows":[["<code>npm run electron:dev</code>","Terminal: <code>[electron/child:app] http://127.0.0.1:54321</code>"],["Inside the app","<code>window.switchApp.runtime.port</code> (preload)"],["<code>npm run dev</code> (web only)","Terminal: <code>Switch Framework app running at http://localhost:3000</code>"]]}
```

See [[Desktop Server|docs/server/desktop]] for full details.

### Debugging in a normal browser

Set **`ALLOW_WEB_VIEWING = true`** in **`constants/index.js`**, restart, copy the port from the terminal log, open **`http://127.0.0.1:<port>/`**. Set back to **`false`** before shipping.

See [[Web Viewing & Auth|docs/server/desktop-auth]].

### Server docs (Electron)

```params-table
{"headers":["Topic","Page"],"htmlColumns":[0,1],"rows":[["Backend config (web + Electron)","[[Server Introduction|docs/server/introduction]]"],["Web-only server setup","[[Web Server|docs/server/web]]"],["Electron architecture & ports","[[Desktop Server|docs/server/desktop]]"],["Multiple child processes","[[Multiple child servers|docs/server/desktop-multi-server]]"],["Splash / loading window","[[Splash window|docs/server/desktop-splash]]"],["Auth token & browser debug","[[Web viewing & auth|docs/server/desktop-auth]]"]]}
```

### Build for production

```bash
npm run build
```

Output goes to **`dist/`**. Config: **`electron/electron-builder.json`**.
