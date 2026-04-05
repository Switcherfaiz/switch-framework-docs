import { SwitchComponent, encodeData } from 'switch-framework';
import { layoutsStackCode, layoutsGlobalStatesCode, layoutsTabCode, layoutsStackAdvancedCode, layoutsStackPopupsCode } from '/codes/index.js';

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
  .method-list { list-style: none; padding: 0; margin: 16px 0; }
  .method-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 12px; }
  .method-list li::before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
  .info-box { background: var(--surface_2); border-left: 3px solid var(--primary); padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  .info-box p { margin: 0; font-size: 14px; line-height: 1.6; }
`;

export class SwDocsLayoutsScreen extends SwitchComponent {
  static screenName = 'docs/layouts';
  static path = '/docs/layouts';
  static title = 'Layouts';
  static tag = 'sw-docs-layouts-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Layouts</h2>
        <p class="section-desc">
          Switch Framework uses two layout types: <strong>StackLayout</strong> for push/pop navigation (like modals or full-screen flows) and <strong>TabLayout</strong> for tabbed views (like docs with a sidebar).
        </p>

        <h3 class="subsection" id="stack">StackLayout</h3>
        <p class="section-desc">
          Stack screens are rendered one at a time. Navigating to a new route pushes it onto the stack; <code>goBack()</code> pops. Use for: home, auth, modals, full-page flows.
        </p>
        <sw-codeblock data="${encodeData(layoutsStackCode)}"></sw-codeblock>

        <h3 class="subsection" id="stack-advanced">StackLayout – Advanced Usage</h3>
        <p class="section-desc">
          StackLayout supports custom <code>render()</code> and <code>styleSheet()</code> methods for building complex app shells. Use this when you need global UI elements (headers, nav bars) that persist across screen changes, or global popups (search modals, toasts) that should stay visible even when switching to tabs layout.
        </p>

        <div class="info-box">
          <p><strong>Key Concept:</strong> The StackLayout's <code>render()</code> creates the container structure. Your screens are injected into the element with <code>id="content"</code>. Any content inside a container with <code>data-popups</code> attribute is automatically extracted to the app shell level and stays visible across layout switches.</p>
        </div>

        <sw-codeblock data="${encodeData(layoutsStackAdvancedCode)}"></sw-codeblock>

        <h3 class="subsection" id="stack-popups">Global Popups in StackLayout</h3>
        <p class="section-desc">
          Any content inside a container with <code>data-popups</code> attribute is automatically extracted to the app shell level. These popups (search modals, bottom sheets, toast notifications) remain visible even when you navigate to tabs layout. No additional configuration needed – just place your popup components inside the <code>data-popups</code> container.
        </p>

        <ul class="feature-list">
          <li>Add <code>data-popups</code> attribute to your popups container in <code>render()</code></li>
          <li>Place any popup components inside – all contents are automatically extracted</li>
          <li>Popups are moved to app shell on first stack render and persist across layouts</li>
          <li>Use <code>pointer-events: none</code> on container, <code>pointer-events: auto</code> on children</li>
        </ul>

        <sw-codeblock data="${encodeData(layoutsStackPopupsCode)}"></sw-codeblock>

        <h3 class="subsection" id="stack-api">StackLayout API Reference</h3>
        <ul class="method-list">
          <li><code>static tag</code> - Custom element tag name (required for custom render)</li>
          <li><code>static stackScreens</code> - Array of screen classes for stack navigation</li>
          <li><code>static tabsLayout</code> - TabLayout class to switch to for tab routes</li>
          <li><code>static splash</code> - Tag name of splash screen component</li>
          <li><code>static initialRoute</code> - Starting route when app launches</li>
          <li><code>render()</code> - Returns HTML structure with <code>#content</code> container</li>
          <li><code>styleSheet()</code> - Returns CSS styles for the layout</li>
          <li><code>static async init()</code> - App initialization, create states, show splash</li>
          <li><code>getAppLayout()</code> - Returns layout config for framework registration</li>
        </ul>

        <h3 class="subsection" id="globalstates">globalStates – static app data</h3>
        <p class="section-desc">
          <code>globalStates</code> holds static data that stays constant across the app – things like <code>navigate</code>, <code>go_back</code>, <code>tabsLayout</code>, <code>activeRoute</code>, <code>routeParams</code>, <code>searchParams</code>. Use <code>getState(key)</code> to read and <code>setState(obj)</code> to merge updates. This is separate from <code>createState</code>/<code>updateState</code> (SwitchStateManager) which you use for reactive app state.
        </p>
        <sw-codeblock data="${encodeData(layoutsGlobalStatesCode)}"></sw-codeblock>

        <h3 class="subsection" id="tabs">TabLayout</h3>
        <p class="section-desc">
          Tab screens share a container. The active tab is determined by the current route. Use for: docs, dashboards, multi-section apps.
        </p>
        <sw-codeblock data="${encodeData(layoutsTabCode)}"></sw-codeblock>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
