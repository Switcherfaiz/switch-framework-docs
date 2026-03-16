import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsThemingScreen extends SwitchComponent {
  static screenName = 'docs/theming';
  static path = '/docs/theming';
  static title = 'Theming';
  static tag = 'sw-docs-theming-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Theming</h2>
        <p class="section-desc">
          Switch Framework provides theme helpers for dark and light mode. Import from <code>switch-framework/themes</code>:
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Import theme helpers',
          language: 'javascript',
          code: `import {
  getSystemTheme,
  getTheme,
  changeTheme,
  initTheme,
  useThemesChangesSubscriber
} from 'switch-framework/themes';`
        })}"></sw-codeblock>
        <h3 class="subsection" id="setup">Setup</h3>
        <p class="section-desc">
          In your <code>assets/styles</code> folder, add a <code>styles.css</code> with <code>:root</code> and <code>body[data-theme="dark"]</code> for CSS variables. The theme helpers set <code>data-theme</code> on <code>document.body</code>.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'styles.css (example)',
          language: 'css',
          code: `:root, body {
  --page_background: #ffffff;
  --main_text: #0f172a;
}

body[data-theme="dark"] {
  --page_background: #0f172a;
  --main_text: #f8fafc;
}`
        })}"></sw-codeblock>
        <h3 class="subsection">Initialize on app start</h3>
        <p class="section-desc">
          Call <code>initTheme()</code> before <code>startApp</code> so the app loads with the correct theme. It checks <code>localStorage</code> first; if no stored theme, it uses the system preference.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'index.js',
          language: 'javascript',
          code: `import { startApp } from 'switch-framework';
import { initTheme } from 'switch-framework/themes';

initTheme();
startApp(layout);`
        })}"></sw-codeblock>
        <h3 class="subsection" id="change-theme">changeTheme – what to pass</h3>
        <p class="section-desc">
          Pass <code>'dark'</code> or <code>'light'</code> to <code>changeTheme</code>. It sets <code>data-theme</code> on <code>document.body</code>, saves to localStorage, and dispatches a <code>theme:change</code> event.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Toggle theme',
          language: 'javascript',
          code: `import { getTheme, changeTheme } from 'switch-framework/themes';

// Pass 'dark' or 'light'
changeTheme(getTheme() === 'dark' ? 'light' : 'dark');`
        })}"></sw-codeblock>
        <h3 class="subsection" id="api">All theming functions</h3>
        <ul class="feature-list">
          <li><code>getSystemTheme()</code> – returns <code>'dark'</code> or <code>'light'</code> from <code>prefers-color-scheme</code></li>
          <li><code>getTheme()</code> – returns current theme (localStorage first, else system)</li>
          <li><code>changeTheme('dark' | 'light')</code> – sets theme, updates <code>body[data-theme]</code>, saves to localStorage, dispatches <code>theme:change</code></li>
          <li><code>initTheme()</code> – call before startApp; applies stored or system theme</li>
          <li><code>useThemesChangesSubscriber(callback)</code> – subscribe to theme changes; callback receives current theme; returns unsubscribe</li>
        </ul>
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
        .feature-list { list-style: none; padding: 0; margin: 16px 0; display: flex; flex-direction: column; gap: 10px; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; }
        .feature-list li:before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
