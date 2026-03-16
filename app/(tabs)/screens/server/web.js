import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsServerWebScreen extends SwitchComponent {
  static screenName = 'docs/server/web';
  static path = '/docs/server/web';
  static title = 'Web Server';
  static tag = 'sw-docs-server-web-screen';
  static layout = 'tabs';

  render() {
    const codeCommonJs = encodeData({
      title: 'Web server (CommonJS)',
      language: 'javascript',
      code: `require('dotenv').config();
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
});`
    });
    const codeEsm = encodeData({
      title: 'Web server (ESM)',
      language: 'javascript',
      code: `import path from 'path';
import { fileURLToPath } from 'url';
import switchFrameworkBackend from 'switch-framework-backend';
import { createApiRouter } from './routes/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

switchFrameworkBackend.config({ PORT: 5173, staticRoot: __dirname });

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', createApiRouter({ ... }));
});`
    });
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Web Server</h2>
        <p class="section-desc">
          For web-only apps, your <code>server.js</code> lives in the project root. Use <code>staticRoot: __dirname</code> so the backend serves your <code>index.html</code>, <code>app/</code>, and <code>assets/</code> from the same directory.
        </p>
        <h3 class="subsection" id="commonjs">CommonJS</h3>
        <sw-codeblock data="${codeCommonJs}"></sw-codeblock>
        <h3 class="subsection" id="esm">ESM</h3>
        <p class="section-desc">
          With <code>"type": "module"</code>, use <code>import</code>. For <code>__dirname</code>, use <code>path.dirname(fileURLToPath(import.meta.url))</code>.
        </p>
        <sw-codeblock data="${codeEsm}"></sw-codeblock>
        <h3 class="subsection" id="npm-scripts">npm scripts</h3>
        <p class="section-desc">
          Add <code>"dev": "node server.js"</code> and <code>"start": "node server.js"</code> to your package.json. Run <code>npm run dev</code> to start the server.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
