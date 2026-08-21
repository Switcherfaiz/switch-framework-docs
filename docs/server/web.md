## Web Server

For web-only apps, your `server.js` lives in the project root. Use `staticRoot: __dirname` so the backend serves your `index.html`, `app/`, and `assets/` from the same directory.

### CommonJS

```javascript title:Web server (CommonJS)
require('dotenv').config();
const path = require('node:path');
const switchFrameworkBackend = require('switch-framework-backend');

switchFrameworkBackend.config({
  PORT: 3000,
  staticRoot: __dirname,
  session: { secret: process.env.SESSION_SECRET || 'dev-secret', resave: false, saveUninitialized: false }
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
  });
  server.get('/api/hello', (req, res) => res.json({ message: 'Hello' }));
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));
});
```

### ESM

With `"type": "module"`, use `import`. For `__dirname`, use `path.dirname(fileURLToPath(import.meta.url))`.

```javascript title:Web server (ESM)
import path from 'path';
import { fileURLToPath } from 'url';
import switchFrameworkBackend from 'switch-framework-backend';
import { createApiRouter } from './routes/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

switchFrameworkBackend.config({ PORT: 5173, staticRoot: __dirname });

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', createApiRouter({ ... }));
});
```

### npm scripts

Add `"dev": "node server.js"` and `"start": "node server.js"` to your package.json. Run `npm run dev` to start the server.

### Separate Mongo API (`backend/`)

For a real database and file uploads, keep root `server.js` as the UI server and put Express + MongoDB in `backend/` with its own port.

```text
backend/
├── server.js
├── models/
├── routes/
├── middlewares/
└── uploads/
```

Root `server.js` proxies `/api` and `/uploads` to that API:

```javascript title:Proxy /api to the backend
app.initServer((server) => {
  server.use('/api', proxyToApi);
  server.use('/uploads', proxyToApi);
});
```

Start both:

```bash
npm run dev:backend
npm run dev
```

Or `npm run dev:all`. The API reads `MONGODB_URI` (default `mongodb://127.0.0.1:27017/switch-pins`) and `PORT` (default `4000`).
