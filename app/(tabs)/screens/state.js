import { SwitchComponent, encodeData } from 'switch-framework';

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
          You give each state a unique <strong>identifier</strong> (a string like <code>'patient-list'</code> or <code>'cart-items'</code>). One component creates it and gets a setter. Other components – anywhere in the tree – can subscribe and get updates. When someone calls <code>updateState</code>, every subscriber gets notified.
        </p>
        <h3 class="subsection">Create a state</h3>
        <p class="section-desc">
          Call <code>createState(identifier, initialValue)</code> once – typically in your layout <code>init</code> or a root component. It returns <code>[getValue, setValue]</code>. The identifier must be unique.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'app/_layout.js – create state at app boot',
          language: 'javascript',
          code: `import { createState } from 'switch-framework';

static async init({ globalStates, renderSplashscreen }) {
  createState('patient-list', []);
  createState('docs-helpful-count', 0);
  // ... rest of init
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="static-state">What is static state?</h3>
        <p class="section-desc">
          <strong>Static state</strong> means you declare <code>static { this.useState('counter'); }</code> at class level. The framework subscribes your component to that state key. When <em>any</em> component calls <code>updateState('counter', ...)</code>, your component automatically re-renders. No manual subscribe/unsubscribe – it just works. Think of it like: "whenever this state changes, redraw my component."
        </p>
        <h3 class="subsection" id="use-state-static">useState in static (full re-render)</h3>
        <p class="section-desc">
          When your component uses state and should fully re-render when it changes, call <code>this.useState('counter')</code> inside <code>static {}</code>. Only the state key – no callback. Use <code>getState('counter')</code> in <code>render()</code> and your methods. Subscriptions are automatic.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Component with useState in static – full re-render',
          language: 'javascript',
          code: `import { SwitchComponent, getState, updateState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { this.useState('counter'); }

  onMount() {
    this.bindIncrement();
  }

  bindIncrement() {
    this.shadowRoot.querySelector('#inc')?.addEventListener('click', () => {
      updateState('counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('counter') ?? 0;
    return \`<button id="inc">Count: \${count}</button>\`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-state-normal">useState in normal areas (callback required)</h3>
        <p class="section-desc">
          When you need custom logic on state change (e.g. fine-grained DOM updates), call <code>useState(identifier, callback)</code> from <code>onMount</code>. Callback is required. Pass a single callback or an array of callbacks. Subscriptions are auto-cleaned when the component is destroyed.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'useState with callback – fine-grained updates',
          language: 'javascript',
          code: `import { SwitchComponent, useState, updateState } from 'switch-framework';

export class PatientList extends SwitchComponent {
  static tag = 'sw-patient-list';

  onMount() {
    this.subscribeToPatients();
    this.bindAddButton();
  }

  subscribeToPatients() {
    useState('patient-list', (newPatients) => {
      const el = this.shadowRoot?.querySelector('#patient-count');
      if (el) el.textContent = \`Patients: \${(newPatients || []).length}\`;
    });
  }

  bindAddButton() {
    this.shadowRoot.querySelector('#add')?.addEventListener('click', () => {
      updateState('patient-list', (list) => [...list, { id: Date.now() }]);
    });
  }

  render() {
    return \`<span id="patient-count">0</span> <button id="add">Add</button>\`;
  }
}`
        })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({
          title: 'useState with array of callbacks',
          language: 'javascript',
          code: `onMount() {
  this.subscribeToPins();
}

subscribeToPins() {
  useState('pins', [
    () => this.rerender(),
    () => this._updateBadge()
  ]);
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-effect">useEffect</h3>
        <p class="section-desc">
          <code>useEffect(callback, deps)</code> runs your callback when any state in the <strong>dependency array</strong> changes. Call it from <code>onMount</code>. It works like React's useEffect: when <code>deps</code> change, the effect runs again. If the effect updates state that's in the deps, you get another run – same as React.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'useEffect – runs when deps change',
          language: 'javascript',
          code: `import { SwitchComponent, useEffect, getState } from 'switch-framework';

export class MyScreen extends SwitchComponent {
  onMount() {
    useEffect(() => {
      this.rerender();  // re-render when anotherStateKey changes
    }, ['anotherStateKey']);
  }

  render() {
    const val = getState('anotherStateKey');
    return \`<div>\${val}</div>\`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-effect-fetch">useEffect for data fetching (with loader)</h3>
        <p class="section-desc">
          A common pattern: fetch data, show a loader until it's done, then update state. When state updates, the component re-renders with the data. Use <code>useEffect</code> with a state key as a dep – when you update that state after the fetch, the effect can run again if needed (e.g. when a "refresh" button updates the dep).
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Fetch data, show loader, then render',
          language: 'javascript',
          code: `import { SwitchComponent, useEffect, getState, updateState } from 'switch-framework';

createState('users', null);  // null = loading, [] = loaded

export class UserList extends SwitchComponent {
  static tag = 'sw-user-list';
  static { this.useState('users'); }

  onMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    useEffect(() => {
      if (getState('users') !== null) return;  // already loaded
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => updateState('users', data))  // triggers rerender with data
        .catch(() => updateState('users', []));
    }, ['users']);
  }

  render() {
    const users = getState('users');
    if (users === null) return \`<div class="loader">Loading...</div>\`;
    return \`<ul>\${users.map(u => \`<li>\${u.name}</li>\`).join('')}</ul>\`;
  }
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="use-effect-deps">Dependency array – when does useEffect run again?</h3>
        <p class="section-desc">
          When any state in the dependency array changes, the effect runs. That change can come from <em>any</em> component (or even from inside the effect itself). Example: <code>useEffect(() => { ... }, ['userId'])</code> – when <code>userId</code> is updated anywhere, the effect runs. If the effect calls <code>updateState('userId', newId)</code>, the effect runs again. Same behavior as React.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Effect runs when deps change (from any source)',
          language: 'javascript',
          code: `onMount() {
  this.setupUserEffect();
}

setupUserEffect() {
  useEffect(() => {
    const id = getState('selectedUserId');
    if (id) fetchUserDetails(id).then(d => updateState('userDetails', d));
    this.rerender();
  }, ['selectedUserId']);  // runs when selectedUserId changes
}
// selectedUserId can be updated by: another component, a button click, or this effect`
        })}"></sw-codeblock>
        <h3 class="subsection" id="getstate-methods">getState in methods and styleSheet</h3>
        <p class="section-desc">
          You can call <code>getState('key')</code> anywhere – in <code>render()</code>, in <code>styleSheet()</code>, or in any method. Use it for conditional rendering and conditional styles. No need to pass state as props.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'getState in render, styleSheet, and methods',
          language: 'javascript',
          code: `render() {
  const isOpen = getState('modal-open');
  return \`<div class="modal \${isOpen ? 'visible' : ''}">...</div>\`;
}

styleSheet() {
  const theme = getState('theme') || 'light';
  return \`<style>
    :host { --bg: \${theme === 'dark' ? '#111' : '#fff'}; }
  </style>\`;
}

someMethod() {
  if (getState('loading')) return;
  this.submitForm();
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="lifecycle">Lifecycle: onMount and onDestroy</h3>
        <p class="section-desc">
          <strong>onMount</strong> runs after <em>each</em> render – initial mount and every rerender. Use it to attach event listeners, focus inputs, or run one-time setup (with guards to avoid duplicate listeners). <strong>onDestroy</strong> runs once when the component is removed. Use <code>this.addOnDestroy(fn)</code> to register cleanup (e.g. remove listeners, clear intervals). Use <code>rerender()</code> or <code>renderToShadow()</code> to trigger a re-render.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'onMount and onDestroy',
          language: 'javascript',
          code: `onMount() {
  this.startTimer();
}

startTimer() {
  const interval = setInterval(() => this.tick(), 1000);
  this.addOnDestroy(() => clearInterval(interval));
}

onDestroy() {
  return [() => console.log('cleaned up')];
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="coding-style">Good coding style</h3>
        <p class="section-desc">
          Keep components small. Use <code>static { this.useState('key'); }</code> when you need full re-renders. Use <code>getState</code> in render and methods – no prop drilling. For one-time setup (e.g. route subscription), guard in onMount: <code>if (!this._done) { this._done = true; ... }</code>. Minify your components: avoid duplicate logic, extract helpers.
        </p>
        <h3 class="subsection" id="problems-solved">Problems the framework fixes</h3>
        <p class="section-desc">
          <strong>Prop drilling</strong> – gone. Create state once, <code>getState</code> anywhere. <strong>Manual subscribe/unsubscribe</strong> – use <code>static { this.useState('key'); }</code> and the framework handles it. <strong>Stale closures</strong> – <code>getState</code> always returns the latest value. <strong>Conditional rendering</strong> – use <code>getState</code> in render and styleSheet. <strong>Data fetching + loader</strong> – useEffect + state, show loader until <code>updateState</code> with data.
        </p>
        <h3 class="subsection">Update from anywhere (updateState)</h3>
        <p class="section-desc">
          <code>updateState(identifier, newValueOrUpdater)</code> updates any state by its identifier. Pass a value or an updater function <code>(old) => new</code>.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Update state from any component',
          language: 'javascript',
          code: `import { updateState } from 'switch-framework';

updateState('patient-list', (list) => [...list, newPatient]);
updateState('docs-helpful-count', (n) => n + 1);`
        })}"></sw-codeblock>
        <h3 class="subsection" id="api-summary">API summary</h3>
        <ul class="feature-list">
          <li><code>render()</code> – override to return HTML.</li>
          <li><code>createState(identifier, initialValue)</code> – create a new state. Returns <code>[getValue, setValue]</code>. Throws if identifier already exists.</li>
          <li><code>static { this.useState('counter'); }</code> – subscribe for full re-render. Only state key. Use <code>getState</code> in render.</li>
          <li><code>useState(identifier, callback)</code> – subscribe with callback(s). Returns <code>[currentValue, unsubscribe]</code>. Auto-unsubscribes on destroy.</li>
          <li><code>useEffect(callback, deps)</code> – subscribe to state keys. Callback runs when deps change.</li>
          <li><code>updateState(identifier, valueOrUpdater)</code> – update any state by identifier.</li>
          <li><code>getState(identifier)</code> – read current value without subscribing.</li>
          <li><code>rerender()</code> / <code>renderToShadow()</code> – re-run render + onMount. Use from useEffect callback.</li>
        </ul>
        <p class="section-desc">
          <strong>Internal (do not use):</strong> <code>_runRenderAndMount</code>. Use <code>onMount</code> / <code>onDestroy</code> instead of deprecated <code>connected</code> / <code>disconnected</code>.
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
