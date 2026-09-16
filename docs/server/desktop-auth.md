## Web Viewing & Auth (Electron)

When Electron runs your UI server as a child, the main process generates a **local auth token** and sets it as an **httpOnly cookie** on the BrowserWindow. External browsers hitting the same port without that cookie get **403** — unless you enable **`ALLOW_WEB_VIEWING`** for debugging.

---

### `ALLOW_WEB_VIEWING` flag

Set in **`constants/index.js`** (scaffold default **`false`**):

```javascript title:constants/index.js
/** true = allow any browser at http://127.0.0.1:<port> without token */
const ALLOW_WEB_VIEWING = false;

module.exports = { ALLOW_WEB_VIEWING /* …other exports */ };
```

Wire it in **`server.js`** so the middleware can read it:

```javascript title:server.js
const { ALLOW_WEB_VIEWING } = require('./constants/index.js');
process.env.ALLOW_WEB_VIEWING = ALLOW_WEB_VIEWING ? '1' : '0';
```

```params-table
{"headers":["<code>ALLOW_WEB_VIEWING</code>","Behaviour"],"htmlColumns":[0,1],"rows":[["<code>false</code> (default)","Electron sets <code>SWITCH_LOCAL_AUTH_TOKEN</code> on the child. Requests without token → <strong>403 Unauthorized</strong>."],["<code>true</code>","Token check skipped. Open <code>http://127.0.0.1:&lt;port&gt;/</code> in Chrome/Edge for debugging. Ship with <code>false</code>."]]}
```

---

### How auth works

```text
electron/main.js
  → createLocalSession()           // random token
  → fork server with SWITCH_LOCAL_AUTH_TOKEN=token
  → set cookie switch-local-auth on BrowserWindow session
  → loadURL(http://127.0.0.1:port/)

server.js
  → server.use(localAuthMiddleware)
```

**`server/local-auth.js`** logic:

1. If **`ALLOW_WEB_VIEWING`** → pass through
2. If no **`SWITCH_LOCAL_AUTH_TOKEN`** in env → pass through (plain **`npm run dev`**)
3. Else require token via header **`x-auth-token`**, query **`?token=`**, or cookie **`switch-local-auth`**

---

### Debugging in a normal browser

1. Set **`ALLOW_WEB_VIEWING = true`** in `constants/index.js`
2. Run **`npm run electron:dev`**
3. Copy port from terminal: **`[electron/child:app] http://127.0.0.1:54321`**
4. Open that URL in a browser
5. Set flag back to **`false`** before release builds

Alternative (keep flag false): copy token from Electron DevTools → Application → Cookies, or append **`?token=…`** to the URL (dev only).

---

### Plain web dev (`npm run dev`)

No Electron → no **`SWITCH_LOCAL_AUTH_TOKEN`** → middleware is a **no-op**. Same `server.js` works for both commands.

---

### Custom middleware

Add your own checks **after** `localAuthMiddleware` in `initServer`:

```javascript
app.initServer((server) => {
  server.use(localAuthMiddleware);
  server.use('/api', createApiRouter());
});
```

Use **`switchFrameworkBackend.checkRestrict`** for session-role routing on top of this (see [[Server Introduction|docs/server/introduction]]).
