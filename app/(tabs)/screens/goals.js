import { SwitchComponent } from '/switch-framework/index.js';

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

export class SwDocsGoalsScreen extends SwitchComponent {
  static screenName = 'docs/goals';
  static path = '/docs/goals';
  static title = 'Switch Framework Main Goals';
  static tag = 'sw-docs-goals-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Switch Framework Main Goals</h2>
        <p class="section-desc">
          Switch Framework aims to be the simplest way to build structured web apps without build tools. Our main goals:
        </p>
        <h3 class="subsection" id="no-build">No build step</h3>
        <p class="section-desc">
          Run directly in the browser. Use native ES modules, no bundler, no transpilation. Your <code>index.html</code> loads scripts and you're ready. Ideal for prototypes, internal tools, and docs sites.
        </p>
        <h3 class="subsection" id="lightweight">Lightweight</h3>
        <p class="section-desc">
          Small runtime. No virtual DOM, no diffing. Components render HTML strings into shadow DOM. State updates trigger re-renders only where needed. Fast load, fast interaction.
        </p>
        <h3 class="subsection" id="familiar">Familiar patterns</h3>
        <p class="section-desc">
          Stack and tab navigation like mobile apps. State management that feels like React's useState. Web Components under the hood. If you've used React or Vue, you'll feel at home.
        </p>
        <h3 class="subsection" id="flexible">Flexible</h3>
        <p class="section-desc">
          Mix reactive state with vanilla DOM. Use as much or as little of the framework as you need. No lock-in – it's just JavaScript and HTML.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
