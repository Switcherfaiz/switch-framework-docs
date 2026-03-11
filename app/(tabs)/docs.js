import '../../components/CodeBlock.js';
import '../../components/DocsParamsTable.js';
import '../../components/DocsPagination.js';
import { encodeData } from '/switch-framework/index.js';
import { useParams, getActiveRoute } from '/switch-framework/router/index.js';

export const screen = {
  name: 'docs',
  path: '/docs/:id',
  title: 'Docs',
  tag: 'sw-docs-screen',
  layout: 'tabs'
};

const SECTION_MAP = {
  introduction: 'intro',
  installation: 'install',
  quickstart: 'quickstart',
  cli: 'cli',
  router: 'router',
  state: 'state',
  theming: 'theming'
};

function getSectionIdFromRoute() {
  const params = useParams();
  const id = params.id || (getActiveRoute().split('/').pop()) || 'introduction';
  return SECTION_MAP[id] || 'intro';
}

export class SwDocsScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();
    this.showActiveSection();

    if (globalStates?.subscribe) {
      this._unsub = globalStates.subscribe(() => this.showActiveSection());
    }
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }

  showActiveSection() {
    const sectionId = getSectionIdFromRoute();
    if (!this.shadowRoot) return;

    this.shadowRoot.querySelectorAll('.section').forEach((s) => { s.style.display = 'none'; });
    const active = this.shadowRoot.querySelector(`#${sectionId}`);
    if (active) active.style.display = 'block';
    else {
      const intro = this.shadowRoot.querySelector('#intro');
      if (intro) intro.style.display = 'block';
    }
  }

  render() {
    const installCode = {
      title: 'bash',
      language: 'bash',
      code: `npm i switch-framework switch-framework-backend`
    };

    const createCode = {
      title: 'bash',
      language: 'bash',
      code: `npx create-switch-framework-app my-app`
    };

    const quickstartCode = {
      title: 'app/_layout.js',
      language: 'javascript',
      code: `import { Stack, registerScreens } from '/switch-framework/index.js';
import tabsLayout from './(tabs)/_layout.js';

const stackScreens = [
  Stack.screen({ name: 'index', path: '/', title: 'Welcome', tag: 'sw-index-screen' }),
  Stack.screen({ name: '+not-found', path: '/+not-found', title: 'Not Found', tag: 'sw-not-found-screen' })
];

const screens = registerScreens({
  stackScreens,
  tabsLayout,
  tabScreens: tabsLayout.screens,
  validate: true
}).screens;

const layout = {
  splash: 'sw-starter-splash',
  initialRoute: 'index',
  screens,
  async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    await new Promise(r => setTimeout(r, 2000));
    globalStates.setState({ tabsLayout });
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
};

export default layout;`
    };

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="wrap">
        <main class="main docs-main">
          <div class="doc-content">
          <section id="intro" class="section">
            <h1 class="section-title">Introduction</h1>
            <p class="section-desc">
              Switch Framework is a lightweight, runtime-first frontend framework designed to work seamlessly with <code>switch-framework-backend</code> for building modern web and Electron applications. It prioritizes simplicity and developer experience without requiring a build step for basic setups.
            </p>
            <h3 class="subsection">What is Switch Framework?</h3>
            <p class="section-desc">
              Switch Framework provides a declarative routing system, component-based architecture using Web Components, and optional state management. It runs directly in the browser—no bundler required for getting started—so you can prototype quickly and iterate without complex tooling.
            </p>
            <h3 class="subsection">Key Features</h3>
            <ul class="feature-list">
              <li><strong>Runtime-first</strong> – No bundler required for basic setup. Use native ES modules and import maps.</li>
              <li><strong>Web Components</strong> – Built on Custom Elements for encapsulation and reusability.</li>
              <li><strong>Stack & Tabs layouts</strong> – Flexible navigation with stack layouts and tab-based navigation.</li>
              <li><strong>Backend integration</strong> – Works with <code>switch-framework-backend</code> for full-stack apps.</li>
              <li><strong>Theming</strong> – Built-in dark/light mode support with CSS variables.</li>
            </ul>
            <h3 class="subsection">When to Use Switch</h3>
            <p class="section-desc">
              Switch Framework is ideal for documentation sites, dashboards, internal tools, and apps that need a simple routing layer without the overhead of React or Vue. If you prefer vanilla JavaScript with minimal abstractions, Switch gives you structure without lock-in.
            </p>
          </section>

          <section id="install" class="section">
            <h2 class="section-title">Installation</h2>
            <p class="section-desc">Install the core packages:</p>
            <sw-codeblock data="${encodeData(installCode)}"></sw-codeblock>
            <p class="section-desc">Or create a new app:</p>
            <sw-codeblock data="${encodeData(createCode)}"></sw-codeblock>
          </section>

          <section id="quickstart" class="section">
            <h2 class="section-title">Quick Start</h2>
            <h3 class="subsection">Folder structure</h3>
            <sw-codeblock data="${encodeData({
              title: 'Project structure',
              language: 'text',
              code: `my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── index.js            # startApp(layout, appRegisters)
├── app/
│   ├── _layout.js      # Stack layout, registerScreens
│   ├── register.js     # Dynamic imports for screens/components
│   ├── index.js        # Home screen
│   └── (tabs)/
│       ├── _layout.js  # Tabs layout + tab screens
│       └── docs.js     # Tab screen
└── components/`})}"></sw-codeblock>
            <h3 class="subsection">Default files</h3>
            <p class="section-desc"><strong>index.js</strong> – Bootstrap the app:</p>
            <sw-codeblock data="${encodeData({
              title: 'index.js',
              language: 'javascript',
              code: `import { startApp } from '/switch-framework/index.js';
import layout from './app/_layout.js';
import { appRegisters } from './app/register.js';

startApp(layout, appRegisters);`
            })}"></sw-codeblock>
            <p class="section-desc"><strong>app/register.js</strong> – Import screens and components so they are loaded before routing:</p>
            <sw-codeblock data="${encodeData({
              title: 'app/register.js',
              language: 'javascript',
              code: `export async function appRegisters() {
  await Promise.all([
    import('./index.js'),
    import('./(tabs)/_layout.js'),
    import('./(tabs)/docs.js'),
    import('../components/MyComponent.js')
  ]);
}`
            })}"></sw-codeblock>
            <p class="section-desc"><strong>app/_layout.js</strong> – Stack layout with screens and init:</p>
            <sw-codeblock data="${encodeData(quickstartCode)}"></sw-codeblock>
            <h3 class="subsection">Layout parameters</h3>
            <p class="section-desc"><strong>layout</strong> object: <code>splash</code>, <code>initialRoute</code>, <code>screens</code>, <code>init</code></p>
            <p class="section-desc"><strong>init</strong> – async function run before app mounts. Receives <code>{ globalStates, renderSplashscreen }</code>. Return <code>{ splash, initialRoute }</code>. Call <code>renderSplashscreen('sw-starter-splash')</code> to show splash; <code>globalStates.setState({ tabsLayout })</code> to register tabs.</p>
            <p class="section-desc"><strong>Stack.screen</strong>: <code>name</code>, <code>path</code>, <code>title</code>, <code>tag</code> (custom element)</p>
            <p class="section-desc"><strong>Tabs.screen</strong>: same + <code>layout: 'tabs'</code>. Tab config: <code>name</code>, <code>title</code>, <code>path</code>, <code>icon</code>, <code>screen</code>, <code>match</code>, <code>initialRoute</code></p>
            <h3 class="subsection">Tab layout element</h3>
            <p class="section-desc">Your tabs layout custom element (e.g. <code>sw-tabs-layout</code>) must implement <code>getContentContainer()</code> returning the element where tab screens render. Use class <code>tabcontainer</code> for that element. The framework injects screen content into it.</p>
            <sw-codeblock data="${encodeData({
              title: '(tabs)/_layout.js',
              language: 'javascript',
              code: `getContentContainer() {
  return this.shadowRoot.querySelector('.tabcontainer');
}

render() {
  this.shadowRoot.innerHTML = \`
    <div class="layout">
      <nav class="tabbar"><!-- tab bar --></nav>
      <div class="tabcontainer"></div>
    </div>
  \`;
}`
            })}"></sw-codeblock>
            <h3 class="subsection">Splash screen & init</h3>
            <p class="section-desc"><code>init</code> runs before the app mounts. Call <code>renderSplashscreen('sw-starter-splash')</code> to show a splash. Do async work (e.g. auth), then <code>globalStates.setState({ tabsLayout })</code>. Return <code>{ splash, initialRoute }</code>.</p>
          </section>

          <section id="cli" class="section">
            <h2 class="section-title">CLI: create-switch-framework-app</h2>
            <p class="section-desc">
              Use <code>create-switch-framework-app</code> to scaffold a new Switch Framework project. Run with <code>npx</code>:
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Basic usage',
              language: 'bash',
              code: `npx create-switch-framework-app <project-name> [options]`
            })}"></sw-codeblock>
            <h3 class="subsection">Options</h3>
            <sw-docs-params-table data="${encodeData({
              headers: ['Option', 'Description'],
              htmlColumns: [0, 1],
              rows: [
                ['<code>--yes</code>, <code>-y</code>', 'Skip prompts and use defaults'],
                ['<code>--app-type &lt;type&gt;</code>', 'One of: <code>web</code> | <code>electron</code> | <code>both</code>. Web creates a browser + Node.js/Express app. Electron adds a desktop target. Both creates a monorepo.'],
                ['<code>--port &lt;port&gt;</code>', 'Server port (1–65535). Default: 3000'],
                ['<code>--no-install</code>', 'Do not run <code>npm install</code> after creating the project'],
                ['<code>--use-local</code>', 'Use <code>npm link</code> for switch-framework and switch-framework-backend instead of npm registry (for local development)'],
                ['<code>-h</code>, <code>--help</code>', 'Show help']
              ]
            })}"></sw-docs-params-table>
            <h3 class="subsection">Examples</h3>
            <sw-codeblock data="${encodeData({
              title: 'Interactive (prompts)',
              language: 'bash',
              code: `npx create-switch-framework-app my-app`
            })}"></sw-codeblock>
            <sw-codeblock data="${encodeData({
              title: 'Non-interactive with options',
              language: 'bash',
              code: `npx create-switch-framework-app my-app --yes --app-type web --port 4000`
            })}"></sw-codeblock>
            <sw-codeblock data="${encodeData({
              title: 'Electron app',
              language: 'bash',
              code: `npx create-switch-framework-app my-desktop-app --app-type electron --port 3000`
            })}"></sw-codeblock>
            <sw-codeblock data="${encodeData({
              title: 'Use local packages (dev)',
              language: 'bash',
              code: `# First run npm link in switch-framework and switch-framework-backend
npx create-switch-framework-app my-app --use-local`
            })}"></sw-codeblock>
            <h3 class="subsection">Next steps</h3>
            <p class="section-desc">After creation, run <code>cd &lt;project-name&gt;</code>, then <code>npm run dev</code> (web) or <code>npm run electron:dev</code> (Electron).</p>
          </section>

          <section id="router" class="section">
            <h2 class="section-title">Router</h2>
            <p class="section-desc">Import routing functions from <code>switch-framework/router</code>:</p>
            <sw-codeblock data="${encodeData({
              title: 'Import router helpers',
              language: 'javascript',
              code: `import {
  navigate,
  goBack,
  useParams,
  getActiveRoute,
  useRouteChangesSubscriber,
  previousRoute,
  nextRoute
} from '/switch-framework/router/index.js';`
            })}"></sw-codeblock>
            <h3 class="subsection">Navigation</h3>
            <sw-codeblock data="${encodeData({
              title: 'Navigation examples',
              language: 'javascript',
              code: `navigate('docs/introduction');  // Go to route
goBack();                 // Browser back
redirect('/login');       // Same as navigate
replace('/home');         // Replace history entry`
            })}"></sw-codeblock>
            <h3 class="subsection">Route params & state</h3>
            <sw-codeblock data="${encodeData({
              title: 'Params and route helpers',
              language: 'javascript',
              code: `const params = useParams();      // { id: '123' } from /user/:id
const search = useSearchParams();  // ?tab=settings
const current = getActiveRoute();  // 'docs/introduction'`
            })}"></sw-codeblock>
            <h3 class="subsection">Defined & active routes</h3>
            <sw-codeblock data="${encodeData({
              title: 'Route lists',
              language: 'javascript',
              code: `getDefinedRoutes();   // ['/', '/docs/introduction', ...]
getActiveRoutes();   // [{ path, route, params, title }, ...]`
            })}"></sw-codeblock>
            <h3 class="subsection">Pagination helpers</h3>
            <sw-codeblock data="${encodeData({
              title: 'previousRoute / nextRoute',
              language: 'javascript',
              code: `const prev = previousRoute('docs');  // { route, params, title }
const next = nextRoute('docs');
if (prev) navigate(prev.route, prev.params);`
            })}"></sw-codeblock>
          </section>

          <section id="state" class="section">
            <h2 class="section-title">State Management</h2>
            <p class="section-desc">
              Use <code>useRouteChangesSubscriber(callback)</code> from the router to react to route changes. Returns an unsubscribe function.
            </p>
            <ul class="feature-list">
              <li><code>getActiveRoute()</code> – current route string</li>
              <li><code>useRouteChangesSubscriber(fn)</code> – subscribe to route changes, returns unsubscribe</li>
            </ul>
          </section>

          <section id="theming" class="section">
            <h2 class="section-title">Theming</h2>
            <p class="section-desc">
              Switch Framework provides theme helpers for dark and light mode. Import from <code>switch-framework/themes</code>:
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Import theme helpers',
              language: 'javascript',
              code: `import {
  getSystemTheme,
  getTheme,
  changeTheme,
  initTheme,
  useThemesChangesSubscriber
} from '/switch-framework/themes/index.js';`
            })}"></sw-codeblock>
            <h3 class="subsection">Setup</h3>
            <p class="section-desc">
              In your <code>assets/styles</code> folder, add a <code>styles.css</code> with <code>:root</code> and <code>body[data-theme="dark"]</code> for CSS variables. The theme helpers set <code>data-theme</code> on <code>document.body</code>.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'styles.css (example)',
              language: 'text',
              code: `:root, body {
  --page_background: #ffffff;
  --main_text: #0f172a;
}

body[data-theme="dark"] {
  --page_background: #0f172a;
  --main_text: #f8fafc;
}`
            })}"></sw-codeblock>
            <h3 class="subsection">Initialize on app start</h3>
            <p class="section-desc">
              Call <code>initTheme()</code> before <code>startApp</code> so the app loads with the correct theme. It checks <code>localStorage</code> first; if no stored theme, it uses the system preference.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'index.js',
              language: 'javascript',
              code: `import { startApp } from '/switch-framework/index.js';
import { initTheme } from '/switch-framework/themes/index.js';

initTheme();
startApp(layout, appRegisters);`
            })}"></sw-codeblock>
            <h3 class="subsection">API</h3>
            <ul class="feature-list">
              <li><code>getSystemTheme()</code> – returns <code>'dark'</code> or <code>'light'</code> from system preference</li>
              <li><code>getTheme()</code> – returns current theme (localStorage first, else system)</li>
              <li><code>changeTheme('dark'|'light')</code> – sets theme, updates <code>data-theme</code>, saves to localStorage</li>
              <li><code>useThemesChangesSubscriber(callback)</code> – subscribe to theme changes; callback receives current theme; returns unsubscribe</li>
            </ul>
          </section>
          </div>
          <sw-docs-pagination class="pagination-sticky"></sw-docs-pagination>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        :host {
          display: block;
          width: 100%;
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          background: var(--page_background);
          color: var(--main_text);
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100%;
        }

        .docs-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
          padding: 32px 48px;
          width: 100%;
        }

        .doc-content {
          flex: 1;
          min-height: min-content;
        }

        .pagination-sticky {
          margin-top: auto;
          flex-shrink: 0;
        }

        .main {
          flex: 1;
          overflow-y: auto;
          padding: 32px 48px;
          width: 100%;
        }

        .section {
          margin-bottom: 48px;
          display: none; /* Hidden by default */
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--main_text);
          margin-bottom: 16px;
        }

        .subsection {
          font-size: 18px;
          font-weight: 600;
          color: var(--sub_text);
          margin: 36px 0 16px;
        }

        .subsection:first-of-type {
          margin-top: 24px;
        }

        .section-desc {
          font-size: 16px;
          line-height: 1.7;
          color: var(--sub_text);
          margin-bottom: 20px;
        }

        .section-desc + sw-codeblock {
          margin-top: 8px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 16px 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          font-size: 15px;
          color: var(--sub_text);
        }

        .feature-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }

        code {
          background: var(--code_bg);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 13px;
          color: var(--code_text);
        }

        sw-codeblock {
          display: block;
          margin: 28px 0;
        }

        @media (max-width: 768px) {
          .main {
            padding: 24px 20px;
          }

          .section-title {
            font-size: 24px;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-screen')) {
  customElements.define('sw-docs-screen', SwDocsScreen);
}
