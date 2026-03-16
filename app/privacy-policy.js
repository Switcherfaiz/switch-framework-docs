import { SwitchComponent } from 'switch-framework';

export class SwPrivacyPolicyScreen extends SwitchComponent {
  static screenName = 'privacy-policy';
  static path = '/privacy-policy';
  static title = 'Privacy Policy';
  static tag = 'sw-privacy-policy-screen';
  static layout = 'stack';

  render() {
    return `
      <div class="privacy-wrap">
        <header class="privacy-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="privacy-main">
          <div class="doc-section">
            <h2 class="section-title" id="overview">Privacy Policy</h2>
            <p class="section-desc">
              Switch Framework and this documentation site respect your privacy. This policy describes how we handle information when you use our documentation and related services.
            </p>
            <h3 class="subsection" id="data-collection">Data Collection</h3>
            <p class="section-desc">
              We do not collect personal data through this documentation site. Any preferences (such as theme or search history) are stored locally in your browser.
            </p>
            <h3 class="subsection" id="cookies">Cookies</h3>
            <p class="section-desc">
              This site may use minimal local storage for functionality such as theme persistence and search history. No tracking cookies are used.
            </p>
            <h3 class="subsection" id="contact">Contact</h3>
            <p class="section-desc">
              For questions about this privacy policy, please open an issue on our <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
            </p>
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
        .privacy-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .privacy-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .privacy-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        .section-desc a { color: var(--primary); text-decoration: none; }
        .section-desc a:hover { text-decoration: underline; }
      </style>
    `;
  }
}
