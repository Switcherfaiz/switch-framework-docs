import { SwitchComponent } from 'switch-framework';

export class SwChangelogsScreen extends SwitchComponent {
  static screenName = 'changelogs';
  static path = '/changelogs';
  static title = 'Changelogs';
  static tag = 'sw-changelogs-screen';
  static layout = 'stack';

  render() {
    return `
      <div class="changelogs-wrap">
        <header class="changelogs-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="changelogs-main">
          <div class="doc-section">
            <h2 class="section-title" id="overview">Changelogs</h2>
            <p class="section-desc">
              Release notes and version history for Switch Framework. Each version includes new features, improvements, and bug fixes.
            </p>
            <h3 class="subsection" id="v0-2-2">v0.2.3 – April 5, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li><strong>StackLayout</strong> now supports custom <code>render()</code> and <code>styleSheet()</code> methods for building complex app shells with global UI elements</li>
              <li>Global popups in StackLayout (search modals, bottom sheets) now persist visibility across layout switches – any content inside a container with <code>data-popups</code> attribute is automatically extracted to the app shell level</li>
              <li><sw-docs-changelog-link text="FlatList" route="docs/components/flatlist"></sw-docs-changelog-link> improvements: optimized scroll performance, better grid layout calculations, and enhanced state-driven re-rendering</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Updated <sw-docs-changelog-link text="Layouts" route="docs/layouts"></sw-docs-changelog-link> documentation with comprehensive StackLayout API reference</li>
              <li>FlatList now properly handles dynamic data updates with <code>updateState</code> without full re-renders</li>
              <li>Docs sidebar navigation now works correctly in both desktop and mobile tab layouts</li>
              <li>Theme-aware logos and splash screen with rotating animations and gradient loaders</li>
            </ul>
            <p class="section-desc"><strong>Bug Fixes</strong></p>
            <ul class="feature-list">
              <li>Fixed pointer-events blocking in sw-stack-shell when tabs layout is active</li>
              <li>Resolved z-index layering issues between tab content and sidebars</li>
              <li>Fixed popup visibility being lost when navigating between stack and tabs layouts</li>
            </ul>

            <h3 class="subsection" id="v0-2-1">v0.2.1 – March 17, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Docs search component with dedicated routes JSON – search matches keywords and navigates to the selected doc</li>
              <li>Dashboard and CLI docs now show <code>npm install -g create-switch-framework-app</code> for global install</li>
              <li>CLI page documents global install usage and how to run the CLI when installed globally</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Expanded state management docs: static state behavior, onMount, getState in methods and styleSheet, useEffect for data fetching with loader, dependency array and rerender behavior</li>
              <li>Fixed docs pagination (Previous/Next) to correctly point to all doc screens in order</li>
              <li>Migrated DocsPagination and DocsLeftSidebarNav from deprecated connected/disconnected to onMount/onDestroy</li>
            </ul>
            <h3 class="subsection" id="v0-2-0">v0.2.0 – March 16, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Next.js-like server API: <code>switchFrameworkBackend.config()</code> and <code>app.initServer((server) => { ... })</code></li>
              <li>Clean import specifiers: <code>'switch-framework'</code> and <code>'switch-framework/router'</code> instead of path-based imports</li>
              <li>Import map auto-injection: server injects import map into index.html on request – no import map in your HTML source</li>
              <li>Backend owns Express setup: framework routes, static files, SPA catch-all, and session built-in</li>
              <li>Dual module support: works with both CommonJS (<code>require</code>) and ESM (<code>import</code>)</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Simplified server.js: user adds middleware via <code>initServer</code> callback; no manual <code>app.use</code> for framework routes</li>
              <li>New <sw-docs-changelog-link text="Server documentation" route="docs/server/introduction"></sw-docs-changelog-link> (Introduction, Web Server, Desktop Server)</li>
              <li>Updated CLI templates and docs code snippets to use clean import specifiers</li>
            </ul>
            <h3 class="subsection" id="v1-2-0">v1.2.0 – March 10, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Added <sw-docs-changelog-link text="State Management" route="docs/state"></sw-docs-changelog-link> for lightweight reactive state management</li>
              <li>Introduced modal components with state-driven visibility and animations</li>
              <li>Added Toast/Alert components for bottom-up notifications</li>
              <li>New fullscreen pin viewer with scale-up reveal animation</li>
              <li>Framework <sw-docs-changelog-link text="Theming" route="docs/theming"></sw-docs-changelog-link> system with dark/light mode support</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Refactored documentation to use modular screen components</li>
              <li>Enhanced <sw-docs-changelog-link text="Animations" route="docs/animations"></sw-docs-changelog-link> system with keyframes and transitions</li>
              <li>Better code organization with state helpers in app/state.js</li>
              <li>Improved type safety in router with route parameter handling</li>
            </ul>
            <p class="section-desc"><strong>Bug Fixes</strong></p>
            <ul class="feature-list">
              <li>Fixed modal z-index stacking issues</li>
              <li>Corrected route matching for static vs dynamic paths</li>
              <li>Fixed template literal syntax in code blocks</li>
            </ul>
            <h3 class="subsection" id="v1-1-0">v1.1.0 – February 28, 2026</h3>
            <p class="section-desc"><strong>Features</strong></p>
            <ul class="feature-list">
              <li>Added responsive tab layout system</li>
              <li>Introduced stack navigation for modal-like flows</li>
              <li>New <sw-docs-changelog-link text="Router" route="docs/router"></sw-docs-changelog-link> with URL parameter support</li>
            </ul>
            <p class="section-desc"><strong>Improvements</strong></p>
            <ul class="feature-list">
              <li>Better CSS variable system for theming</li>
              <li>Optimized Web Components performance</li>
            </ul>
            <h3 class="subsection" id="v1-0-0">v1.0.0 – January 15, 2026</h3>
            <p class="section-desc"><strong>Initial Release</strong></p>
            <ul class="feature-list">
              <li>Runtime-first framework with no build step required</li>
              <li>Web Components-based architecture</li>
              <li>Built-in router with stack and tab layouts</li>
              <li>Basic theming system</li>
              <li>Documentation and examples</li>
            </ul>
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
        .changelogs-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .changelogs-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .changelogs-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        .feature-list { list-style: none; padding: 0; margin: 16px 0; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
        .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
      </style>
    `;
  }
}
