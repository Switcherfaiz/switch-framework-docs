import { SwitchComponent } from 'switch-framework';
import { SITE_PAGE_STYLES } from '/utils/doc-styles.js';

export class SwAboutScreen extends SwitchComponent {
  static screenName = 'about';
  static path = '/about';
  static title = 'About';
  static tag = 'sw-about-screen';

  render() {
    return `
      <div class="site-wrap">
        <header class="site-header"><sw-topbar></sw-topbar></header>
        <main class="site-main">
          <div class="site-section">
            <p class="site-kicker">Project</p>
            <h1 class="site-title">About Switch Framework</h1>
            <p class="site-desc">Switch Framework is a lightweight, runtime-first frontend framework that plays nicely with <code>switch-framework-backend</code>. It gives you routing, Web Components, and optional state management — without a bundler.</p>
            <h2 class="site-h2">What you get</h2>
            <p class="site-desc">Declarative stack and tab navigation, shadow DOM components, and event-driven state. Everything runs as native ES modules in the browser. Prototype fast, ship faster.</p>
            <h2 class="site-h2">Open source</h2>
            <p class="site-desc">Switch is MIT licensed. The source and this documentation live on GitHub at <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">Switcherfaiz/switch-framework</a>.</p>
          </div>
        </main>
        <sw-docs-footer></sw-docs-footer>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        ${SITE_PAGE_STYLES}
        code {
          font-family: var(--font-mono);
          font-size: 0.9em;
          background: var(--surface_2);
          padding: 1px 6px;
          border-radius: 6px;
          color: var(--code_text);
        }
      </style>
    `;
  }
}
