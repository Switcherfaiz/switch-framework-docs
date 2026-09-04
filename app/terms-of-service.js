import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { SITE_PAGE_STYLES } from '/utils/doc-styles.js';

export class SwTermsOfServiceScreen extends SwitchComponent {
  static screenName = 'terms-of-service';
  static path = '/terms-of-service';
  static title = 'Terms of Service';
  static tag = 'sw-terms-of-service-screen';

  onMount() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) navigate(route);
    });
  }

  render() {
    return `
      <div class="site-wrap">
        <header class="site-header"><sw-topbar></sw-topbar></header>
        <main class="site-main">
          <div class="site-section">
            <p class="site-kicker">Legal</p>
            <h1 class="site-title">Terms of Service</h1>
            <p class="site-desc">By using Switch Framework documentation and related resources, you agree to these terms. Switch Framework is open source software provided under the MIT License.</p>
            <h2 class="site-h2">Use of documentation</h2>
            <p class="site-desc">The documentation is provided for informational purposes. You may use, copy, and adapt the examples and code snippets for your projects.</p>
            <h2 class="site-h2">Software license</h2>
            <p class="site-desc">Switch Framework itself is licensed under the MIT License. See the <a href="#" data-route="license">License</a> page for full terms.</p>
            <h2 class="site-h2">Disclaimer</h2>
            <p class="site-desc">The software and documentation are provided "as is" without warranty of any kind. Use at your own risk.</p>
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
