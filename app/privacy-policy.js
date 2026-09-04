import { SwitchComponent } from 'switch-framework';
import { SITE_PAGE_STYLES } from '/utils/doc-styles.js';

export class SwPrivacyPolicyScreen extends SwitchComponent {
  static screenName = 'privacy-policy';
  static path = '/privacy-policy';
  static title = 'Privacy Policy';
  static tag = 'sw-privacy-policy-screen';

  render() {
    return `
      <div class="site-wrap">
        <header class="site-header"><sw-topbar></sw-topbar></header>
        <main class="site-main">
          <div class="site-section">
            <p class="site-kicker">Legal</p>
            <h1 class="site-title">Privacy Policy</h1>
            <p class="site-desc">Switch Framework and this documentation site respect your privacy. This policy describes how we handle information when you use our documentation and related services.</p>
            <h2 class="site-h2">Data collection</h2>
            <p class="site-desc">We do not collect personal data through this documentation site. Any preferences (such as theme or search history) are stored locally in your browser.</p>
            <h2 class="site-h2">Cookies</h2>
            <p class="site-desc">This site may use minimal local storage for functionality such as theme persistence and search history. No tracking cookies are used.</p>
            <h2 class="site-h2">Contact</h2>
            <p class="site-desc">For questions about this privacy policy, please open an issue on our <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
          </div>
        </main>
        <sw-docs-footer></sw-docs-footer>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${SITE_PAGE_STYLES}</style>`;
  }
}
