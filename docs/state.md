## State Management (SwitchStateManager)

Need to share data between components that live in totally different parts of your app? Say hello to **SwitchStateManager** – a lightweight, event-driven state system. Create a state once, subscribe from anywhere, update from anywhere. No prop drilling, no context providers. Just good ol' reactive state that works.

### The Big Idea

You give each state a unique **identifier** (a string like `'patient-list'` or `'cart-items'`). One component creates it and gets a setter. Other components – anywhere in the tree – can subscribe and get updates. When someone calls `updateState`, every subscriber gets notified.

### Create a state

Call `createState(identifier, initialValue)` once – typically in your layout `init` or a root component. It returns `[getValue, setValue]`. The identifier must be unique.

```javascript title:app/_layout.js – create state at app boot
import { createState } from 'switch-framework';

static async init({ globalStates, renderSplashscreen }) {
  createState('patient-list', []);
  createState('docs-helpful-count', 0);
}
```

### What is static state?

**Static state** means you declare `static { this.useState('counter'); }` at class level. The framework subscribes your component to that state key. When any component calls `updateState('counter', ...)`, your component automatically re-renders.

### useState in static (full re-render)

When your component uses state and should fully re-render when it changes, call `this.useState('counter')` inside `static {}`. Only the state key – no callback. Use `getState('counter')` in `render()` and your methods.

```javascript title:Component with useState in static – full re-render
import { SwitchComponent, getState, updateState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { this.useState('counter'); }

  onMount() {
    this.listener('#inc', 'click', () => {
      updateState('counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('counter') ?? 0;
    return `<button id="inc">Count: ${count}</button>`;
  }
}
```

### useState in normal areas (callback required)

When you need custom logic on state change (e.g. fine-grained DOM updates), call `useState(identifier, callback)` from `onMount`. Callback is required. Subscriptions are auto-cleaned when the component is destroyed.

```javascript title:useState with callback – fine-grained updates
import { SwitchComponent, useState, updateState } from 'switch-framework';

export class PatientList extends SwitchComponent {
  static tag = 'sw-patient-list';

  onMount() {
    useState('patient-list', (newPatients) => {
      const el = this.shadowRoot?.querySelector('#patient-count');
      if (el) el.textContent = `Patients: ${(newPatients || []).length}`;
    });
  }

  render() {
    return `<span id="patient-count">0</span> <button id="add">Add</button>`;
  }
}
```

### useEffect

`useEffect(callback, deps)` runs your callback when any state in the **dependency array** changes. Call it from `onMount()`. It works like React's useEffect: when `deps` change, the effect runs again.

```javascript title:useEffect – runs when deps change
import { SwitchComponent, useEffect, getState } from 'switch-framework';

export class MyScreen extends SwitchComponent {
  onMount() {
    useEffect(() => {
      this.rerender();
    }, ['anotherStateKey']);
  }

  render() {
    const val = getState('anotherStateKey');
    return `<div>${val}</div>`;
  }
}
```

### getState in methods and styleSheet

You can call `getState('key')` anywhere – in `render()`, in `styleSheet()`, or in any method. Use it for conditional rendering and conditional styles. No need to pass state as props.

### Lifecycle: onMount and onDestroy

**onMount** runs after each render – initial mount and every rerender. **onDestroy** runs once when the component is removed. Use `this.addOnDestroy(fn)` to register cleanup.

### Update from anywhere (updateState)

`updateState(identifier, newValueOrUpdater)` updates any state by its identifier. Pass a value or an updater function `(old) => new`.

```javascript title:Update state from any component
import { updateState } from 'switch-framework';

updateState('patient-list', (list) => [...list, newPatient]);
updateState('docs-helpful-count', (n) => n + 1);
```

### API summary

- `render()` – override to return HTML.
- `createState(identifier, initialValue)` – create a new state. Throws if identifier already exists.
- `static { this.useState('counter'); }` – subscribe for full re-render.
- `useState(identifier, callback)` – subscribe with callback(s). Auto-unsubscribes on destroy.
- `useEffect(callback, deps)` – subscribe to state keys. Callback runs when deps change.
- `updateState(identifier, valueOrUpdater)` – update any state by identifier.
- `getState(identifier)` – read current value without subscribing.
- `rerender()` / `renderToShadow()` – re-run render + onMount.

**Internal (do not use):** `_runRenderAndMount`. Use `onMount` / `onDestroy` instead of deprecated `connected` / `disconnected`.
