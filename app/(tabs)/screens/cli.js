import { SwitchComponent, encodeData } from '/switch-framework/index.js';

export class SwDocsCliScreen extends SwitchComponent {
  static screenName = 'docs/cli';
  static path = '/docs/cli';
  static title = 'CLI';
  static tag = 'sw-docs-cli-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">CLI: create-switch-framework-app</h2>
        <p class="section-desc">
          Use <code>create-switch-framework-app</code> to scaffold a new Switch Framework project. Run with <code>npx</code>:
        </p>
        <sw-codeblock data="${encodeData({ title: 'Basic usage', language: 'bash', code: `npx create-switch-framework-app <project-name> [options]` })}"></sw-codeblock>
        <h3 class="subsection">Options</h3>
        <sw-docs-params-table data="${encodeData({
          headers: ['Option', 'Description'],
          htmlColumns: [0, 1],
          rows: [
            ['<code>--yes</code>, <code>-y</code>', 'Skip prompts and use defaults'],
            ['<code>--app-type &lt;type&gt;</code>', 'One of: <code>web</code> | <code>electron</code> | <code>both</code>. Web creates a browser + Node.js/Express app. Electron adds a desktop target. Both creates a monorepo.'],
            ['<code>--port &lt;port&gt;</code>', 'Server port (1–65535). Default: 3000'],
            ['<code>--no-install</code>', 'Do not run <code>npm install</code> after creating the project'],
            ['<code>--use-local</code>', 'Use <code>npm link</code> for switch-framework and switch-framework-backend instead of npm registry (for local development)'],
            ['<code>-h</code>, <code>--help</code>', 'Show help']
          ]
        })}"></sw-docs-params-table>
        <h3 class="subsection" id="examples">Examples</h3>
        <sw-codeblock data="${encodeData({ title: 'Interactive (prompts)', language: 'bash', code: `npx create-switch-framework-app my-app` })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({ title: 'Non-interactive with options', language: 'bash', code: `npx create-switch-framework-app my-app --yes --app-type web --port 4000` })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({ title: 'Electron app', language: 'bash', code: `npx create-switch-framework-app my-desktop-app --app-type electron --port 3000` })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({ title: 'Use local packages (dev)', language: 'bash', code: `# First run npm link in switch-framework and switch-framework-backend\nnpx create-switch-framework-app my-app --use-local` })}"></sw-codeblock>
        <h3 class="subsection" id="next-steps">Next steps</h3>
        <p class="section-desc">After creation, run <code>cd &lt;project-name&gt;</code>, then <code>npm run dev</code> (web) or <code>npm run electron:dev</code> (Electron).</p>
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
