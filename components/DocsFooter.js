import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { navigateDoc, isDocRoute } from '/utils/doc-nav.js';

export class DocsFooter extends SwitchComponent {
  static tag = 'sw-docs-footer';

  onMount() {
    this.listener('a[data-route]', 'click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (!route) return;
      if (isDocRoute(route)) navigateDoc(route);
      else navigate(route);
    });
  }

  render() {
    return `
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-grid">
            <div class="brand">
              <div class="logo">
                <img class="logo-img" src="/assets/files/Switch_framework_logo_purple.svg" alt="" width="22" height="22" />
                <span>Switch Framework</span>
              </div>
              <p>A lightweight, runtime-first frontend framework. Native ES modules, familiar routing, and state management — no build step required.</p>
            </div>
            <div class="col">
              <h4>Docs</h4>
              <a href="#" data-route="docs/introduction">Introduction</a>
              <a href="#" data-route="docs/installation/web">Installation</a>
              <a href="#" data-route="docs/router">Routing</a>
              <a href="#" data-route="docs/state">State</a>
              <a href="#" data-route="docs/components">Components</a>
            </div>
            <div class="col">
              <h4>Project</h4>
              <a href="#" data-route="changelogs">Changelog</a>
              <a href="#" data-route="authors">Authors</a>
              <a href="#" data-route="about">About</a>
              <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div class="col">
              <h4>Legal</h4>
              <a href="#" data-route="privacy-policy">Privacy</a>
              <a href="#" data-route="terms-of-service">Terms</a>
              <a href="#" data-route="license">License</a>
            </div>
          </div>
          <div class="bottom">
            <span>© 2026 Switch Framework. MIT licensed.</span>
            <span class="status"><span class="dot"></span>Docs online</span>
          </div>
        </div>
      </footer>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: var(--font); }
        * { box-sizing: border-box; }
        .footer {
          border-top: 1px solid var(--border_color);
          background: var(--page_background);
          padding: 56px 0 32px;
        }
        .footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--main_text);
          margin-bottom: 12px;
        }
        .logo-img { width: 22px; height: 22px; }
        .brand p {
          margin: 0;
          max-width: 320px;
          font-size: 14px;
          line-height: 1.65;
          color: var(--sub_text);
        }
        .col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .col h4 {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted_text);
        }
        .col a {
          color: var(--sub_text);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .col a:hover { color: var(--primary); }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border_color);
          font-size: 13px;
          color: var(--muted_text);
        }
        .status { display: inline-flex; align-items: center; gap: 8px; }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
        }
        @media (max-width: 800px) {
          .footer-inner { padding: 0 20px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .brand { grid-column: 1 / -1; }
          .bottom { flex-direction: column; align-items: flex-start; }
        }
      </style>
    `;
  }
}
