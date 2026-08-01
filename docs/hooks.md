## Hooks

Switch Framework provides hooks for reactive updates. `useState` subscribes to state changes; `useEffect` subscribes to `globalStates` keys like `activeRoute`.

### useState

Subscribe to a state key. When the state changes, your callback runs. Return an unsubscribe function – call it in `disconnected()` to avoid leaks.

```javascript title:useState
const [value, unsub] = useState('my-state', (newValue) => {
  // Runs when state changes
  this._renderToShadow();
});
// Call unsub() in disconnected()
```

### useEffect

Subscribe to `globalStates` keys. Useful for re-rendering when the route or route params change. The callback runs when any watched key updates.

```javascript title:useEffect
connected() {
  this.useEffect(() => this._renderToShadow(), ['activeRoute', 'routeParams']);
}
```

### getProps

Read the props a parent passed through the encoded `data` attribute. The framework decodes and caches the payload for you – never call `getAttribute('data')` or `decodeData()` yourself. Returns `{}` when no props were passed. Available in `render()`, `onMount()`, and event handlers on every `SwitchComponent`.

```javascript title:getProps
render() {
  const { label = 'Select', valueState } = this.getProps();
  const value = getState(valueState);
  return \`<p>\${label}: \${value}</p>\`;
}
```

The component re-renders automatically when the parent replaces its `data` attribute – no `observedAttributes` boilerplate needed. See [[Props|docs/data-flow/props]] for the full props guide with `createProps` and the state-key callback pattern.

### Router hooks

From `switch-framework/router`: `useParams()`, `useSearchParams()`, `getActiveRoute()`, `useRouteChangesSubscriber()`.
