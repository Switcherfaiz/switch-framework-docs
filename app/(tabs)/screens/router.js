import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsRouterScreen extends SwitchComponent {
  static screenName = 'docs/router';
  static path = '/docs/router';
  static title = 'Router';
  static tag = 'sw-docs-router-screen';
  static layout = 'tabs';

  render() {
    const codeRegisterScreens = encodeData({
      title: 'Register screens (app/_layout.js)',
      language: 'javascript',
      code: 'import { StackLayout } from \'switch-framework\';\n\nconst stackScreens = [SwIndexScreen, SwUserNotFoundScreen];\nconst layout = SwStackLayout.getAppLayout();'
    });
    const codeNavigate = encodeData({
      title: 'Navigate to routes',
      language: 'javascript',
      code: 'import { navigate } from \'switch-framework/router\';\n\nnavigate(\'docs/introduction\');\nnavigate(\'user/42\');\nnavigate(\'docs\', { id: \'introduction\' });'
    });
    const codeGetRoute = encodeData({
      title: 'Path params (:id) and query params (?name=)',
      language: 'javascript',
      code: `import { useParams, useSearchParams, getActiveRoute } from 'switch-framework/router';

// Path params from /user/:id  ->  useParams() returns { id: '42' }
// Query params from ?name=Jane&age=30  ->  useSearchParams() returns { name: 'Jane', age: '30' }

connected() {
  const params = useParams();      // { id: '42' }
  const search = useSearchParams(); // { name: 'Jane', age: '30' }
  const route = getActiveRoute();   // 'user/42'
}`
    });

    const codeDefineScreen = encodeData({
      title: 'Define screen with dynamic path',
      language: 'javascript',
      code: `// Screen for /user/:id
export class UserScreen extends SwitchComponent {
  static screenName = 'user/[id]';
  static path = '/user/:id';
  static title = 'User';
  static tag = 'sw-user-screen';
  static layout = 'tabs';
  // useParams() will return { id: '42' } when visiting /user/42
}`
    });
    const codeNavHelpers = encodeData({
      title: 'previousRoute / nextRoute',
      language: 'javascript',
      code: 'const prev = previousRoute(\'docs\');  // { route, params, title }\nconst next = nextRoute(\'docs\');\nif (prev) navigate(prev.route, prev.params);'
    });
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Router</h2>
        <p class="section-desc">
          Switch Framework's router is <strong>runtime-first</strong> – no webpack, no build step. Just register your screens, and the router handles navigation, deep linking, browser history, and route parameters. It works great with stack and tab layouts.
        </p>
        <h3 class="subsection" id="define-routes">Define routes</h3>
        <p class="section-desc">
          Register screens in your layout's static config. A screen extends SwitchComponent with static <code>screenName</code>, <code>path</code>, <code>title</code>, <code>tag</code>. Paths can include parameters like <code>:id</code>.
        </p>
        <sw-codeblock data="${codeRegisterScreens}"></sw-codeblock>
        <h3 class="subsection" id="navigate">Navigate</h3>
        <p class="section-desc">
          Use <code>navigate(route, params)</code> to go to a route. For dynamic routes, pass params as the second argument or embed them in the route string.
        </p>
        <sw-codeblock data="${codeNavigate}"></sw-codeblock>
        <h3 class="subsection" id="route-params">Route params & state</h3>
        <p class="section-desc">
          Access route parameters and search params inside your screen. Use hooks to get the current route and params.
        </p>
        <sw-codeblock data="${codeGetRoute}"></sw-codeblock>
        <h3 class="subsection" id="define-screens">Define screens with params</h3>
        <p class="section-desc">
          Use <code>:param</code> in your path for dynamic segments. Query params (<code>?name=value</code>) are automatically parsed into <code>searchParams</code> in globalStates; use <code>useSearchParams()</code> to read them.
        </p>
        <sw-codeblock data="${codeDefineScreen}"></sw-codeblock>
        <h3 class="subsection" id="nav-helpers">Navigation helpers</h3>
        <p class="section-desc">
          The router provides helper functions for common navigation patterns.
        </p>
        <sw-codeblock data="${codeNavHelpers}"></sw-codeblock>
        <h3 class="subsection">API</h3>
        <ul class="feature-list">
          <li><code>navigate(route, params)</code> – Navigate to a route, update browser history</li>
          <li><code>goBack()</code> – Go back in browser history</li>
          <li><code>redirect(route, params)</code> – Same as navigate (alias)</li>
          <li><code>replace(route, params)</code> – Replace current history entry instead of pushing</li>
          <li><code>useParams()</code> – Get path params (e.g. <code>{ id: '42' }</code>)</li>
          <li><code>useSearchParams()</code> – Get query params (e.g. <code>{ name: 'Jane' }</code> from <code>?name=Jane</code>)</li>
          <li><code>getActiveRoute()</code> – Get current route string</li>
          <li><code>useRouteChangesSubscriber(callback)</code> – Subscribe to route changes</li>
        </ul>
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
        .feature-list { list-style: none; padding: 0; margin: 16px 0; display: flex; flex-direction: column; gap: 10px; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; }
        .feature-list li:before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
