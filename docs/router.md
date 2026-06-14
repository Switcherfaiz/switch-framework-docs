## Router

Switch Framework's router is **runtime-first** – no webpack, no build step. Just register your screens, and the router handles navigation, deep linking, browser history, and route parameters. It works great with stack and tab layouts.

### Define routes

Register screens in your layout's static config. A screen extends SwitchComponent with static `screenName`, `path`, `title`, `tag`. Paths can include parameters like `:id`.

```javascript title:Register screens (app/_layout.js)
import { StackLayout } from 'switch-framework';

const stackScreens = [SwIndexScreen, SwUserNotFoundScreen];
const layout = SwStackLayout.getAppLayout();
```

### Navigate

Use `navigate(route, params)` to go to a route. For dynamic routes, pass params as the second argument or embed them in the route string.

```javascript title:Navigate to routes
import { navigate } from 'switch-framework/router';

navigate('docs/introduction');
navigate('user/42');
navigate('docs', { id: 'introduction' });
```

### Route params & state

Access route parameters and search params inside your screen. Use hooks to get the current route and params.

```javascript title:Path params (:id) and query params (?name=)
import { useParams, useSearchParams, getActiveRoute, getActivePath } from 'switch-framework/router';

// Path params from /user/:id  ->  useParams() returns { id: '42' }
// Query params from ?name=Jane&age=30  ->  useSearchParams() returns { name: 'Jane', age: '30' }

connected() {
  const params = useParams();      // { id: '42' }
  const search = useSearchParams(); // { name: 'Jane', age: '30' }
  const route = getActiveRoute();   // 'user/42'
  const path = getActivePath();     // 'http://localhost:3000/user/42' (same as window.location.href)
}
```

### Define screens with params

Use `:param` in your path for dynamic segments. Query params (`?name=value`) are automatically parsed into `searchParams` in globalStates; use `useSearchParams()` to read them.

```javascript title:Define screen with dynamic path
// Screen for /user/:id
export class UserScreen extends SwitchComponent {
  static screenName = 'user/[id]';
  static path = '/user/:id';
  static title = 'User';
  static tag = 'sw-user-screen';
  static layout = 'tabs';
  // useParams() will return { id: '42' } when visiting /user/42
}
```

### Navigation helpers

The router provides helper functions for common navigation patterns.

```javascript title:previousRoute / nextRoute
const prev = previousRoute('docs');  // { route, params, title }
const next = nextRoute('docs');
if (prev) navigate(prev.route, prev.params);
```

### API

- `navigate(route, params)` – Navigate to a route, update browser history
- `goBack()` – Go back in browser history
- `redirect(route, params)` – Same as navigate (alias)
- `replace(route, params)` – Replace current history entry instead of pushing
- `useParams()` – Get path params (e.g. `{ id: '42' }`)
- `useSearchParams()` – Get query params (e.g. `{ name: 'Jane' }` from `?name=Jane`)
- `getActivePath()` – Get full current URL path (e.g. `'http://localhost:3000/docs/introduction'`)
- `getActiveRoute()` – Get current route only (no leading `/`)
- `useRouteChangesSubscriber(callback)` – Subscribe to route changes
