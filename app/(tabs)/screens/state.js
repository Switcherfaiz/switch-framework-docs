import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'state',
  path: '/docs/state',
  title: 'State Management',
  tag: 'sw-docs-state-screen',
  layout: 'tabs'
};

export class SwDocsStateScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="doc-section">
        <h2 class="section-title">State Management (SwitchStateManager)</h2>
        <p class="section-desc">
          Need to share data between components that live in totally different parts of your app? Say hello to <strong>SwitchStateManager</strong> – a lightweight, event-driven state system. Create a state once, subscribe from anywhere, update from anywhere. No prop drilling, no context providers. Just good ol' reactive state that works.
        </p>
        
        <h3 class="subsection">The Big Idea</h3>
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
          code: \`import { createState } from '/switch-framework/index.js';

export default {
  async init({ globalStates, renderSplashscreen }) {
    // Create once – any component can now subscribe
    createState([], 'patient-list');
    createState(0, 'docs-helpful-count');

    // ... rest of init
  }
};\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">Subscribe in a component (useState)</h3>
        <p class="section-desc">
          Use <code>useState(identifier, callback)</code> to consume a state. You get <code>[currentValue, unsubscribe]</code>. The callback runs immediately with the current value, and again whenever the state changes. Perfect for fine-grained DOM updates without re-rendering the whole component!
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Component – subscribe and react',
          language: 'javascript',
          code: \`import { useState, updateState } from '/switch-framework/index.js';

class MyPatientList extends HTMLElement {
  connectedCallback() {
    this.render();

    const [patients, unsubscribe] = useState('patient-list', (newPatients) => {
      // Optional: update only the count element
      const el = this.shadowRoot?.querySelector('#patient-count');
      if (el) el.textContent = \\\`Patients: \\\${newPatients.length}\\\`;
    });
    this._unsub = unsubscribe;
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }
}\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">Update from anywhere (updateState)</h3>
        <p class="section-desc">
          Don't have the setter? No problem. <code>updateState(identifier, newValueOrUpdater)</code> updates any state by its identifier. Pass a value or an updater function <code>(old) => new</code>. Every subscriber gets the new value.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Update state from any component',
          language: 'javascript',
          code: \`import { updateState } from '/switch-framework/index.js';

// Add a patient
updateState('patient-list', (list) => [...list, newPatient]);

// Increment a counter
updateState('docs-helpful-count', (n) => n + 1);\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">API summary</h3>
        <ul class="feature-list">
          <li><code>createState(initialValue, identifier)</code> – create a new state. Returns <code>[getValue, setValue]</code>. Throws if identifier already exists.</li>
          <li><code>useState(identifier, callback?)</code> – subscribe to a state. Returns <code>[currentValue, unsubscribe]</code>. Callback runs immediately and on every update.</li>
          <li><code>updateState(identifier, valueOrUpdater)</code> – update any state by identifier. Same as using the setter from createState.</li>
          <li><code>getState(identifier)</code> – read current value without subscribing.</li>
          <li><code>subscribeState(identifier, callback, options)</code> – lower-level subscribe. Returns unsubscribe. Use <code>options.immediate: false</code> to skip the initial call.</li>
        </ul>
        <p class="section-desc">
          <strong>Pro tip:</strong> Always call <code>unsubscribe</code> in your component's <code>disconnectedCallback</code> to avoid memory leaks. The "Was this helpful?" widget below uses this state – try it! 👇
        </p>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .doc-section {
          padding: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--main_text);
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .section-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--sub_text);
          margin: 0 0 20px;
        }

        .subsection {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 28px 0 12px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-list li {
          font-size: 14px;
          line-height: 1.6;
          color: var(--sub_text);
          padding-left: 20px;
          position: relative;
        }

        .feature-list li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--main_color);
          font-weight: 700;
        }

        code {
          background: var(--surface_2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
          font-size: 13px;
          color: var(--main_text);
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-state-screen')) {
  customElements.define('sw-docs-state-screen', SwDocsStateScreen);
}
