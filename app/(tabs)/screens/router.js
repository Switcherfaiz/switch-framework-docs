import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'router',
  path: '/docs/router',
  title: 'Router',
  tag: 'sw-docs-router-screen',
  layout: 'tabs'
};

export class SwDocsRouterScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Code block data
    this.codeRegisterScreens = encodeData({
      title: 'Register screens (app/_layout.js)',
      language: 'javascript',
      code: 'import { Stack, Tabs, registerScreens } from \'/switch-framework/index.js\';\n\nconst stackScreens = [\n  Stack.screen({ name: \'index\', path: \'/\', title: \'Home\', tag: \'tw-home-screen\' }),\n  Stack.screen({ name: \'user/:id\', path: \'/user/:id\', title: \'User\', tag: \'tw-user-screen\', props: \'encoded\' }),\n  Stack.screen({ name: \'+not-found\', path: \'/+not-found\', title: \'Not Found\', tag: \'sw-not-found-screen\' })\n];\n\nconst screens = registerScreens({\n  stackScreens,\n  tabsLayout,\n  tabScreens: tabsLayout.screens,\n  validate: true\n}).screens;'
    });

    this.codeNavigate = encodeData({
      title: 'Navigate to routes',
      language: 'javascript',
      code: 'import { navigate } from \'/switch-framework/router/index.js\';\n\n// Simple route\nnavigate(\'home\');\n\n// With params\nnavigate(\'user/42\');\nnavigate(\'docs\', { id: \'introduction\' });'
    });

    this.codeGetRoute = encodeData({
      title: 'Get route info in a screen',
      language: 'javascript',
      code: 'import { useParams, getActiveRoute } from \'/switch-framework/router/index.js\';\n\nexport class UserScreen extends HTMLElement {\n  connectedCallback() {\n    const params = useParams();  // { id: \'42\' }\n    const route = getActiveRoute();  // \'user/42\'\n  }\n}'
    });

    this.codeNavHelpers = encodeData({
      title: 'previousRoute / nextRoute',
      language: 'javascript',
      code: 'const prev = previousRoute(\'docs\');  // { route, params, title }\nconst next = nextRoute(\'docs\');\nif (prev) navigate(prev.route, prev.params);'
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="doc-section">
        <h2 class="section-title">Router</h2>
        <p class="section-desc">
          Switch Framework's router is <strong>runtime-first</strong> – no webpack, no build step. Just register your screens, and the router handles navigation, deep linking, browser history, and route parameters. It works great with stack and tab layouts.
        </p>

        <h3 class="subsection">Define routes</h3>
        <p class="section-desc">
          Register screens in your layout's <code>registerScreens</code> call. A screen is a custom element with a name, path, title, and layout type. Paths can include parameters like <code>:id</code>.
        </p>
        <sw-codeblock data="${this.codeRegisterScreens}"></sw-codeblock>

        <h3 class="subsection">Navigate</h3>
        <p class="section-desc">
          Use <code>navigate(route, params)</code> to go to a route. For dynamic routes, pass params as the second argument or embed them in the route string.
        </p>
        <sw-codeblock data="${this.codeNavigate}"></sw-codeblock>

        <h3 class="subsection">Route params & state</h3>
        <p class="section-desc">
          Access route parameters and search params inside your screen. Use hooks to get the current route and params.
        </p>
        <sw-codeblock data="${this.codeGetRoute}"></sw-codeblock>

        <h3 class="subsection">Navigation helpers</h3>
        <p class="section-desc">
          The router provides helper functions for common navigation patterns.
        </p>
        <sw-codeblock data="${this.codeNavHelpers}"></sw-codeblock>

        <h3 class="subsection">API</h3>
        <ul class="feature-list">
          <li><code>navigate(route, params)</code> – Navigate to a route, update browser history</li>
          <li><code>goBack()</code> – Go back in browser history</li>
          <li><code>redirect(route, params)</code> – Same as navigate (alias)</li>
          <li><code>replace(route, params)</code> – Replace current history entry instead of pushing</li>
          <li><code>useParams()</code> – Get current route parameters</li>
          <li><code>getActiveRoute()</code> – Get current route string</li>
          <li><code>useRouteChangesSubscriber(callback)</code> – Subscribe to route changes</li>
        </ul>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .doc-section {
          padding: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--main_text);
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .section-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--sub_text);
          margin: 0 0 20px;
        }

        .subsection {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 28px 0 12px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-list li {
          font-size: 14px;
          line-height: 1.6;
          color: var(--sub_text);
          padding-left: 20px;
          position: relative;
        }

        .feature-list li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--main_color);
          font-weight: 700;
        }

        code {
          background: var(--surface_2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
          font-size: 13px;
          color: var(--main_text);
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-router-screen')) {
  customElements.define('sw-docs-router-screen', SwDocsRouterScreen);
}
