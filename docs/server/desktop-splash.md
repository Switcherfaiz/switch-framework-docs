## Splash Window

While child servers boot, the CLI Electron template shows a **frameless splash window** so the user is not staring at a blank desktop. When every server reports ready, the splash closes and the **main BrowserWindow** opens at the dynamic URL.

---

### Flow

```text
app.whenReady()
  → bootstrap()
       → createSplashWindow()     // load electron/splash.html
       → startServers(session)    // fork children
       → onServerReady(ports)
            → createMainWindow()  // load http://host:port/
            → splash.close()
            → main.show()
```

The main window stays **`show: false`** until **`ready-to-show`** so content is not flashed mid-load.

---

### Default implementation

```javascript title:electron/main.js (excerpt)
function createSplashWindow() {
  const splash = new BrowserWindow({
    width: 1200,
    height: 800,
    center: true,
    frame: false,
    backgroundColor: '#f5f5f5',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splash.loadFile(path.join(__dirname, 'splash.html'));
  splash.once('ready-to-show', () => splash.show());
  return splash;
}
```

```html title:electron/splash.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Loading…</title>
    <style>
      html, body {
        margin: 0; height: 100%;
        display: grid; place-items: center;
        font-family: system-ui, sans-serif;
        background: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <div>Starting server…</div>
  </body>
</html>
```

---

### Customization

```params-table
{"headers":["Goal","What to change"],"htmlColumns":[0,1],"rows":[["Branding","Edit <code>electron/splash.html</code> — logo, spinner, dark mode."],["Size / position","Adjust <code>BrowserWindow</code> options in <code>createSplashWindow()</code>."],["Match main window bounds","Template copies splash bounds to main window via <code>splashWindow.getBounds()</code> before create."],["Skip splash","Remove splash calls; call <code>openMainWindow</code> directly from <code>onServerReady</code> (faster dev, worse UX on slow boots)."],["Show boot progress","Use IPC from child to main to update splash text (e.g. “Starting database…”)."]]}
```

---

### Opening the main window after servers ready

```javascript title:electron/main.js (pattern)
async function openMainWindow(ports) {
  const appServer = ports.app || Object.values(ports)[0];
  if (!appServer?.port) throw new Error('App server did not report a port');

  const host = appServer.host || '127.0.0.1';
  await createMainWindow(splashWindow.getBounds(), {
    host,
    port: appServer.port,
    token: localSession?.token,
  });

  splashWindow?.close();
  mainWindow?.show();
}

onServerReady((ports) => {
  openMainWindow(ports).catch(console.error);
});
```

**`createMainWindow`** sets preload env (`SWITCH_WINDOW_HOST`, `SWITCH_WINDOW_PORT`), attaches the auth cookie, and calls **`loadURL(`http://${host}:${port}/`)`**.

---

### Failure handling

If **`openMainWindow`** throws (no port, load failure):

- Template logs **`[electron] Failed to open main window`**
- Closes splash
- Quits if no main window was created

Add retries in **`did-fail-load`** on the main window webContents (template already retries once after 750 ms).

---

### Relation to server port

The splash does **not** display the port by default. To show it:

1. Wait for **`onServerReady`**
2. Update splash via **`splash.webContents.executeJavaScript(...)`** or replace splash HTML with a small preload script
3. Or log to terminal: **`[electron/child:app] http://127.0.0.1:…`**

See [[Desktop Server|docs/server/desktop]] for where ports appear.
