## Desktop Server (Electron)

For Electron apps, the server runs inside the main process. The structure is `main.js` (Electron entry) and `server.js` (Express). The server uses the same `switch-framework-backend` API; `staticRoot` points to the web folder (e.g. `path.join(__dirname, 'web')` for `app-type: both`).

### server.js

```javascript title:server.js (Electron)
require('dotenv').config();

const switchFrameworkBackend = require('switch-framework-backend');

switchFrameworkBackend.config({
  PORT: process.env.PORT || 3000,
  staticRoot: __dirname,
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
```

### main.js

Electron's main process loads the server, then opens a BrowserWindow that loads `http://localhost:PORT`. The server must start before the window loads.

```javascript title:main.js (Electron)
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

app.whenReady().then(() => {
  require('./server.js');  // Starts Express server
  setTimeout(createWindow, 350);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  win.loadURL('http://localhost:3000');
}
```

### Using the CLI

Run `npx create-switch-framework-app my-app --app-type electron` to scaffold an Electron project with server.js and main.js preconfigured.
