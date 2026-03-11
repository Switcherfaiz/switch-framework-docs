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
  theming: 'theming',
  animations: 'animations',
  changelogs: 'changelogs'
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
              <strong>Switch Framework</strong> is a lightweight, runtime-first frontend framework that plays nicely with <code>switch-framework-backend</code>. Think of it as your friendly neighborhood router + component layer – no build step required, no webpack config to cry over. Just HTML, ES modules, and a sprinkle of structure.
            </p>
            <h3 class="subsection">What's the deal?</h3>
            <p class="section-desc">
              You get a declarative routing system (stack screens, tab navigation), Web Components for encapsulation, and optional state management. Everything runs directly in the browser – no bundler needed to get started. Prototype fast, ship faster. If you've ever wanted "React Router but simpler" or "Vue's structure without the framework," Switch is here for you.
            </p>
            <h3 class="subsection">Key Features</h3>
            <ul class="feature-list">
              <li><strong>Runtime-first</strong> – No bundler required. Use native ES modules. Your <code>index.html</code> loads scripts, and you're off to the races.</li>
              <li><strong>Web Components</strong> – Built on Custom Elements. Encapsulation, reusability, shadow DOM – the whole package.</li>
              <li><strong>Stack & Tabs layouts</strong> – Stack for "push a screen, pop it back" flows. Tabs for bottom nav, side nav, whatever you need.</li>
              <li><strong>Backend integration</strong> – <code>switch-framework-backend</code> gives you auth, sessions, and API helpers. Full-stack made easy.</li>
              <li><strong>Theming</strong> – Dark/light mode with CSS variables. One line to init, and you're themed.</li>
            </ul>
            <h3 class="subsection">When should I use Switch?</h3>
            <p class="section-desc">
              Documentation sites, dashboards, internal tools, admin panels – anything that needs routing and a bit of structure without the overhead of a big framework. If you like vanilla JS and want "just enough" abstraction, Switch fits. If you're building the next Facebook, maybe reach for something heavier – but for most apps, Switch has your back.
            </p>
          </section>

          <section id="install" class="section">
            <h2 class="section-title">Installation</h2>
            <p class="section-desc">
              Two ways to get started: install the packages yourself, or let the CLI do the heavy lifting. We recommend the CLI – it scaffolds everything so you can start coding in seconds.
            </p>
            <h3 class="subsection">Option 1: Manual install</h3>
            <p class="section-desc">Add the core packages to your project:</p>
            <sw-codeblock data="${encodeData(installCode)}"></sw-codeblock>
            <h3 class="subsection">Option 2: Create a new app (recommended)</h3>
            <p class="section-desc">One command, full project structure. Web, Electron, or both – you choose:</p>
            <sw-codeblock data="${encodeData(createCode)}"></sw-codeblock>
            <p class="section-desc">
              <strong>Using the local framework?</strong> Run <code>npm link</code> in your <code>switch-framework</code> folder, then <code>npm link switch-framework</code> in your app. Your app will use your local copy instead of the npm version.
            </p>
          </section>

          <section id="quickstart" class="section">
            <h2 class="section-title">Quick Start</h2>
            <p class="section-desc">
              Here's the mental model: you have a <strong>layout</strong> (stack + optional tabs), <strong>screens</strong> (routes mapped to custom elements), and an <strong>init</strong> phase where you load data and show a splash. Once you get this, you've got 80% of the framework.
            </p>
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
            <p class="section-desc">
              The router handles URL → screen mapping, history, and params. Import what you need from <code>/switch-framework/router/index.js</code> – no magic, just functions that talk to the router via <code>globalStates</code>.
            </p>
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
            <h2 class="section-title">State Management (SwitchStateManager)</h2>
            <p class="section-desc">
              Need to share data between components that live in totally different parts of your app? Say hello to <strong>SwitchStateManager</strong> – a lightweight, event-driven state system. Create a state once, subscribe from anywhere, update from anywhere. No prop drilling, no context providers. Just good ol' reactive state that works.
            </p>
            <h3 class="subsection">The Big Idea</h3>
            <p class="section-desc">
              You give each state a unique <strong>identifier</strong> (a string like <code>'patient-list'</code> or <code>'cart-items'</code>). One component creates it and gets a setter. Other components – anywhere in the tree – can subscribe and get updates. When someone calls <code>updateState</code>, every subscriber gets notified. Magic! ✨
            </p>
            <h3 class="subsection">Create a state</h3>
            <p class="section-desc">
              Call <code>createState(initialValue, identifier)</code> once – typically in your layout <code>init</code> or a root component. It returns <code>[getValue, setValue]</code>. The identifier must be unique – think of it as the state's "event name" for the whole app.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'app/_layout.js – create state at app boot',
              language: 'javascript',
              code: `import { createState } from '/switch-framework/index.js';

export default {
  async init({ globalStates, renderSplashscreen }) {
    // Create once – any component can now subscribe
    createState([], 'patient-list');
    createState(0, 'docs-helpful-count');

    // ... rest of init
  }
};`
            })}"></sw-codeblock>
            <h3 class="subsection">Subscribe in a component (useState)</h3>
            <p class="section-desc">
              Use <code>useState(identifier, callback)</code> to consume a state. You get <code>[currentValue, unsubscribe]</code>. The callback runs immediately with the current value, and again whenever the state changes. Perfect for fine-grained DOM updates without re-rendering the whole component!
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Component – subscribe and react',
              language: 'javascript',
              code: `import { useState, updateState } from '/switch-framework/index.js';

class MyPatientList extends HTMLElement {
  connectedCallback() {
    this.render();

    const [patients, unsubscribe] = useState('patient-list', (newPatients) => {
      // Optional: update only the count element
      const el = this.shadowRoot?.querySelector('#patient-count');
      if (el) el.textContent = \`Patients: \${newPatients.length}\`;
    });
    this._unsub = unsubscribe;
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }
}`
            })}"></sw-codeblock>
            <h3 class="subsection">Update from anywhere (updateState)</h3>
            <p class="section-desc">
              Don't have the setter? No problem. <code>updateState(identifier, newValueOrUpdater)</code> updates any state by its identifier. Pass a value or an updater function <code>(old) => new</code>. Every subscriber gets the new value.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Update state from any component',
              language: 'javascript',
              code: `import { updateState } from '/switch-framework/index.js';

// Add a patient
updateState('patient-list', (list) => [...list, newPatient]);

// Increment a counter
updateState('docs-helpful-count', (n) => n + 1);`
            })}"></sw-codeblock>
            <h3 class="subsection">API summary</h3>
            <ul class="feature-list">
              <li><code>createState(initialValue, identifier)</code> – create a new state. Returns <code>[getValue, setValue]</code>. Throws if identifier already exists.</li>
              <li><code>useState(identifier, callback?)</code> – subscribe to a state. Returns <code>[currentValue, unsubscribe]</code>. Callback runs immediately and on every update.</li>
              <li><code>updateState(identifier, valueOrUpdater)</code> – update any state by identifier. Same as using the setter from createState.</li>
              <li><code>getState(identifier)</code> – read current value without subscribing.</li>
              <li><code>subscribeState(identifier, callback, options)</code> – lower-level subscribe. Returns unsubscribe. Use <code>options.immediate: false</code> to skip the initial call.</li>
            </ul>
            <p class="section-desc">
              <strong>Pro tip:</strong> Always call <code>unsubscribe</code> in your component's <code>disconnectedCallback</code> to avoid memory leaks. The "Was this helpful?" widget below uses this state – try it! 👇
            </p>
            <sw-docs-feedback></sw-docs-feedback>
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

          <section id="animations" class="section">
            <h2 class="section-title">Animations</h2>
            <p class="section-desc">
              Animations in Switch Framework are built with standard CSS: <code>@keyframes</code>, <code>transition</code>, and <code>animation</code>. No special library needed. You control visibility and animation state by toggling classes or inline styles – and our <strong>state functions</strong> (<code>updateState</code>, <code>subscribeState</code>) make those values reactive.
            </p>
            <h3 class="subsection">Basic @keyframes</h3>
            <p class="section-desc">
              Define keyframe animations in your component's stylesheet. Use <code>animation</code> or <code>animation-name</code> to apply them.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'CSS keyframes example',
              language: 'css',
              code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal {
  animation: slideUp 0.25s ease;
}

.overlay {
  animation: fadeIn 0.2s ease;
}`
            })}"></sw-codeblock>
            <h3 class="subsection">Transitions for simple state changes</h3>
            <p class="section-desc">
              Use <code>transition</code> for smooth property changes (opacity, transform, background). Toggle a class or style to trigger the transition.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Transition example',
              language: 'css',
              code: `.panel {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel.active {
  opacity: 1;
  transform: scale(1);
}`
            })}"></sw-codeblock>
            <h3 class="subsection">State-driven reactivity</h3>
            <p class="section-desc">
              Use <code>updateState</code> and <code>subscribeState</code> to control when animations run. A modal might subscribe to <code>modal-edit-profile</code> – when <code>open: true</code>, the component sets <code>display: flex</code> and applies an animation class. When <code>open: false</code>, it hides.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Modal – state controls visibility',
              language: 'javascript',
              code: `// Open from any screen:
updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });

// In the modal component:
subscribeState('modal-edit-profile', () => this.render());
const state = getState('modal-edit-profile');
this.style.display = state?.open ? 'flex' : 'none';
// Apply .active class for animation
this.classList.toggle('active', !!state?.open);`
            })}"></sw-codeblock>
            <h3 class="subsection">Toasts & alerts from bottom</h3>
            <p class="section-desc">
              For toasts or alerts that slide up from the bottom, use a transparent overlay and the same <code>slideUp</code> keyframe. The overlay doesn't block clicks when transparent – or use <code>pointer-events: none</code> on the overlay and <code>pointer-events: auto</code> only on the toast container.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'Toast – bottom slide-up',
              language: 'css',
              code: `:host {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: transparent; /* No dimming */
}

.toast-container {
  padding: 14px 20px;
  background: var(--main_text);
  color: #fff;
  border-radius: 24px;
  animation: slideUp 0.3s ease;
}`
            })}"></sw-codeblock>
            <p class="section-desc">
              <strong>Summary:</strong> Use standard CSS for animations. Use state to control when they run – <code>updateState</code> to open/close, <code>subscribeState</code> to react and toggle classes or styles.
            </p>
          </section>

          <section id="changelogs" class="section">
            <h2 class="section-title">Changelogs</h2>
            <p class="section-desc">
              Release notes and version history for Switch Framework. Each version includes new features, improvements, and bug fixes.
            </p>

            <h3 class="subsection">v1.2.0 – March 10, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Added <code>SwitchStateManager</code> for lightweight reactive state management</li>
              <li>Introduced modal components with state-driven visibility and animations</li>
              <li>Added Toast/Alert components for bottom-up notifications</li>
              <li>New fullscreen pin viewer with scale-up reveal animation</li>
              <li>Framework theming system with dark/light mode support</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Refactored documentation to use modular screen components</li>
              <li>Enhanced animation system with keyframes and transitions</li>
              <li>Better code organization with state helpers in app/state.js</li>
              <li>Improved type safety in router with route parameter handling</li>
            </ul>
            <p class="section-desc"><strong>Bug Fixes</strong></p>
            <ul class="feature-list">
              <li>Fixed modal z-index stacking issues</li>
              <li>Corrected route matching for static vs dynamic paths</li>
              <li>Fixed template literal syntax in code blocks</li>
            </ul>

            <h3 class="subsection">v1.1.0 – February 28, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Added responsive tab layout system</li>
              <li>Introduced stack navigation for modal-like flows</li>
              <li>New router with URL parameter support</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Better CSS variable system for theming</li>
              <li>Optimized Web Components performance</li>
            </ul>

            <h3 class="subsection">v1.0.0 – January 15, 2026</h3>
            <p class="section-desc"><strong>Initial Release</strong></p>
            <ul class="feature-list">
              <li>Runtime-first framework with no build step required</li>
              <li>Web Components-based architecture</li>
              <li>Built-in router with stack and tab layouts</li>
              <li>Basic theming system</li>
              <li>Documentation and examples</li>
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
