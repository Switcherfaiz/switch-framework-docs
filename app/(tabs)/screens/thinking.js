import { SwitchComponent } from '/switch-framework/index.js';

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

export class SwDocsThinkingScreen extends SwitchComponent {
  static screenName = 'docs/thinking';
  static path = '/docs/thinking';
  static title = 'Thinking in Switch Framework';
  static tag = 'sw-docs-thinking-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Thinking in Switch Framework</h2>
        <p class="section-desc">
          Switch Framework is built around a few core ideas: <strong>screens as routes</strong>, <strong>state as events</strong>, and <strong>components as Web Components</strong>. Understanding these will help you build apps that feel natural and stay maintainable.
        </p>
        <h3 class="subsection" id="screens-and-routes">Screens and routes</h3>
        <p class="section-desc">
          Every screen is a route. You define screens with <code>screenName</code> and <code>path</code>. The framework maps URLs to screens and renders them into the layout container. Stack screens push/pop; tab screens switch between views.
        </p>
        <h3 class="subsection" id="state-as-events">State as events</h3>
        <p class="section-desc">
          State is global and event-driven. <code>createState</code> registers a key; <code>updateState</code> changes it and notifies subscribers. Components use <code>useState</code> to react. No prop drilling – any component can read or update shared state.
        </p>
        <h3 class="subsection" id="components">Components</h3>
        <p class="section-desc">
          All UI extends <code>SwitchComponent</code> – a Web Component with shadow DOM, <code>render()</code>, and <code>styleSheet()</code>. Use <code>registerComponents</code> to auto-define custom elements. No JSX, no virtual DOM – just HTML strings and real DOM.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
