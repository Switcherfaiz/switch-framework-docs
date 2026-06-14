require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
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


  const restrictConfig = {
    public: ['/', '/login'],
    rules: [
      { prefix: '/admin', roles: ['admin'] },
      { prefix: '/billing', roles: ['billing', 'admin'] },
      { path: '/login', roles: ['*'] }
    ]
  };
  server.use(switchFrameworkBackend.checkRestrict(restrictConfig));

  server.get('/docs', (req, res) => {
    res.redirect(301, '/docs/introduction');
  });

  const codeHighlighter = require('./routes/codeHighlighter.js');
  server.use('/codehighlighter', codeHighlighter);

  server.use((req, res, next) => {
    if (req.method !== 'GET' || !req.path.startsWith('/docs/') || !req.path.endsWith('.md')) {
      return next();
    }
    const rel = req.path.slice('/docs/'.length);
    const filePath = path.join(__dirname, 'docs', rel);
    if (!fs.existsSync(filePath)) return next();
    return res.type('text/plain; charset=utf-8').send(fs.readFileSync(filePath, 'utf8'));
  });
});
