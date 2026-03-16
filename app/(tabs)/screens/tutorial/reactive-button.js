import { SwitchComponent, encodeData } from 'switch-framework';

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
  .tutorial-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
  @media (max-width: 768px) { .tutorial-split { grid-template-columns: 1fr; } }
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
      code: `import { SwitchComponent, useState, updateState, getState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';

  connected() {
    const [, unsub] = useState('counter', () => this._renderToShadow());
    this._unsub = unsub;
    this.shadowRoot.querySelector('#inc')?.addEventListener('click', () => {
      updateState('counter', (n) => (n || 0) + 1);
    });
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  render() {
    const count = getState('counter') ?? 0;
    return \`
      <button id="inc">Count: \${count}</button>
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
          Use <code>createState</code> and <code>useState</code> for shared state. When the user clicks, we call <code>updateState</code> – the framework notifies subscribers, and our component re-renders.
        </p>
        <sw-live-code-preview data="${encodeData({
          fileName: 'App.js',
          language: 'javascript',
          code: counterCode.code,
          preview: 'liveview'
        })}"></sw-live-code-preview>
        <h3 class="subsection" id="key-concepts">Key concepts</h3>
        <ul class="feature-list">
          <li><code>createState(0, 'counter')</code> – Create state in your layout init.</li>
          <li><code>useState('counter', callback)</code> – Subscribe to changes; callback runs when state updates.</li>
          <li><code>updateState('counter', n => n + 1)</code> – Update state from anywhere.</li>
          <li><code>getState('counter')</code> – Read current value.</li>
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
