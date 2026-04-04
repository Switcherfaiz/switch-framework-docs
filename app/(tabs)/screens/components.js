import { SwitchComponent, encodeData } from 'switch-framework';

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
        <p class="section-desc">Override <code>render()</code> and optionally <code>styleSheet()</code>. Use <code>onMount()</code> for lifecycle logic with <code>this.listener()</code> for events, and <code>static { this.useState('key'); }</code> for reactive updates.</p>
        <sw-codeblock data="${encodeData({
          title: 'Basic component',
          language: 'javascript',
          code: `import { SwitchComponent } from 'switch-framework';

export class MyButton extends SwitchComponent {
  static tag = 'sw-my-button';

  onMount() {
    // Delegated event listener - safe to call on every render
    this.listener('.btn', 'click', () => console.log('Clicked!'));
  }

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
          Use <code>createState(identifier, initialValue)</code> to create shared state. Use <code>static { this.useState('key'); }</code> in your component to subscribe to state changes for automatic re-rendering. No manual unsubscribe needed.
        </p>

        <sw-codeblock data="${encodeData({
          title: 'Reactive component with useState',
          language: 'javascript',
          code: `import { SwitchComponent, createState, getState, updateState } from 'switch-framework';

// Create state outside component or in static block
createState('my-counter', 0);

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  
  // Subscribe to state for auto re-render
  static { this.useState('my-counter'); }

  onMount() {
    // Add click listener to increment
    this.listener('#inc', 'click', () => {
      updateState('my-counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('my-counter') ?? 0;
    return \`<button id="inc">Count: \${count}</button>\`;
  }
}`
        })}"></sw-codeblock>

        <h3 class="subsection" id="use-effect">useEffect for reactive updates</h3>
        <p class="section-desc">
          <code>useEffect(callback, deps)</code> subscribes to state keys (e.g. <code>['activeRoute', 'routeParams']</code>). When any watched key changes, the callback runs. Use it in <code>onMount()</code> and store the unsubscriber via <code>this.addOnDestroy()</code>.
        </p>

        <sw-codeblock data="${encodeData({
          title: 'useEffect example',
          language: 'javascript',
          code: `import { SwitchComponent, useEffect } from 'switch-framework';

export class MyScreen extends SwitchComponent {
  static tag = 'sw-my-screen';

  onMount() {
    // Subscribe to route changes
    const unsub = this.useEffect(() => {
      this.rerender();
    }, ['activeRoute', 'routeParams']);
    
    // Auto-cleanup on destroy
    this.addOnDestroy(unsub);
  }

  render() {
    return \`<div>Content</div>\`;
  }
}`
        })}"></sw-codeblock>

        <h3 class="subsection" id="not-found-screen">Not Found Screen</h3>
        <p class="section-desc">
          If the framework finds a <code>+not-found.js</code> file, it expects a component with <code>path: '/+not-found'</code>. That screen is used instead of the framework's default not-found. The router auto-detects it by path – add it to <code>stackScreens</code> in your layout.
        </p>

        <sw-codeblock class="not_found" data="${encodeData({
          title: '+not-found.js',
          language: 'javascript',
          code: `import { SwitchComponent, navigate, goBack } from 'switch-framework';
import { getActivePath } from 'switch-framework/router';

export default class extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-not-found-screen';
  static layout = 'stack';

  onMount() {
    this._bindEvents();
  }

  _bindEvents() {
    this.listener('#home', 'click', () => navigate('index'));
    this.listener('#back', 'click', () => goBack());
  }

  render() {
    const path = getActivePath();
    const safePath = this._escapeHtml(path);
    return \`
      <div class="wrap">
        <div class="card">
          <div class="code">404</div>
          <div class="h">This screen does not exist</div>
          <div class="p">No screen is registered for:</div>
          <div class="path">\${safePath}</div>
          <div class="row">
            <button class="btn" id="home">Go to Home</button>
            <button class="btn secondary" id="back">Go Back</button>
          </div>
        </div>
      </div>
    \`;
  }

  styleSheet() {
    return \`
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100dvh;
          font-family: var(--font);
        }
        * { box-sizing: border-box; font-family: inherit; }
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .card {
          width: min(680px, 100%);
          background: transparent;
          border: none;
          border-radius: 18px;
          padding: 18px;
          box-shadow: none;
        }
        .code { font-weight: 1000; font-size: 44px; line-height: 1; color: var(--main_text); }
        .h { margin-top: 10px; font-weight: 1000; font-size: 20px; color: var(--main_text); }
        .p { margin-top: 6px; color: var(--sub_text); font-weight: 800; }
        .path {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--surface_2);
          border: 1px solid var(--border_light);
          font-weight: 900;
          color: var(--main_text);
          word-break: break-word;
        }
        .row { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
        .btn {
          border: none;
          background: linear-gradient(135deg, #0091ff 0%, #0073e6 100%);
          color: #fff;
          font-weight: 1000;
          border-radius: 999px;
          padding: 10px 14px;
          cursor: pointer;
        }
        .btn:hover { opacity: 0.9; }
        .btn.secondary { background: var(--surface_2); color: var(--main_text); }
        .btn.secondary:hover { background: var(--surface_3); }
      </style>
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
          <li>Import <code>navigate</code> and <code>goBack</code> from the framework</li>
          <li>Use <code>getActivePath()</code> from <code>switch-framework/router</code> to show the attempted route</li>
          <li>Use <code>this.listener()</code> for delegated event handling – safe to call in onMount on every render</li>
          <li>Add the screen to <code>stackScreens</code> in your layout</li>
          <li>The router updates history with the attempted route, then renders the not-found screen</li>
        </ul>
        <h3 class="subsection" id="statics">Static properties</h3>
        <ul class="feature-list">
          <li><code>static tag</code> – Custom element tag (e.g. <code>'sw-my-component'</code>)</li>
          <li><code>static screenName</code> – Route identifier for screens (e.g. <code>'home'</code>)</li>
          <li><code>static path</code> – URL path for screens (e.g. <code>'/home'</code>)</li>
          <li><code>static title</code> – Display title for screens</li>
          <li><code>static layout</code> – <code>'stack'</code> or <code>'tabs'</code></li>
          <li><code>static { this.useState('key'); }</code> – Subscribe to state for auto re-render</li>
        </ul>
        <h3 class="subsection" id="methods">Methods</h3>
        <ul class="feature-list">
          <li><code>render()</code> – Return HTML string. Called automatically when subscribed state changes.</li>
          <li><code>styleSheet()</code> – Return CSS string for component styles.</li>
          <li><code>onMount()</code> – Called when element is connected. Use for setup and listeners.</li>
          <li><code>onDestroy()</code> – Called when element is disconnected. Use for cleanup.</li>
          <li><code>this.listener(selector, event, handler)</code> – Delegated event listener. Safe to call in onMount.</li>
          <li><code>this.useEffect(callback, deps)</code> – Subscribe to state keys. Returns unsubscriber.</li>
          <li><code>this.addOnDestroy(fn)</code> – Register cleanup function called on destroy.</li>
          <li><code>this.rerender()</code> – Manually trigger re-render.</li>
          <li><code>this.select(selector)</code> – Query element in shadow DOM.</li>
          <li><code>this.selectAll(selector)</code> – Query all elements in shadow DOM.</li>
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
        .not_found{margin-bottom:20px;}
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
