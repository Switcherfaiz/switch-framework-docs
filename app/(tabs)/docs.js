import '../../components/CodeBlock.js';
import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'docs',
  path: '/docs/:id',
  title: 'Docs',
  tag: 'sw-docs-screen',
  layout: 'tabs'
};

export class SwDocsScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.bindPagination();
  }

  bindPagination() {
    const prev = this.shadowRoot.querySelector('#pagination-prev');
    const next = this.shadowRoot.querySelector('#pagination-next');
    const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
    if (prev && typeof navigate === 'function') {
      prev.addEventListener('click', () => navigate('install'));
    }
    if (next && typeof navigate === 'function') {
      next.addEventListener('click', () => navigate('quickstart'));
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
      title: 'app.js',
      language: 'javascript',
      code: `import { Stack, Tabs, Router } from 'switch-framework';

const tabsLayout = Tabs({
  name: 'main-tabs',
  initialTab: 'home',
  tabs: [
    { name: 'home', title: 'Home', icon: 'home', path: '/home', screen: 'sw-home-screen' },
    { name: 'settings', title: 'Settings', icon: 'settings', path: '/settings', screen: 'sw-settings-screen' }
  ]
});

const stackScreens = [
  Stack.screen({ name: 'index', path: '/', title: 'Welcome', tag: 'sw-index-screen' }),
  Stack.screen({ name: '+not-found', path: '/+not-found', title: 'Not Found', tag: 'sw-not-found-screen' })
];

const layout = {
  splash: 'sw-starter-splash',
  initialRoute: 'index',
  screens: registerScreens({ stackScreens, tabsLayout }).screens,
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
        <main class="main">
          <section id="intro" class="section">
            <h1 class="section-title">Introduction</h1>
            <p class="section-desc">
              Switch Framework is a frontend framework designed to work together with <code>switch-framework-backend</code> to build:
            </p>
            <ul class="feature-list">
              <li>Web apps</li>
              <li>Electron desktop apps</li>
            </ul>
            <p class="section-desc">
              The goal is a runtime-first workflow where apps can run without a traditional build step (no bundler required for the basic setup), and the framework is served and executed at runtime.
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
            <p class="section-desc">Create a minimal app with a stack and tabs:</p>
            <sw-codeblock data="${encodeData(quickstartCode)}"></sw-codeblock>
          </section>

          <section id="router" class="section">
            <h2 class="section-title">Router</h2>
            <p class="section-desc">
              The Router manages navigation between stack and tab screens. Use <code>Stack.screen</code> for top-level routes and <code>Tabs.screen</code> for nested tab navigation.
            </p>
            <sw-codeblock data="${encodeData({
              title: 'router.js',
              language: 'javascript',
              code: `import { Router } from 'switch-framework';

const app = Router(layout);
app.start();`
            })}"></sw-codeblock>
          </section>

          <section id="state" class="section">
            <h2 class="section-title">State Management</h2>
            <p class="section-desc">
              Switch Framework includes a minimal state engine using cells, subscriptions, and a scheduler—no Virtual DOM or diffing.
            </p>
            <ul class="feature-list">
              <li>Cells hold values and versions</li>
              <li>Effects subscribe to cells and run on change</li>
              <li>Scheduler batches updates</li>
              <li>Components can bind to any cell without prop drilling</li>
            </ul>
          </section>

          <!-- Pagination -->
          <div class="pagination">
            <button id="pagination-prev" class="pagination-btn prev">
              <span class="material-symbols-outlined">chevron_left</span>
              <div class="pagination-text">
                <span class="pagination-label">Previous</span>
                <span class="pagination-page">Introduction</span>
              </div>
            </button>
            <button id="pagination-next" class="pagination-btn next">
              <div class="pagination-text">
                <span class="pagination-label">Next</span>
                <span class="pagination-page">Installation</span>
              </div>
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        :host {
          display: block;
          width: 100%;
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          background: #ffffff;
          color: #111827;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .main {
          flex: 1;
          overflow-y: auto;
          padding: 32px 48px;
          max-width: 800px;
        }

        .section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 16px;
        }

        .section-desc {
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 16px;
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
          color: #374151;
        }

        .feature-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #3713ec;
          font-weight: bold;
        }

        code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 13px;
          color: #3713ec;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover {
          background: #f9fafb;
          border-color: #3713ec;
          color: #3713ec;
        }

        .pagination-btn.prev {
          margin-right: auto;
        }

        .pagination-btn.next {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .pagination-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .pagination-btn.next .pagination-text {
          align-items: flex-end;
        }

        .pagination-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pagination-page {
          font-size: 14px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .main {
            padding: 24px 20px;
          }

          .section-title {
            font-size: 24px;
          }

          .pagination {
            flex-direction: column;
            gap: 12px;
          }

          .pagination-btn.prev,
          .pagination-btn.next {
            width: 100%;
            justify-content: center;
          }

          .pagination-btn.next {
            flex-direction: row;
          }

          .pagination-text {
            align-items: center !important;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-screen')) {
  customElements.define('sw-docs-screen', SwDocsScreen);
}
