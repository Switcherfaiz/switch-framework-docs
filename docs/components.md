## SwitchComponent

All screens and UI components extend **SwitchComponent**. It provides shadow DOM, a render lifecycle, and `useEffect` for reactive updates. No `customElements.define` needed – use `registerComponents([...])` in your layout and the framework auto-registers classes with a static `tag`.

**Built-in components:** [[FlatList|docs/components/flatlist]] for row lists, [[ScrollView|docs/components/scrollview]] for a viewport that can host masonry or mixed content without remounting on load-more, [[Modal|docs/components/modal]] for overlays. Nest a Modal tag anywhere — the framework lifts it onto the `.popups` layer so it paints on top.

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

### Props with createProps and getProps

Pass props to a child component by encoding them into its `data` attribute with `createProps(props)`. The child reads them with `this.getProps()` – the framework handles decoding and caching internally. Props must be JSON-safe: plain values, arrays, objects, and state-key strings. For the full guide including the `createProps` API reference and callback patterns, see [[Props|docs/data-flow/props]].

```javascript title:Parent passing props
import { SwitchComponent, createState, createProps, getState } from 'switch-framework';

export class SettingsPage extends SwitchComponent {
  static tag = 'sw-settings-page';

  static {
    createState('board-value', 'Home decor');
    createState('board-on-change', null);
  }

  render() {
    const props = createProps({
      label: 'Default board',
      options: [
        { label: 'Home decor', value: 'Home decor' },
        { label: 'Travel', value: 'Travel' }
      ],
      valueState: 'board-value',
      onChangeState: 'board-on-change'
    });

    return \`<sw-dropdown data="\${props}"></sw-dropdown>\`;
  }
}
```

```javascript title:Child reading props
import { SwitchComponent, getState, updateState, useEffect } from 'switch-framework';

export class Dropdown extends SwitchComponent {
  static tag = 'sw-dropdown';

  render() {
    const { label = 'Select', options = [], valueState } = this.getProps();
    const selected = getState(valueState);
    return \`...\`;
  }

  onMount() {
    const { valueState, onChangeState } = this.getProps();
    useEffect(null, [valueState]);

    this.listener('#dropdown', 'change', (e) => {
      updateState(valueState, e.target.value);

      // Resolve the callback at event time so the parent can replace it later
      const onChange = getState(onChangeState);
      if (typeof onChange === 'function') onChange(e.target.value);
    });
  }
}
```

**Callbacks through state keys.** Functions cannot be JSON-encoded, so never put them in props – `createProps` warns and drops them. Instead the parent stores the callback in a state and passes the state-key string. Assign a callback with an updater (the outer arrow is the updater, the inner arrow is the stored callback):

```javascript title:Storing a callback in state
updateState('board-on-change', () => (value) => {
  console.log('Child selected:', value);
});
```

**Props reactivity.** Every `SwitchComponent` observes its `data` attribute – when the parent renders the child with different props, the child re-renders automatically. The framework never removes or modifies the attribute, so the DOM always shows the props each instance received.

**Rules for reusable components:**

- Props carry JSON-safe values and state-key strings, never raw functions
- The parent creates all required states before rendering the child
- The child resolves callback states with `getState(key)` at action time, not at mount time
- Give each component instance uniquely namespaced state keys (e.g. `billing-country`, `shipping-country`)
- Document every accepted prop and its state contract so others can reuse your component

### Registering components

Components self-register at the bottom of their own file with `registerComponent(Cls)` – it needs a `static tag` and safely skips tags that are already defined. Screens that use a component just import its file, so layouts never need long registration lists. `registerComponents([...])` still works for registering several classes at once.

```javascript title:Self-registering component
import { SwitchComponent, registerComponent } from 'switch-framework';

export class MyBadge extends SwitchComponent {
  static tag = 'sw-my-badge';
  render() { return \`<span>New</span>\`; }
}

registerComponent(MyBadge);
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
- `static { this.useState('key'); }` – Subscribe to state for auto re-render

Layout (`stack` vs `tabs`) is inferred from where you register the screen — `stackScreens` or `TabLayout.screens`. Optionally set `static layout`; it must match that registration.

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
