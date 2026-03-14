import { SwitchComponent, encodeData } from '/switch-framework/index.js';

const DOC_STYLES = `
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
`;

export class SwDocsFolderStructureScreen extends SwitchComponent {
  static screenName = 'docs/folder-structure';
  static path = '/docs/folder-structure';
  static title = 'Folder Structure';
  static tag = 'sw-docs-folder-structure-screen';
  static layout = 'tabs';

  render() {
    const structure = {
      title: 'Web app structure',
      language: 'text',
      code: `my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── index.js            # startApp(layout)
├── server.js           # Express server (serves static + switch-framework)
├── app/
│   ├── _layout.js      # StackLayout with stackScreens, tabsLayout
│   ├── index.js        # Home screen
│   ├── +not-found.js   # 404 screen
│   └── (tabs)/
│       ├── _layout.js  # TabLayout + screens
│       ├── index.js    # Tab screen
│       └── explore.js  # Tab screen
├── components/         # Reusable components
└── assets/             # Styles, fonts, icons`
    };

    const indexHtml = {
      title: 'index.html',
      language: 'html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Switch Framework App</title>
  <link rel="stylesheet" href="/assets/styles/styles.css">
  <link rel="stylesheet" href="/assets/icons/style.css">
</head>
<body>
  <sw-app-initial></sw-app-initial>
  <script type="module" src="/index.js"></script>
</body>
</html>`
    };

    const electronStructure = {
      title: 'Electron app structure',
      language: 'text',
      code: `my-app/
├── index.html          # Same as web – <sw-app-initial> + script
├── index.js            # startApp(layout)
├── main.js             # Electron entry (requires electron/main.js)
├── preload.js          # Electron preload (requires electron/preload.js)
├── server.js           # Express server (Electron loads http://localhost:PORT)
├── electron/
│   ├── main.js         # Electron BrowserWindow, loads app URL
│   ├── preload.js      # contextBridge for renderer
│   └── electron-builder.json
├── app/
│   ├── _layout.js
│   ├── index.js
│   ├── +not-found.js
│   └── (tabs)/
│       ├── _layout.js
│       ├── index.js
│       └── explore.js
├── components/
└── assets/`
    };

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Folder Structure</h2>
        <p class="section-desc">
          A typical Switch Framework app follows a simple folder structure. The <code>app/</code> directory holds your layout and screens; <code>components/</code> holds shared UI.
        </p>
        <h3 class="subsection" id="structure">Web app structure</h3>
        <sw-codeblock data="${encodeData(structure)}"></sw-codeblock>
        <h3 class="subsection" id="index-html">index.html</h3>
        <p class="section-desc">
          The entry HTML must include <code>&lt;sw-app-initial&gt;</code> (where the framework mounts) and a module script that loads <code>index.js</code>. Link your global styles (e.g. CSS variables) in the head.
        </p>
        <sw-codeblock data="${encodeData(indexHtml)}"></sw-codeblock>
        <h3 class="subsection" id="electron">Electron app structure</h3>
        <p class="section-desc">
          Electron apps add <code>main.js</code>, <code>preload.js</code>, and an <code>electron/</code> folder. The server runs first; Electron's BrowserWindow loads <code>http://localhost:PORT</code>. Use <code>npm run electron:dev</code> to start.
        </p>
        <sw-codeblock data="${encodeData(electronStructure)}"></sw-codeblock>
        <h3 class="subsection" id="key-files">Key files</h3>
        <ul class="feature-list">
          <li><code>index.html</code> – Entry point. Contains <code>&lt;sw-app-initial&gt;</code> and script tag for <code>index.js</code>.</li>
          <li><code>index.js</code> – Bootstraps the app with <code>startApp(layout)</code>.</li>
          <li><code>app/_layout.js</code> – Root layout. Defines <code>stackScreens</code>, <code>tabsLayout</code>, <code>init</code>.</li>
          <li><code>app/(tabs)/_layout.js</code> – Tab layout. Defines <code>screens</code> and <code>tabs</code>.</li>
          <li><code>app/(tabs)/</code> – Individual screen components (e.g. <code>index.js</code>, <code>explore.js</code>).</li>
        </ul>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
