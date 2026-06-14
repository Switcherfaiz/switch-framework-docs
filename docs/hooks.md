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

### Router hooks

From `switch-framework/router`: `useParams()`, `useSearchParams()`, `getActiveRoute()`, `useRouteChangesSubscriber()`.
