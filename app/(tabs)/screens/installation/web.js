import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsInstallScreen extends SwitchComponent {
  static screenName = 'docs/installation/web';
  static path = '/docs/installation/web';
  static title = 'Web Installation';
  static tag = 'sw-docs-install-screen';
  static layout = 'tabs';

  render() {
    const installCode = { title: 'bash', language: 'bash', code: `npm i switch-framework switch-framework-backend` };
    const createCode = { title: 'bash', language: 'bash', code: `npx create-switch-framework-app my-app` };
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Web Installation</h2>
        <p class="section-desc">
          Two ways to get started: install the packages yourself, or let the CLI do the heavy lifting. We recommend the CLI – it scaffolds everything so you can start coding in seconds.
        </p>
        <h3 class="subsection" id="manual-install">Option 1: Manual install</h3>
        <p class="section-desc">Add the core packages to your project:</p>
        <sw-codeblock data="${encodeData(installCode)}"></sw-codeblock>
        <h3 class="subsection" id="create-app">Option 2: Create a new app (recommended)</h3>
        <p class="section-desc">One command, full project structure. Web, Electron, or both – you choose:</p>
        <sw-codeblock data="${encodeData(createCode)}"></sw-codeblock>
        <p class="section-desc">
          <strong>Using the local framework?</strong> Run <code>npm link</code> in your <code>switch-framework</code> folder, then <code>npm link switch-framework</code> in your app. Your app will use your local copy instead of the npm version.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
