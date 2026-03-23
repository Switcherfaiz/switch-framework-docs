import { SwitchComponent, encodeData } from 'switch-framework';
import { LiveCodePreview } from '../../../../components/LiveCodePreview.js';

if (!customElements.get('sw-live-code-preview')) customElements.define('sw-live-code-preview', LiveCodePreview);

const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 920px; margin: 0 auto; }
  .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
  .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
  .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
  .feature-list { list-style: none; padding: 0; margin: 16px 0; }
  .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
  sw-live-code-preview { display: block; width: 100%; margin: 8px 0 24px; }
`;

export class SwDocsTutorialReactiveButtonScreen extends SwitchComponent {
  static screenName = 'docs/tutorial/reactive-button';
  static path = '/docs/tutorial/reactive-button';
  static title = 'Tutorial: Reactive Button';
  static tag = 'sw-docs-tutorial-reactive-button-screen';
  static layout = 'tabs';

  render() {
    const counterCode = {
      title: 'components/Counter.js',
      language: 'javascript',
      code: `import { SwitchComponent, getState, updateState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { this.useState('counter'); }

  onMount() {
    this.listener('#inc', 'click', () => {
      const next = (getState('counter') ?? 0) + 1;
      updateState('counter', next);
      console.log('Count:', next);
    });
  }

  render() {
    const count = getState('counter') ?? 0;
    return \`<button id="inc">Count: \${count}</button>\`;
  }

  styleSheet() {
    return \`
      <style>
        :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        #inc {
          padding: 14px 32px;
          font-size: 18px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #inc:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
        #inc:active { transform: translateY(0); }
      </style>
    \`;
  }
}`
    };

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Tutorial: Reactive Button</h2>
        <p class="section-desc">
          This tutorial shows how to build a simple button component that updates itself when state changes. The button displays a count and increments it on each click – a classic example of reactive state in Switch Framework.
        </p>
        <h3 class="subsection" id="the-component">The component</h3>
        <p class="section-desc">
          Use <code>createState('counter', 0)</code> in layout init. Call <code>this.useState('counter')</code> in <code>static {}</code> for full re-render. Use <code>this.listener('#inc', 'click', handler)</code> in <code>onMount</code> – safe to call every render, no stacking. When the user clicks, we call <code>updateState</code> and the framework re-renders.
        </p>
        <sw-live-code-preview data="${encodeData({
          title: counterCode.title,
          language: counterCode.language,
          code: counterCode.code,
          preview: 'liveview'
        })}"></sw-live-code-preview>
        <h3 class="subsection" id="key-concepts">Key concepts</h3>
        <ul class="feature-list">
          <li><code>createState('counter', 0)</code> – Create state in layout init (can be called anywhere).</li>
          <li><code>static { this.useState('counter'); }</code> – Subscribe for full re-render. Only state key, no callback.</li>
          <li><code>this.listener(selector, event, callback)</code> – Delegated listener, safe to call in <code>onMount</code> every render.</li>
          <li><code>updateState('counter', n => n + 1)</code> – Update state from anywhere.</li>
          <li><code>getState('counter')</code> – Read current value in render or methods.</li>
        </ul>
        <p class="section-desc"><strong>Try it:</strong> Click the button in the Live Preview above. The count updates instantly – no manual DOM manipulation needed.</p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
