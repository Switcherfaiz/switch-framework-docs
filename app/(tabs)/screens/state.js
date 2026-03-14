import { SwitchComponent, encodeData } from '/switch-framework/index.js';

export class SwDocsStateScreen extends SwitchComponent {
  static screenName = 'docs/state';
  static path = '/docs/state';
  static title = 'State Management';
  static tag = 'sw-docs-state-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">State Management (SwitchStateManager)</h2>
        <p class="section-desc">
          Need to share data between components that live in totally different parts of your app? Say hello to <strong>SwitchStateManager</strong> – a lightweight, event-driven state system. Create a state once, subscribe from anywhere, update from anywhere. No prop drilling, no context providers. Just good ol' reactive state that works.
        </p>
        <h3 class="subsection" id="big-idea">The Big Idea</h3>
        <p class="section-desc">
          You give each state a unique <strong>identifier</strong> (a string like <code>'patient-list'</code> or <code>'cart-items'</code>). One component creates it and gets a setter. Other components – anywhere in the tree – can subscribe and get updates. When someone calls <code>updateState</code>, every subscriber gets notified. Magic! ✨
        </p>
        <h3 class="subsection">Create a state</h3>
        <p class="section-desc">
          Call <code>createState(initialValue, identifier)</code> once – typically in your layout <code>init</code> or a root component. It returns <code>[getValue, setValue]</code>. The identifier must be unique – think of it as the state's "event name" for the whole app.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'app/_layout.js – create state at app boot',
          language: 'javascript',
          code: `import { createState } from '/switch-framework/index.js';

static async init({ globalStates, renderSplashscreen }) {
  createState([], 'patient-list');
  createState(0, 'docs-helpful-count');
  // ... rest of init
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-state">Subscribe in a component (useState)</h3>
        <p class="section-desc">
          Use <code>useState(identifier, callback)</code> to consume a state. You get <code>[currentValue, unsubscribe]</code>. The callback runs immediately with the current value, and again whenever the state changes. Perfect for fine-grained DOM updates without re-rendering the whole component! In SwitchComponent, use <code>connected()</code> and <code>disconnected()</code> for lifecycle hooks.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'SwitchComponent – separate concerns with updateCount',
          language: 'javascript',
          code: `import { SwitchComponent, useState, updateState } from '/switch-framework/index.js';

export class PatientList extends SwitchComponent {
  static tag = 'sw-patient-list';

  updateCount(newPatients) {
    const el = this.shadowRoot?.querySelector('#patient-count');
    if (el) el.textContent = \`Patients: \${(newPatients || []).length}\`;
  }

  connected() {
    const [patients, unsubscribe] = useState('patient-list', this.updateCount.bind(this));
    this._unsub = unsubscribe;
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  render() {
    return \`<span id="patient-count">0</span>\`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection">Update from anywhere (updateState)</h3>
        <p class="section-desc">
          Don't have the setter? No problem. <code>updateState(identifier, newValueOrUpdater)</code> updates any state by its identifier. Pass a value or an updater function <code>(old) => new</code>. Every subscriber gets the new value.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Update state from any component',
          language: 'javascript',
          code: `import { updateState } from '/switch-framework/index.js';

updateState('patient-list', (list) => [...list, newPatient]);
updateState('docs-helpful-count', (n) => n + 1);`
        })}"></sw-codeblock>
        <h3 class="subsection" id="api-summary">API summary</h3>
        <ul class="feature-list">
          <li><code>createState(initialValue, identifier)</code> – create a new state. Returns <code>[getValue, setValue]</code>. Throws if identifier already exists.</li>
          <li><code>useState(identifier, callback?)</code> – subscribe to a state. Returns <code>[currentValue, unsubscribe]</code>. Callback runs immediately and on every update.</li>
          <li><code>updateState(identifier, valueOrUpdater)</code> – update any state by identifier. Same as using the setter from createState.</li>
          <li><code>getState(identifier)</code> – read current value without subscribing.</li>
          <li><code>subscribeState(identifier, callback, options)</code> – lower-level subscribe. Returns unsubscribe. Use <code>options.immediate: false</code> to skip the initial call.</li>
        </ul>
        <p class="section-desc">
          <strong>Pro tip:</strong> Always call <code>unsubscribe</code> in your component's <code>disconnected()</code> to avoid memory leaks. The "Was this helpful?" widget below uses this state – try it! 👇
        </p>
        <sw-docs-feedback></sw-docs-feedback>
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
