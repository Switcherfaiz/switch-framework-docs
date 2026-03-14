import { SwitchComponent, encodeData } from '/switch-framework/index.js';

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

export class SwDocsInstallationDesktopScreen extends SwitchComponent {
  static screenName = 'docs/installation/desktop';
  static path = '/docs/installation/desktop';
  static title = 'Desktop App Installation';
  static tag = 'sw-docs-installation-desktop-screen';
  static layout = 'tabs';

  render() {
    const createCode = {
      title: 'Create Electron app',
      language: 'bash',
      code: `npx create-switch-framework-app my-desktop-app --template electron`
    };

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Desktop App Installation</h2>
        <p class="section-desc">
          Use the CLI to scaffold a Switch Framework app with Electron for desktop distribution. Your app runs in a native window with access to Node.js APIs when needed.
        </p>
        <h3 class="subsection" id="create">Create a desktop app</h3>
        <sw-codeblock data="${encodeData(createCode)}"></sw-codeblock>
        <p class="section-desc">
          The Electron template includes the same app structure as the web template, plus Electron main process files. Build for Windows, macOS, or Linux.
        </p>
        <h3 class="subsection" id="build">Build for production</h3>
        <p class="section-desc">
          Run <code>npm run build</code> (or the script defined in your Electron template) to package the app. Output goes to <code>dist/</code> or the configured output directory.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
