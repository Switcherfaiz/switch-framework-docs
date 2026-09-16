## Server Introduction

`switch-framework-backend` is the Express wrapper every Switch Framework app uses. You call **`config()`** once, then **`initServer(callback)`** to attach your API routes and middleware. The package handles framework asset routes, import-map injection, static files, and the SPA catch-all for you.

Works the same for **web** (`node server.js`) and **Electron** (child process running the same `server.js`).

---

### Quick start

```javascript title:server.js (CommonJS)
const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const { PORT, SESSION_SECRET } = require('./constants/index.js');

switchFrameworkBackend.config({
  PORT,
  staticRoot: path.join(__dirname, '.'),
  session: {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  },
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.get('/api/hello', (_req, res) => res.json({ ok: true }));
});
```

> [!TIP]
> See [[Web Server|docs/server/web]] for web-only setup and [[Desktop Server|docs/server/desktop]] for Electron child-process setup.

---

### `switchFrameworkBackend.config(options)`

Call **before** `switchFrameworkBackend()`. Options merge into an internal config object.

```params-table
{"headers":["Option","Type","Default","What it does"],"htmlColumns":[0,1,2,3],"rows":[["<code>PORT</code>","number","<code>3000</code>","TCP port passed to <code>httpServer.listen(PORT)</code>. Use <code>0</code> in Electron child mode so the OS picks a free port."],["<code>staticRoot</code>","string","<code>process.cwd()</code>","Folder that contains <code>index.html</code>, <code>app/</code>, and <code>assets/</code>. Express serves static files from here and injects the Switch Framework import map into HTML."],["<code>session</code>","object","see below","Forwarded to <code>express-session</code>. Typical fields: <code>secret</code>, <code>resave</code>, <code>saveUninitialized</code>."],["<code>onHttpServer</code>","function","—","Optional. Called with the Node <code>http.Server</code> instance before <code>listen()</code>. Electron child bootstrap uses this to patch <code>listen()</code> and report the bound port over IPC."]]}
```

**Default session shape:**

```javascript
session: {
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
}
```

---

### `app.initServer(callback)`

Returns nothing synchronously; starts the HTTP server inside the callback pipeline.

**Order of operations (you do not configure this manually):**

1. Create Express app + JSON body parser + session middleware
2. Register Switch Framework routes (`/switch-framework`, import map, legacy redirects)
3. **Your callback** — add `/api` routes, auth, logging here
4. Register `/` and `/index.html` handler (import map injection)
5. Static file middleware for `staticRoot`
6. SPA catch-all (non-API unknown paths → `index.html`)
7. Create `http.Server`, run optional `onHttpServer` hook, then `listen(PORT)`

```javascript title:Typical initServer body
app.initServer((server) => {
  server.use(myAuthMiddleware);
  server.use('/api', createApiRouter());
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
```

Middleware you add in the callback runs **after** framework routes are registered but **before** the static/SPA fallback — so `/api/*` hits your handlers first.

---

### What the backend adds automatically

```params-table
{"headers":["Feature","Behaviour"],"htmlColumns":[0,1],"rows":[["Import map injection","Injects <code>&lt;script type=\"importmap\"&gt;</code> into <code>index.html</code> so the browser can import <code>switch-framework</code> without a bundler."],["Framework routes","Serves the installed <code>switch-framework</code> package at <code>/switch-framework/*</code> with correct JS MIME types."],["Legacy redirects","Redirects old paths like <code>/router/*</code> to <code>/switch-framework/router/*</code>."],["Static files","Serves <code>staticRoot</code> (JS, CSS, images, fonts)."],["SPA fallback","Non-file routes (no extension) return <code>index.html</code> for client-side routing. <code>/api/*</code> 404s as JSON instead."]]}
```

---

### `switchFrameworkBackend.checkRestrict(config)`

Role-based route guard using `express-session`. Use inside `initServer`.

```params-table
{"headers":["Config key","Type","Purpose"],"htmlColumns":[0,1,2],"rows":[["<code>public</code>","string[]","Paths always allowed without login (prefix match)."],["<code>rules</code>","object[]","Each rule: <code>{ path?, prefix?, roles, onUnauthenticated?, onForbidden? }</code>. First match wins."],["<code>roles</code>","string[]","Allowed session user roles. Use <code>'*'</code> for any authenticated user."]]}
```

```javascript title:Example restrict config
const restrictConfig = {
  public: ['/', '/login'],
  rules: [
    { prefix: '/admin', roles: ['admin'] },
    { path: '/login', roles: ['*'] },
  ],
};

app.initServer((server) => {
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
```

Session user is read from `req.session.user` (shape your login route sets).

---

### Web vs Electron

```params-table
{"headers":["Topic","Web (<code>npm run dev</code>)","Electron (<code>npm run electron:dev</code>)"],"htmlColumns":[0,1,2],"rows":[["Process","Same Node process as <code>server.js</code>","Separate child process forked from <code>electron/main.js</code>"],["Port","Fixed — <code>PORT</code> env or <code>switchFramework.port</code> in <code>package.json</code>","Dynamic — child sets <code>PORT=0</code>, OS assigns port, reported via IPC"],["<code>staticRoot</code>","Usually <code>path.join(__dirname, '.')</code>","Same, or <code>'web'</code> for monorepo <code>both</code> layout"],["Auth","Your middleware only","Optional <code>local-auth</code> token when <code>ALLOW_WEB_VIEWING</code> is false"],["Details","[[Web Server|docs/server/web]]","[[Desktop Server|docs/server/desktop]]"]]}
```
