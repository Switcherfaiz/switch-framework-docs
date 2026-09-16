## Desktop App Installation

Use the CLI to scaffold a Switch Framework Electron app. The template forks the Express server, picks a free port automatically, and opens a native window.

> [!NOTE]
> New projects pin **`switch-framework@^0.2.9`** and **`switch-framework-backend@^0.2.9`**.

### Create a desktop app

```bash title:Create Electron app
npx create-switch-framework-app my-desktop-app --app-type electron
cd my-desktop-app
npm install
npm run electron:dev
```

### Finding the server port

After `npm run electron:dev`, check the terminal:

```
[electron/child:app] http://127.0.0.1:54321
```

That is the URL Electron loads. Inside the renderer, `window.switchApp.runtime.port` holds the same value.

For **`npm run dev`** (web-only, no Electron), the port comes from `package.json` → `switchFramework.port` (default **3000**) unless you set `PORT` in the environment.

### Debugging in a normal browser

In `constants/index.js`, set:

```javascript
const ALLOW_WEB_VIEWING = true;
```

Restart the app, copy the port from the `[electron/child:app]` log, and open `http://127.0.0.1:<port>/` in Chrome or Edge. Set back to **`false`** before shipping.

See [[Desktop Server|docs/server/desktop]] for architecture, auth middleware, and builder details.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The builder config lives in `electron/electron-builder.json`.
