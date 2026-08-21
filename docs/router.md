## Router

Switch Framework's router is **runtime-first** – no webpack, no build step. Register screens in your layout files and the router handles navigation, deep linking, browser history, and route parameters.

### Register screens

Screens are registered in layout static arrays — not individually at boot.

```javascript title:app/_layout.js — stack screens
export class MyStackLayout extends StackLayout {
  static stackScreens = [IndexScreen, LoginScreen, NotFoundScreen];
  static tabsLayout = MyTabsLayout;
}
```

```javascript title:app/(tabs)/_layout.js — tab screens
export class MyTabsLayout extends TabLayout {
  static screens = [HomeScreen, HomeCategoryScreen, ExploreScreen];
  static tabs = [
    { name: 'home', path: '/home', screen: 'my-home-screen', match: ['home'] }
  ];
}
```

### Screen config

Each screen defines its route identity. Layout (`stack` vs `tabs`) is inferred from which array you register it in. Optionally set `static layout` — it must match that array.

```javascript title:Static route — /home
export class HomeScreen extends SwitchComponent {
  static screenName = 'home';
  static path = '/home';
  static title = 'Home';
  static tag = 'my-home-screen';
}
```

```javascript title:Dynamic route — /home/:id
export class HomeCategoryScreen extends SwitchComponent {
  static screenName = 'home/:id';
  static path = '/home/:id';
  static title = 'Home';
  static tag = 'my-home-category-screen';
}
```

Each screen needs its **own `static tag`**. If two screens share a tag, the first class wins and the second route will render the wrong screen (pills/active states look stuck).

Screens stay mounted when you leave them (hide/show). Scroll is kept. Use `useScreenFocus` from [[Hooks|docs/hooks]] to fetch only while the screen is visible.

```javascript title:Stack route — /login
export class LoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static title = 'Login';
  static tag = 'my-login-screen';
}
```

The router matches `/home` to the exact route first, then `/home/electronics` to the dynamic route — no special syntax needed.

### Navigate

```javascript title:Navigate to routes
import { navigate } from 'switch-framework/router';

navigate('home');
navigate('home/electronics');
navigate('login');
navigate('docs', { id: 'introduction' });
```

### Route params & state

```javascript title:Path params (:id) and query params (?name=)
import { useParams, useSearchParams, getActiveRoute, getActivePath } from 'switch-framework/router';

onMount() {
  const params = useParams();       // { id: '42' } from /user/:id
  const search = useSearchParams(); // { name: 'Jane' } from ?name=Jane
  const route = getActiveRoute();   // 'home/electronics'
  const path = getActivePath();     // full browser URL
}
```

### Navigation helpers

```javascript title:previousRoute / nextRoute
const prev = previousRoute('docs');
const next = nextRoute('docs');
if (prev) navigate(prev.route, prev.params);
```

### API

- `navigate(route, params)` – Navigate to a route, update browser history
- `goBack()` – Go back in browser history
- `redirect(route, params)` – Same as navigate (alias)
- `replace(route, params)` – Replace current history entry
- `useParams()` – Get path params (e.g. `{ id: '42' }`)
- `useSearchParams()` – Get query params (e.g. `{ name: 'Jane' }`)
- `getActivePath()` – Full current URL
- `getActiveRoute()` – Current route key (no leading `/`)
- `isScreenActive(screenName)` – Whether a screen name matches the current route
- `useScreenFocus(fn)` – Run `fn` only while this screen is active (call from `effects()`)
- `useRouteChangesSubscriber(callback)` – Subscribe to route changes
