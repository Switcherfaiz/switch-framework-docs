import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsServerIntroScreen extends SwitchComponent {
  static screenName = 'docs/server/introduction';
  static path = '/docs/server/introduction';
  static title = 'Server Introduction';
  static tag = 'sw-docs-server-intro-screen';
  static layout = 'tabs';

  render() {
    const codeCommonJs = encodeData({
      title: 'server.js (CommonJS)',
      language: 'javascript',
      code: `require('dotenv').config();

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
});`
    });
    const codeEsm = encodeData({
      title: 'server.js (ESM)',
      language: 'javascript',
      code: `import switchFrameworkBackend from 'switch-framework-backend';

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 5173,
  staticRoot: __dirname
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', createApiRouter({ ... }));
});`
    });
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Server Introduction</h2>
        <p class="section-desc">
          <code>switch-framework-backend</code> provides a Next.js-like server API. You configure it once, then add your middleware inside <code>initServer</code>. The backend handles framework routes, import map injection, static files, and the SPA catch-all automatically.
        </p>
        <h3 class="subsection" id="commonjs">CommonJS (require)</h3>
        <p class="section-desc">
          Use <code>require('switch-framework-backend')</code> when your project uses CommonJS (default for Node, or <code>"type": "commonjs"</code> in package.json).
        </p>
        <sw-codeblock data="${codeCommonJs}"></sw-codeblock>
        <h3 class="subsection" id="esm">ESM (import)</h3>
        <p class="section-desc">
          Use <code>import switchFrameworkBackend from 'switch-framework-backend'</code> when your project uses ES modules (<code>"type": "module"</code> in package.json).
        </p>
        <sw-codeblock data="${codeEsm}"></sw-codeblock>
        <h3 class="subsection" id="config">Config options</h3>
        <ul class="feature-list">
          <li><code>PORT</code> – Server port (default: 3000)</li>
          <li><code>staticRoot</code> – Path to index.html and static files (e.g. <code>__dirname</code>)</li>
          <li><code>session</code> – express-session config (secret, resave, saveUninitialized)</li>
        </ul>
        <h3 class="subsection" id="user-functions">User functions</h3>
        <p class="section-desc">
          <code>switchFrameworkBackend.checkRestrict(config)</code> – Route restriction middleware. Use it inside <code>initServer</code> to protect routes by role.
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
        .feature-list { list-style: none; padding: 0; margin: 16px 0; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
        .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
