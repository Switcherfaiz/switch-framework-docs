import { SwitchComponent } from '/switch-framework/index.js';

export class SwAboutScreen extends SwitchComponent {
  static screenName = 'about';
  static path = '/about';
  static title = 'About';
  static tag = 'sw-about-screen';
  static layout = 'stack';

  render() {
    return `
      <div class="about-wrap">
        <header class="about-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="about-main">
          <div class="doc-section">
            <h2 class="section-title">About Switch Framework</h2>
            <p class="section-desc">Switch Framework is a lightweight, runtime-first frontend framework. No build step required. Open source and MIT licensed.</p>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; min-height: 100vh; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .about-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .about-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .about-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); }
      </style>
    `;
  }
}
