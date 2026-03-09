import { encodeData } from '/switch-framework/index.js';
import '../../../components/CodeBlock.js';

export const screen = {
  name: 'quickstart',
  path: '/docs/quickstart',
  title: 'Quick Start',
  tag: 'sw-quickstart-screen',
  layout: 'tabs'
};

export class SwQuickstartScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
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
      <div class="content">
        <h1 class="section-title">Quick Start</h1>
        <p class="section-desc">Create a minimal app with a stack and tabs:</p>
        <sw-codeblock data="${encodeData(quickstartCode)}"></sw-codeblock>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          color: #111827;
        }

        .content {
          padding: 32px 48px;
          max-width: 800px;
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

        code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 13px;
          color: #3713ec;
        }

        @media (max-width: 768px) {
          .content {
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

if (!customElements.get('sw-quickstart-screen')) {
  customElements.define('sw-quickstart-screen', SwQuickstartScreen);
}
