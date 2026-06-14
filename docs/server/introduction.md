## Server Introduction

`switch-framework-backend` provides a Next.js-like server API. You configure it once, then add your middleware inside `initServer`. The backend handles framework routes, import map injection, static files, and the SPA catch-all automatically.

### CommonJS (require)

Use `require('switch-framework-backend')` when your project uses CommonJS (default for Node, or `"type": "commonjs"` in package.json).

```javascript title:server.js (CommonJS)
require('dotenv').config();

const switchFrameworkBackend = require('switch-framework-backend');

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  staticRoot: __dirname,
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
  });
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
```

### ESM (import)

Use `import switchFrameworkBackend from 'switch-framework-backend'` when your project uses ES modules (`"type": "module"` in package.json).

```javascript title:server.js (ESM)
import switchFrameworkBackend from 'switch-framework-backend';

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 5173,
  staticRoot: __dirname
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', createApiRouter({ ... }));
});
```

### Config options

- `PORT` – Server port (default: 3000)
- `staticRoot` – Path to index.html and static files (e.g. `__dirname`)
- `session` – express-session config (secret, resave, saveUninitialized)

### User functions

`switchFrameworkBackend.checkRestrict(config)` – Route restriction middleware. Use it inside `initServer` to protect routes by role.
