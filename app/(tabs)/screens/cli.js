import { SwitchComponent, encodeData } from '/switch-framework/index.js';

export class SwDocsCliScreen extends SwitchComponent {
  static screenName = 'docs/cli';
  static path = '/docs/cli';
  static title = 'CLI';
  static tag = 'sw-docs-cli-screen';
  static layout = 'tabs';

  render() {
    const allCommands = `npx create-switch-framework-app my-app
npx create-switch-framework-app my-app --yes --app-type web --port 4000
npx create-switch-framework-app my-desktop-app --app-type electron --port 3000
npx create-switch-framework-app my-app --use-local`;
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">CLI</h2>
        <sw-codeblock data="${encodeData({ title: 'Commands', language: 'bash', code: allCommands })}"></sw-codeblock>
        <h3 class="subsection">Options</h3>
        <sw-docs-params-table data="${encodeData({
          headers: ['Option', 'Description'],
          htmlColumns: [0, 1],
          rows: [
            ['<code>--yes</code>, <code>-y</code>', 'Skip prompts and use defaults'],
            ['<code>--app-type &lt;type&gt;</code>', '<code>web</code> | <code>electron</code> | <code>both</code>'],
            ['<code>--port &lt;port&gt;</code>', 'Server port. Default: 3000'],
            ['<code>--no-install</code>', 'Do not run npm install after creation'],
            ['<code>--use-local</code>', 'Use npm link for local switch-framework packages'],
            ['<code>-h</code>, <code>--help</code>', 'Show help']
          ]
        })}"></sw-docs-params-table>
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
        .doc-section sw-codeblock { display: block; margin-bottom: 24px; }
        .doc-section sw-codeblock:last-of-type { margin-bottom: 0; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
