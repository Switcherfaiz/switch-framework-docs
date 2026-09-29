## Props

Props are how a parent passes data to a child component in Switch Framework. The parent encodes a JSON-safe object with `createProps()` and places it in the child's `data` attribute; the child reads it back with `this.getProps()`. The framework handles all encoding, decoding, and caching – you never touch `getAttribute()` or the Base64 payload yourself.

### createProps

`createProps(props)` encodes a props object for a component's `data` attribute. It is imported from `switch-framework` and returns an encoded string you place in one attribute.

```javascript title:createProps
import { createProps } from 'switch-framework';

const props = createProps({
  label: 'Country',
  options: [
    { label: 'Rwanda', value: 'Rwanda' },
    { label: 'Kenya', value: 'Kenya' }
  ],
  valueState: 'country-value'
});

// place it in the child's data attribute
return \`<sw-dropdown data="\${props}"></sw-dropdown>\`;
```

Props must be JSON-safe: strings, numbers, booleans, arrays, objects, and state-key strings. Functions cannot be encoded – `createProps` warns in the console and JSON drops them. For callbacks, store the function in a state and pass the state-key string instead (see the callback pattern below).

```params-table
{
  "title": "createProps rules",
  "params": [
    { "name": "plain values", "type": "string | number | boolean", "description": "Encoded as-is and returned by getProps unchanged" },
    { "name": "arrays / objects", "type": "JSON-safe", "description": "Nested structures work as long as every value is JSON-safe" },
    { "name": "state keys", "type": "string", "description": "Names of parent-created states – for shared values, actions, and callbacks" },
    { "name": "functions", "type": "not allowed", "description": "Dropped by JSON encoding – store in a state and pass the key" }
  ]
}
```

### getProps

Inside any `SwitchComponent`, call `this.getProps()` to read the decoded props. It returns `{}` when this instance never received props or the payload is malformed.

The parent still writes `data="${createProps(...)}"`. After the first paint the framework copies that payload onto the instance and **removes the attribute**, so Inspect stays clean. `getProps()` reads the instance copy. Stripping does not remount the component.

```javascript title:Reading props in the child
import { SwitchComponent, getState } from 'switch-framework';

export class Dropdown extends SwitchComponent {
  static tag = 'sw-dropdown';

  render() {
    const { label = 'Select', options = [], valueState } = this.getProps();
    const selected = getState(valueState);
    return \`<p>\${label}: \${selected}</p>\`;
  }
}
```

> [!IMPORTANT]
> `getProps()` is an instance method – it cannot be used in a static block, because the element and its props do not exist at class-definition time.

### Props reactivity

Every `SwitchComponent` observes `data`. The first `data` value is ingested and stripped after paint (one render). A **new** `data` value after mount updates the instance copy, re-renders, then strips again. Use `this.getProps()`, not `getAttribute('data')`.

### Callbacks through state keys

Since functions cannot travel through JSON, the parent stores the callback in a state and passes the state key inside props. The child resolves it with `getState(key)` at event time – which means the parent can replace the callback at any moment and the child always calls the latest one.

```javascript title:Parent – state, callback, and props
import { SwitchComponent, createState, updateState, createProps } from 'switch-framework';

export class SettingsPage extends SwitchComponent {
  static tag = 'sw-settings-page';

  static {
    createState('board-value', 'Home decor');
    createState('board-on-change', null);
  }

  onMount() {
    // Outer arrow = updater, inner arrow = the stored callback
    updateState('board-on-change', () => (value) => {
      console.log('Child selected:', value);
    });
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

```javascript title:Child – resolving the callback at event time
import { SwitchComponent, getState, updateState, useEffect } from 'switch-framework';

export class Dropdown extends SwitchComponent {
  static tag = 'sw-dropdown';

  onMount() {
    const { valueState, onChangeState } = this.getProps();

    // re-render when the parent-owned value changes
    useEffect(null, [valueState]);

    this.listener('#dropdown', 'change', (e) => {
      updateState(valueState, e.target.value);

      const onChange = getState(onChangeState);
      if (typeof onChange === 'function') onChange(e.target.value);
    });
  }
}
```

### State-key prop categories

Reusable library components typically accept a few kinds of state-key props. The parent picks the actual state names, which keeps the component reusable across the whole app:

- `valueState` – parent-owned data the child reads or edits
- `changeState` – a state where the child publishes change payloads
- `actionState` – a counter state the parent increments to command the child (e.g. focus)
- `onChangeState` – a state holding a callback the child resolves and calls

### Rules for reusable components

- Props carry JSON-safe values and state-key strings, never raw functions
- The parent creates all required states before rendering the child
- The child resolves callback states with `getState(key)` at action time, not at mount time
- Give each instance uniquely namespaced state keys (e.g. `billing-country`, `shipping-country`)
- Document every accepted prop and its state contract so others can reuse your component

See [[Component Setup|docs/components]] for writing components and [[State Management|docs/state]] for the state APIs used by props.
