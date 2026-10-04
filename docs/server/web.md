## Web Server

For browser-only apps, `server.js` lives in the project root. The backend serves your UI from **`staticRoot`** and your API from routes you register inside **`initServer`**.

> [!NOTE]
> This page describes **`switch-framework-backend`** only — not any specific sample app. Your API can use any database, file store, or external service you choose.

---

### Minimal `server.js`

```javascript title:server.js
const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');
const { PORT, SESSION_SECRET } = require('./constants/index.js');
const { createApiRouter } = require('./routes/api.js');

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
  server.use('/api', createApiRouter());
});
```

The CLI scaffolds this layout: `index.html`, `app/`, `assets/`, `routes/api.js`, and `constants/index.js` at the project root.

---

### Port configuration

```params-table
{"headers":["Source","Priority","Example"],"htmlColumns":[0,1,2],"rows":[["<code>process.env.PORT</code>","Highest (when set)","<code>PORT=4000 npm run dev</code>"],["<code>constants/index.js</code>","App default","Reads <code>pkg.switchFramework.port</code> from <code>package.json</code>"],["<code>switchFrameworkBackend.config({ PORT })</code>","What actually binds","Must match what you pass to <code>config()</code>"]]}
```

**`constants/index.js` (typical CLI scaffold):**

```javascript title:constants/index.js
const pkg = require('../package.json');

const PREFERRED_PORT = pkg.switchFramework?.port || 3000;
const PORT = process.env.PORT !== undefined && process.env.PORT !== ''
  ? Number(process.env.PORT)
  : PREFERRED_PORT;

module.exports = { PORT, SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret' };
```

When the server starts you will see:

```text
Switch Framework app running at http://localhost:3000
```

That log line confirms the bound port for web dev.

---

### `staticRoot`

Path to the folder containing **`index.html`**.

```params-table
{"headers":["Layout","<code>staticRoot</code> value","When to use"],"htmlColumns":[0,1,2],"rows":[["Standard web app","<code>path.join(__dirname, '.')</code>","UI files at project root (CLI default)."],["Monorepo / <code>both</code> layout","<code>path.join(__dirname, 'web')</code>","UI lives in a <code>web/</code> subfolder; <code>server.js</code> stays at root."]]}
```

The backend reads `index.html` from this folder and injects the Switch Framework import map on every SPA response. Extra npm packages listed in `switchFramework.imports` are added to that map — see [[Importing packages|docs/external-dependencies]].

---

### Adding API routes

Register routes **inside** `initServer` — after framework middleware, before static fallback:

```javascript title:routes/api.js
const express = require('express');

function createApiRouter() {
  const router = express.Router();
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.get('/items', (_req, res) => res.json([]));
  return router;
}

module.exports = { createApiRouter };
```

```javascript title:Mount in server.js
app.initServer((server) => {
  server.use('/api', createApiRouter());
});
```

Browser calls: `fetch('/api/health')` — same origin as the UI.

---

### ESM projects

With `"type": "module"` in `package.json`:

```javascript title:server.js (ESM)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import switchFrameworkBackend from 'switch-framework-backend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

switchFrameworkBackend.config({
  PORT: Number(process.env.PORT) || 3000,
  staticRoot: __dirname,
});

const app = switchFrameworkBackend();
app.initServer((server) => {
  server.use('/api', createApiRouter());
});
```

---

### npm scripts

```json title:package.json scripts
{
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "switchFramework": {
    "port": 3000
  }
}
```

Run **`npm run dev`**, open the URL printed in the terminal.

---

### Separate API server (optional pattern)

If you need a **second Express app** on another port (different process, different concern), that is entirely your architecture — `switch-framework-backend` does not require it. A common approach:

- **UI server** (this package) — port 3000, serves Switch Framework + static files
- **API server** (your own Express app) — port 4000, database and business logic
- Frontend calls the API with an absolute origin: `fetch('http://localhost:4000/api/...')`

Keep **`server.js`** as the UI entry either way. Only add a second server when you genuinely need a separate process or port.
