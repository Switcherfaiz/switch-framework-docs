## Tutorial: Reactive Button

This tutorial shows how to build a simple button component that updates itself when state changes. The button displays a count and increments it on each click – a classic example of reactive state in Switch Framework.

### The component

Use `createState('counter', 0)` in layout init. Call `this.useState('counter')` in `static {}` for full re-render. Use `this.listener('#inc', 'click', handler)` in `onMount` – safe to call every render, no stacking. When the user clicks, we call `updateState` and the framework re-renders.

```javascript title:components/Counter.js preview:liveview
import { SwitchComponent, getState, updateState, createState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { createState('counter', 0); }
  static { this.useState('counter'); }

  onMount() {
    this.listener('#inc', 'click', () => this.updateCounter());
  }

  updateCounter() {
    const count = getState('counter');
    updateState('counter', parseInt(count) + 1);
  }

  render() {
    const count = getState('counter');
    return `<button id="inc">Count: ${count}</button>`;
  }

  styleSheet() {
    return `<style>#inc { padding: 14px 32px; font-size: 18px; border: none; border-radius: 12px; cursor: pointer; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }</style>`;
  }
}
```

### Key concepts

- `createState('counter', 0)` – Create state in layout init (can be called anywhere).
- `static { this.useState('counter'); }` – Subscribe for full re-render. Only state key, no callback.
- `this.listener(selector, event, callback)` – Delegated listener, safe to call in `onMount` every render.
- `updateState('counter', n => n + 1)` – Update state from anywhere.
- `getState('counter')` – Read current value in render or methods.

**Try it:** Click **Run** on the code block to open the live preview, then click the button — the count updates instantly.
