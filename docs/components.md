## SwitchComponent

All screens and UI components extend **SwitchComponent**. It provides shadow DOM, a render lifecycle, and `useEffect` for reactive updates. No `customElements.define` needed – use `registerComponents([...])` in your layout and the framework auto-registers classes with a static `tag`.

### Writing a component

Override `render()` and optionally `styleSheet()`. Use `onMount()` for lifecycle logic with `this.listener()` for events, and `static { this.useState('key'); }` for reactive updates.

```javascript title:Basic component
import { SwitchComponent } from 'switch-framework';

export class MyButton extends SwitchComponent {
  static tag = 'sw-my-button';

  onMount() {
    this.listener('.btn', 'click', () => console.log('Clicked!'));
  }

  render() {
    return `<button class="btn">Click me</button>`;
  }

  styleSheet() {
    return `<style>.btn { padding: 8px 16px; border-radius: 8px; }</style>`;
  }
}
```

### Reactivity with createState and useState

Use `createState(identifier, initialValue)` to create shared state. Use `static { this.useState('key'); }` in your component to subscribe to state changes for automatic re-rendering. No manual unsubscribe needed.

```javascript title:Reactive component with useState
import { SwitchComponent, createState, getState, updateState } from 'switch-framework';

createState('my-counter', 0);

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { this.useState('my-counter'); }

  onMount() {
    this.listener('#inc', 'click', () => {
      updateState('my-counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('my-counter') ?? 0;
    return `<button id="inc">Count: ${count}</button>`;
  }
}
```

### useEffect for reactive updates

`useEffect(callback, deps)` subscribes to state keys (e.g. `['activeRoute', 'routeParams']`). When any watched key changes, the callback runs. Use it in `onMount()` and store the unsubscriber via `this.addOnDestroy()`.

```javascript title:useEffect example
import { SwitchComponent, useEffect } from 'switch-framework';

export class MyScreen extends SwitchComponent {
  static tag = 'sw-my-screen';

  onMount() {
    const unsub = this.useEffect(() => {
      this.rerender();
    }, ['activeRoute', 'routeParams']);
    this.addOnDestroy(unsub);
  }

  render() {
    return `<div>Content</div>`;
  }
}
```

### Not Found Screen

If the framework finds a `+not-found.js` file, it expects a component with `path: '/+not-found'`. That screen is used instead of the framework's default not-found. The router auto-detects it by path – add it to `stackScreens` in your layout.

```javascript title:+not-found.js
import { SwitchComponent, navigate, goBack } from 'switch-framework';
import { getActivePath } from 'switch-framework/router';

export default class extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-not-found-screen';
  static layout = 'stack';

  onMount() {
    this.listener('#home', 'click', () => navigate('index'));
    this.listener('#back', 'click', () => goBack());
  }

  render() {
    const path = getActivePath();
    return `<div><button id="home">Go to Home</button><button id="back">Go Back</button><p>${path}</p></div>`;
  }
}
```

**Key points:**

- Use `export default class` – the framework detects not-found by `path: '/+not-found'`
- Import `navigate` and `goBack` from the framework
- Use `getActivePath()` from `switch-framework/router` to show the attempted route
- Use `this.listener()` for delegated event handling
- Add the screen to `stackScreens` in your layout

### Static properties

- `static tag` – Custom element tag (e.g. `'sw-my-component'`)
- `static screenName` – Route identifier for screens (e.g. `'home'`)
- `static path` – URL path for screens (e.g. `'/home'`)
- `static title` – Display title for screens
- `static layout` – `'stack'` or `'tabs'`
- `static { this.useState('key'); }` – Subscribe to state for auto re-render

### Methods

- `render()` – Return HTML string. Called automatically when subscribed state changes.
- `styleSheet()` – Return CSS string for component styles.
- `onMount()` – Called when element is connected. Use for setup and listeners.
- `onDestroy()` – Called when element is disconnected. Use for cleanup.
- `this.listener(selector, event, handler)` – Delegated event listener. Safe to call in onMount.
- `this.useEffect(callback, deps)` – Subscribe to state keys. Returns unsubscriber.
- `this.addOnDestroy(fn)` – Register cleanup function called on destroy.
- `this.rerender()` – Manually trigger re-render.
- `this.select(selector)` – Query element in shadow DOM.
- `this.selectAll(selector)` – Query all elements in shadow DOM.
