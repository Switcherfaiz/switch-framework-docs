import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework/router';

export class SwTermsOfServiceScreen extends SwitchComponent {
  static screenName = 'terms-of-service';
  static path = '/terms-of-service';
  static title = 'Terms of Service';
  static tag = 'sw-terms-of-service-screen';
  static layout = 'stack';

  render() {
    return `
      <div class="terms-wrap">
        <header class="terms-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="terms-main">
          <div class="doc-section">
            <h2 class="section-title" id="overview">Terms of Service</h2>
            <p class="section-desc">
              By using Switch Framework documentation and related resources, you agree to these terms. Switch Framework is open source software provided under the MIT License.
            </p>
            <h3 class="subsection" id="use">Use of Documentation</h3>
            <p class="section-desc">
              The documentation is provided for informational purposes. You may use, copy, and adapt the examples and code snippets for your projects.
            </p>
            <h3 class="subsection" id="software">Software License</h3>
            <p class="section-desc">
              Switch Framework itself is licensed under the MIT License. See the <a href="#" data-route="license">License</a> page for full terms.
            </p>
            <h3 class="subsection" id="disclaimer">Disclaimer</h3>
            <p class="section-desc">
              The software and documentation are provided "as is" without warranty of any kind. Use at your own risk.
            </p>
          </div>
        </main>
      </div>
    `;
  }

  onMount() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) navigate(route);
    });
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; min-height: 100vh; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .terms-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .terms-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .terms-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        .section-desc a { color: var(--primary); text-decoration: none; cursor: pointer; }
        .section-desc a:hover { text-decoration: underline; }
      </style>
    `;
  }
}
