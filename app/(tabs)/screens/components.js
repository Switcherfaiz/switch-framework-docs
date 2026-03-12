import { SwitchComponent, encodeData } from '/switch-framework/index.js';

export class SwDocsComponentsScreen extends SwitchComponent {
  static screenName = 'docs/components';
  static path = '/docs/components';
  static title = 'Components';
  static tag = 'sw-docs-components-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">SwitchComponent</h2>
        <p class="section-desc">
          All screens and UI components extend <strong>SwitchComponent</strong>. It provides shadow DOM, a render lifecycle, and <code>useEffect</code> for reactive updates. No <code>customElements.define</code> needed – use <code>registerComponents([...])</code> in your layout and the framework auto-registers classes with a static <code>tag</code>.
        </p>
        <h3 class="subsection" id="writing-components">Writing a component</h3>
        <p class="section-desc">Override <code>render()</code> and optionally <code>styleSheet()</code>. Use <code>connected()</code> and <code>disconnected()</code> for lifecycle logic (equivalent to connectedCallback/disconnectedCallback).</p>
        <sw-codeblock data="${encodeData({
          title: 'Basic component',
          language: 'javascript',
          code: `import { SwitchComponent } from '/switch-framework/index.js';

export class MyButton extends SwitchComponent {
  static tag = 'sw-my-button';

  render() {
    return \`<button class="btn">Click me</button>\`;
  }

  styleSheet() {
    return \`
      <style>
        .btn { padding: 8px 16px; border-radius: 8px; }
      </style>
    \`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="reactivity">Reactivity with createState and useState</h3>
        <p class="section-desc">
          Use <code>createState(initialValue, identifier)</code> to create shared state (typically in layout <code>init</code>). Use <code>useState(identifier, callback)</code> in components to subscribe and react. When state changes, your callback runs – update the DOM or call <code>this._renderToShadow()</code> to re-render.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Reactive component with useState',
          language: 'javascript',
          code: `import { SwitchComponent, useState, updateState } from '/switch-framework/index.js';

export class CounterDisplay extends SwitchComponent {
  static tag = 'sw-counter-display';

  connected() {
    const [count, unsub] = useState('my-counter', (newCount) => {
      const el = this.shadowRoot?.querySelector('#count');
      if (el) el.textContent = newCount;
    });
    this._unsub = unsub;
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  render() {
    return \`<span id="count">0</span>\`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-effect">useEffect for globalStates</h3>
        <p class="section-desc">
          <code>useEffect(callback, deps)</code> subscribes to <code>globalStates</code> keys (e.g. <code>activeRoute</code>, <code>routeParams</code>). When any watched key changes, the callback runs. Use it to re-render when the route changes.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'useEffect example',
          language: 'javascript',
          code: `connected() {
  this.useEffect(() => this._renderToShadow(), ['activeRoute', 'routeParams']);
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="not-found-screen">Not Found Screen</h3>
        <p class="section-desc">
          Create a <code>+not-found.js</code> screen to handle routes that don't exist. Extend <code>SwitchComponent</code> and set <code>path: '/+not-found'</code>. The framework auto-detects it by path, so you can name the class anything. Use <code>getActiveRoute()</code> to display which route the user attempted to navigate to.
        </p>
        <sw-codeblock data="${encodeData({
          title: '+not-found.js',
          language: 'javascript',
          code: `import { SwitchComponent, navigate, goBack, getActiveRoute } from '/switch-framework/index.js';

export default class extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-not-found-screen';
  static layout = 'stack';

  connected() {
    this._bindEvents();
  }

  _bindEvents() {
    this.shadowRoot.getElementById('home')?.addEventListener('click', () => {
      navigate('index');
    });
    this.shadowRoot.getElementById('back')?.addEventListener('click', () => {
      goBack();
    });
  }

  render() {
    const attemptedRoute = getActiveRoute() || '';
    const safePath = this._escapeHtml(attemptedRoute);
    return \`
      <div class="container">
        <h1>404 - Not Found</h1>
        <p>No screen is registered for: <strong>\${safePath}</strong></p>
        <button id="home">Go Home</button>
        <button id="back">Go Back</button>
      </div>
    \`;
  }

  _escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  styleSheet() {
    return \`
      <style>
        :host { display: block; width: 100%; min-height: 100vh; }
        .container { padding: 40px 20px; text-align: center; }
        h1 { font-size: 48px; margin: 0 0 20px; color: var(--main_text); }
        p { font-size: 16px; color: var(--sub_text); margin: 0 0 30px; }
        button { margin: 10px; padding: 10px 20px; border-radius: 8px; cursor: pointer; background: var(--primary); color: white; border: none; font-weight: 600; }
      </style>
    \`;
  }
}`
        })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({
          title: '_layout.js – add to stackScreens',
          language: 'javascript',
          code: `import NotFoundScreen from './+not-found.js';

export class SwStackLayout extends StackLayout {
  static stackScreens = [SwIndexScreen, NotFoundScreen];
  // ...
}`
        })}"></sw-codeblock>
        <p class="section-desc"><strong>Key points:</strong></p>
        <ul class="feature-list">
          <li>Use <code>export default class</code> – the framework detects not-found by <code>path: '/+not-found'</code></li>
          <li>You can name the class anything; the layout imports it with any variable name</li>
          <li>Import <code>navigate</code>, <code>goBack</code>, and <code>getActiveRoute</code> from the framework</li>
          <li>Use <code>getActiveRoute()</code> to show the attempted route – no attributes needed</li>
          <li>Add the screen to <code>stackScreens</code> in your layout</li>
          <li>The router updates history with the attempted route, then renders the not-found screen</li>
        </ul>
        <h3 class="subsection" id="statics">Static properties</h3>
        <ul class="feature-list">
          <li><code>screenName</code> – Route identifier (e.g. <code>'docs/introduction'</code>)</li>
          <li><code>path</code> – URL path (e.g. <code>'/docs/introduction'</code>)</li>
          <li><code>title</code> – Display title</li>
          <li><code>layout</code> – <code>'stack'</code> or <code>'tabs'</code></li>
          <li><code>tag</code> – Custom element tag (e.g. <code>'sw-docs-intro-screen'</code>)</li>
        </ul>
        <h3 class="subsection" id="methods">Methods</h3>
        <ul class="feature-list">
          <li><code>render()</code> – Return HTML string. Override in subclasses.</li>
          <li><code>styleSheet()</code> – Return CSS string. Override for component styles.</li>
          <li><code>connected()</code> – Called when element is connected. Override for setup.</li>
          <li><code>disconnected()</code> – Called when element is disconnected. Override for cleanup.</li>
          <li><code>useEffect(callback, deps)</code> – Subscribe to globalStates keys. Callback runs when deps change.</li>
          <li><code>_renderToShadow()</code> – Re-render. Call when state changes to refresh the DOM.</li>
          <li><code>static getScreenConfig()</code> – Returns <code>{ name, path, title, tag, layout }</code> for screens.</li>
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
