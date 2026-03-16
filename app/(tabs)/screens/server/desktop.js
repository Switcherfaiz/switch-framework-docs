import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsServerDesktopScreen extends SwitchComponent {
  static screenName = 'docs/server/desktop';
  static path = '/docs/server/desktop';
  static title = 'Desktop Server';
  static tag = 'sw-docs-server-desktop-screen';
  static layout = 'tabs';

  render() {
    const codeServer = encodeData({
      title: 'server.js (Electron)',
      language: 'javascript',
      code: `require('dotenv').config();

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
});`
    });
    const codeMain = encodeData({
      title: 'main.js (Electron)',
      language: 'javascript',
      code: `const { app, BrowserWindow } = require('electron');
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
}`
    });
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Desktop Server (Electron)</h2>
        <p class="section-desc">
          For Electron apps, the server runs inside the main process. The structure is <code>main.js</code> (Electron entry) and <code>server.js</code> (Express). The server uses the same <code>switch-framework-backend</code> API; <code>staticRoot</code> points to the web folder (e.g. <code>path.join(__dirname, 'web')</code> for <code>app-type: both</code>).
        </p>
        <h3 class="subsection" id="server">server.js</h3>
        <sw-codeblock data="${codeServer}"></sw-codeblock>
        <h3 class="subsection" id="main">main.js</h3>
        <p class="section-desc">
          Electron's main process loads the server, then opens a BrowserWindow that loads <code>http://localhost:PORT</code>. The server must start before the window loads.
        </p>
        <sw-codeblock data="${codeMain}"></sw-codeblock>
        <h3 class="subsection" id="cli">Using the CLI</h3>
        <p class="section-desc">
          Run <code>npx create-switch-framework-app my-app --app-type electron</code> to scaffold an Electron project with server.js and main.js preconfigured.
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
