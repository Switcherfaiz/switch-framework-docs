import { SwitchComponent } from '/switch-framework/index.js';

export class SwDocsChangelogsScreen extends SwitchComponent {
  static screenName = 'docs/changelogs';
  static path = '/docs/changelogs';
  static title = 'Changelogs';
  static tag = 'sw-docs-changelogs-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Changelogs</h2>
        <p class="section-desc">
          Release notes and version history for Switch Framework. Each version includes new features, improvements, and bug fixes.
        </p>
        <h3 class="subsection" id="v1-2-0">v1.2.0 – March 10, 2026</h3>
        <p class="section-desc"><strong>Features</strong></p>
        <ul class="feature-list">
          <li>Added <code>SwitchStateManager</code> for lightweight reactive state management</li>
          <li>Introduced modal components with state-driven visibility and animations</li>
          <li>Added Toast/Alert components for bottom-up notifications</li>
          <li>New fullscreen pin viewer with scale-up reveal animation</li>
          <li>Framework theming system with dark/light mode support</li>
        </ul>
        <p class="section-desc"><strong>Improvements</strong></p>
        <ul class="feature-list">
          <li>Refactored documentation to use modular screen components</li>
          <li>Enhanced animation system with keyframes and transitions</li>
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
          <li>New router with URL parameter support</li>
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
        .feature-list { list-style: none; padding: 0; margin: 16px 0; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
        .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
