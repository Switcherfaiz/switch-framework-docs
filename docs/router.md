## Router

Switch Framework's router is **runtime-first** – no webpack, no build step. Register leaf screens (and nested layout classes) in your layout files. The router handles navigation, deep linking, browser history, and route parameters.

> [!IMPORTANT]
> Leaf screens must define `static screenName`, `static path`, `static title`, and `static tag`, then be added to a layout `screens` / `stackScreens` list. Layouts use `screenName` + `initialScreen` / `initialTab` — they do **not** get `static path`. The tag pattern is `sw-*` (or your app prefix).

See [[Layouts|docs/layouts]] for RootLayout, nested stacks, and tab chrome.

### Register screens

Screens are registered in layout static arrays — not individually at boot. A layout class in that array is a **nested navigator**, not a URL.

```javascript title:app/_layout.js — root stack
import { RootLayout } from 'switch-framework';

export class MyRootLayout extends RootLayout {
  static screens = [MyTabsLayout, IndexScreen, LoginScreen, NotFoundScreen];
  static tabsLayout = MyTabsLayout;
  static initialScreen = 'index';
}
```

```javascript title:app/(tabs)/_layout.js — tabs + nested stack
export class MyTabsLayout extends TabLayout {
  static screenName = '(tabs)';
  static initialTab = 'home';
  static screens = [HomeScreen, HomeCategoryScreen, ExploreScreen, ProfileStack];
  static tabs = [
    { name: 'home', path: '/home', screen: 'my-home-screen', match: ['home'] },
    { name: 'profile', path: '/profile', screen: 'my-profile-screen', match: ['profile', 'settings', 'about'] }
  ];
}
```

### Screen config

Each **leaf** defines its route identity. Layout (`stack` vs `tabs`) is inferred from which navigator owns it (nearest TabLayout in the chain → `tabs`). Optionally set `static layout` — it must match that owner.

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

Screen enter/leave is **off** unless you set `static inAnimation`, `outAnimation`, or `navigatingAnimation`. See [[Animations|docs/animations]].

Screens stay mounted when you leave them (hide/show). Scroll is kept. Use `useScreenFocus` from [[Hooks|docs/hooks]] to fetch only while the screen is the active leaf.

```javascript title:Root stack route — /login
export class LoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static title = 'Login';
  static tag = 'my-login-screen';
}
```

The router matches `/home` to the exact route first, then `/home/electronics` to the dynamic route — no special syntax needed.

### URLs and layout ids

Only leaf `path` values appear in the address bar. Nested layout names such as `(tabs)` or `profile-stack` are **navigate targets**, not paths.

```params-table
{"headers":["You open / call","Address bar","Mounts"],"htmlColumns":[0,1,2],"rows":[["`/home` or <code>navigate('home')</code>","<code>/home</code>","Root then tabs then home"],["<code>navigate('(tabs)')</code>","Initial tab leaf (usually <code>/home</code>)","Same as that leaf"],["<code>navigate('profile-stack')</code>","That stack's <code>initialScreen</code> path","Root then tabs then stack then leaf"],["<code>/login</code>","<code>/login</code>","Root then login (tabs hidden)"]]}
```

One browser history for the whole tree. Nested stacks do not push a second history stack.

### How to navigate well

1. **Prefer leaf `screenName`.** `navigate('settings')` is the URL you want people to share.
2. **Use a layout id** when you mean “go to this navigator’s default child” — `navigate('(tabs)')` after login, `navigate('profile-stack')` to land on profile.
3. **Keep auth on the root stack**, as a sibling of the tabs layout, so `navigate('login')` hides the tab bar.
4. **Put nested flows in a StackLayout** under tabs when the tab bar should stay (profile → settings → about). Nested stack leaves are inferred onto that tab; use `match` only for extras.
5. **Deep links are leaf paths.** Bookmark `/about`; the router rebuilds the layout chain from the leaf.
6. **Keep-alive is hide/show.** Use `useScreenFocus` for fetches. Use `reset('home')` when you need a fresh instance, and `wipeTo('login')` after logout so protected screens cannot be shown from cache or Back.
7. **Do not** invent `/(tabs)` or layout paths in `static path`. Do not register routes from `render()` HTML.
8. **Guards belong on the class**, not as the only child of layout `render()`. `<sw-link>` / `<sw-redirect>` are leaf tags.

```javascript title:Navigate to routes
import { navigate, replace, reset, wipeTo, goBack } from 'switch-framework';

navigate('home');
navigate('home/electronics');
navigate('login');
navigate('(tabs)');
navigate('docs', { id: 'introduction' });
replace('login');
wipeTo('login');
goBack();
reset('home');
reset('*');
```

`navigate` and `replace` also accept a layout `screenName`. The router resolves it to `initialTab` / `initialScreen` (recursively) before matching a leaf route. Failed `static guard`s call `wipeTo` to the layout/screen `redirect`.

### Link and Redirect

Import `{ Link, Redirect }` from `switch-framework` or `switch-framework/router` (defines `<sw-link>` / `<sw-redirect>`). Use the tags in `render()`. They are not the route table.

| | `<sw-link>` | `<sw-redirect>` |
|---|---|---|
| When | Click (Cmd/Ctrl-click uses the real `<a href>`) | `onMount` once |
| Children | Yes (`<slot>`) | None (`display: none`) |
| History | `navigate` (push); `replace` optional | **`replace` by default** |

Props (attribute **or** `data="${createProps({ ... })}"`): `href`, `params`, `replace`, `lockHistory`, `wipeHistory`, `target`, `newTab`. `href` is a leaf, path, layout id (`(tabs)`), or `settings?t=account-management`. Extra keys that are not path params become the query string.

`target="_blank"` (or `target="new"`, or the `new-tab` attribute) opens the public path in a **new browser tab** and does not call `navigate`. Cmd/Ctrl-click still uses the real `<a href>`.

```javascript title:Tags in render()
import { createProps } from 'switch-framework';

render() {
  return `
    <sw-link href="settings?t=account-management">Account</sw-link>
    <sw-link href="help/privacy" target="_blank">Privacy and data</sw-link>
    <sw-redirect data="${createProps({ href: '(tabs)', replace: true })}"></sw-redirect>
  `;
}
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

- `navigate(route, params)` – Go to a leaf `screenName`, path, or layout id; push browser history
- `goBack()` – Go back in browser history
- `redirect(route, params)` – Same as navigate (alias)
- `replace(route, params)` – Replace current history entry
- `wipeTo(route, params)` – Clear keep-alive + app route history, `replace` + lock so Back cannot reopen a protected leaf
- `reset(route?, params)` – Drop cached screen/layout instances. Omit route or pass `'*'` to clear all; otherwise remount that route
- `Link` / `Redirect` – Custom elements `<sw-link>` / `<sw-redirect>`
- `useParams()` – Get path params (e.g. `{ id: '42' }`)
- `useSearchParams()` – Get query params (e.g. `{ name: 'Jane' }`)
- `getActivePath()` – Full current URL
- `getActiveRoute()` – Current **leaf** route key (no leading `/`)
- `isScreenActive(screenName)` – Whether a screen name matches the current route
- `useScreenFocus(fn)` – Run `fn` only while this screen is the active leaf (call from `effects()`)
- `useRouteChangesSubscriber(callback)` – Subscribe to route changes
