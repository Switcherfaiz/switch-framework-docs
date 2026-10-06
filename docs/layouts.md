## Layouts

Switch Framework has three layout classes:

- **RootLayout** — app boot + the root stack. One per app, in `app/_layout.js`.
- **TabLayout** — tab bar + a nested stack of tab screens.
- **StackLayout** — a nested stack (profile → settings → about, and similar flows).

Layouts are **containers**. They do not own a URL. Leaf screens own `static path`. The address bar always shows a leaf path such as `/home` or `/settings`, never `/(tabs)` or `/profile-stack`.

Import `RootLayout`, `TabLayout`, and `StackLayout` from `switch-framework-router` — the same package as `navigate`, like `Stack` / `Tabs` from `expo-router`.

```javascript title:Current — layouts from switch-framework-router
import { RootLayout, TabLayout, StackLayout } from 'switch-framework-router';
```

Do **not** add `switch-framework-router` to `switchFramework.imports`. The CLI installs it on the **0.3.0** line next to `switch-framework`.

> [!DEPRECATED]
> In **0.3.x** these still work. Prefer `switch-framework-router`. The core barrel re-exports will be **removed in the next version**.

```javascript title:Deprecated — still works in 0.3.x
import { RootLayout, TabLayout, StackLayout } from 'switch-framework';
import { RootLayout } from 'switch-framework/router';
```

Screens do **not** need `static layout`. Register them in the correct layout `screens` / `stackScreens` array and the framework assigns `stack` or `tabs`. You can still set `static layout` explicitly — it must match where the screen is registered.

> [!TIP]
> Prefer **RootLayout** for `app/_layout.js`. Auto-boot looks for a RootLayout subclass first, then a StackLayout subclass. Never nest RootLayout under Stack or Tabs.

### The simple tree

Put a layout **class** in a parent `screens` list to nest a navigator. That is the Expo-style `<Stack.Screen name="(tabs)" />` equivalent — there is no extra XML, and you do not scan folders.

```javascript title:app/_layout.js
import { RootLayout } from 'switch-framework-router';
import { MyTabsLayout } from './(tabs)/_layout.js';
import { IndexScreen } from './index.js';
import { LoginScreen } from './login/index.js';
import { NotFoundScreen } from './+not-found.js';

export class MyRootLayout extends RootLayout {
  static tag = 'my-root-layout';
  static screens = [MyTabsLayout, IndexScreen, LoginScreen, NotFoundScreen];
  static tabsLayout = MyTabsLayout; // optional sugar; also listed in screens
  static splash = 'my-splash';
  static initialScreen = 'index';

  static async init({ renderSplashscreen }) {
    renderSplashscreen('my-splash');
    return { splash: 'my-splash', initialRoute: 'index' };
  }
}
```

Load this file from `index.html` — the framework auto-starts when it finds your RootLayout (or StackLayout) subclass:

```html title:index.html
<sw-app-initial></sw-app-initial>
<script type="module" src="/app/_layout.js"></script>
```

Auth, intro, and 404 stay **siblings of the tabs layout** on the root stack. Opening `/login` hides the tab bar because the tabs navigator is not in that route's layout chain.

### TabLayout

Tab screens share a tab bar. Register **leaf screens and nested stacks** in `static screens`, and define tab bar items in `static tabs`. Give the layout a `screenName` (default `'(tabs)'`) so `navigate('(tabs)')` can resolve to the initial tab's leaf path.

```javascript title:app/(tabs)/_layout.js
import { TabLayout } from 'switch-framework-router';
import { HomeScreen } from './home/index.js';
import { HomeCategoryScreen } from './home/[id].js';
import { ExploreScreen } from './explore/index.js';
import { ProfileStack } from './profile/_layout.js';

export class MyTabsLayout extends TabLayout {
  static tag = 'my-tabs-layout';
  static screenName = '(tabs)';
  static initialTab = 'home';

  static tabs = [
    {
      name: 'home',
      title: 'Home',
      icon: 'home',
      path: '/home',
      screen: 'my-home-screen',
      match: ['pin']
    },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'compass',
      path: '/explore',
      screen: 'my-explore-screen'
    },
    {
      name: 'profile',
      title: 'Profile',
      icon: 'user',
      path: '/profile',
      screen: 'my-profile-screen'
    }
  ];

  static screens = [
    HomeScreen,
    HomeCategoryScreen,
    ExploreScreen,
    ProfileStack
  ];
}
```

`render()` is **chrome only** (header, tab bar, popups). Do not build routes from HTML. Put a `.tabcontainer` or `#content` in the markup and the router injects screens there. If you omit both, the framework adds a `[data-sw-screens]` outlet.

```javascript title:Optional TabLayout chrome
render() {
  return `
    <div class="tabbar"><my-tab-bar></my-tab-bar></div>
    <div class="tabcontainer"></div>
  `;
}
```

Keep `.tabcontainer` in place across rerenders (do not move that node). Nested screens stay as hide/show children inside it.

### Nested StackLayout

A stack inside tabs keeps the tab bar while you push profile → settings → about.

Layouts use `screenName` + `initialScreen` (or `initialTab` on tabs). **Do not set `static path` on a layout.**

```javascript title:app/(tabs)/profile/_layout.js
import { StackLayout } from 'switch-framework-router';
import { ProfileScreen } from './index.js';
import { SettingsScreen } from '../settings/index.js';
import { AboutScreen } from '../../about/index.js';

export class ProfileStack extends StackLayout {
  static tag = 'my-profile-stack';
  static screenName = 'profile-stack';
  static initialScreen = 'profile';
  static headerShown = true;
  static screens = [ProfileScreen, SettingsScreen, AboutScreen];
}
```

Add `ProfileStack` to the parent TabLayout `screens` list. Tab `match` is optional for nested leaves: the framework unions `match` with every leaf under the child that belongs to that tab (`name`, `initialScreen`, or a leaf named like the tab). Keep an explicit `match` only for extras that are not under that child (for example `pin` on home).

Set `static headerShown = true` on a nested `StackLayout` to paint a Back button and the active leaf `title`. Back is hidden on that stack’s `initialScreen`. A custom `render()` still replaces this chrome.

### Screen config (minimal)

```javascript title:Leaf screen — registered in a layout screens list
export class LoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static title = 'Login';
  static tag = 'my-login-screen';
}
```

```javascript title:Tab leaf — registered in TabLayout.screens
export class ExploreScreen extends SwitchComponent {
  static screenName = 'explore';
  static path = '/explore';
  static title = 'Explore';
  static tag = 'my-explore-screen';
}
```

### Same URL prefix, two routes

For `/home` and `/home/:id`, use two screens with distinct `screenName` values (same pattern as `boards` and `boards/:id`):

```params-table
{"headers":["screenName","path","Registered in"],"htmlColumns":[0,1,2],"rows":[["<code>home</code>","<code>/home</code>","Parent layout <code>screens</code>"],["<code>home/:id</code>","<code>/home/:id</code>","Parent layout <code>screens</code>"]]}
```

Add the route prefix to the tab's `match` array: `match: ['home']`. Give `/home` and `/home/:id` **different `static tag` values** so each custom element is its own class.

### How to navigate

Always navigate to a **leaf** `screenName` or a **layout `screenName`**. Layout ids resolve to that layout's initial child path — they never become `/(tabs)` in the address bar.

```javascript title:Navigate to leaves and layout ids
import { navigate, replace, reset } from 'switch-framework-router';

navigate('home');              // /home
navigate('settings');          // /settings (tab bar stays if nested under tabs)
navigate('login');             // /login (root sibling — tabs hide)
navigate('(tabs)');            // same as the tabs layout's initialTab leaf (usually /home)
navigate('profile-stack');     // same as that stack's initialScreen leaf (usually /profile)
replace('login');              // replace history entry
reset('home');                 // drop the cached home instance, then go there
reset('*');                    // drop every cached screen/layout
```

> [!DEPRECATED]
> `import { navigate, replace, reset } from 'switch-framework'` still works in 0.3.x. Move it to `switch-framework-router` before the next version.

```javascript title:Deprecated — navigate from switch-framework
import { navigate, replace, reset } from 'switch-framework';

navigate('home');
navigate('settings');
navigate('login');
navigate('(tabs)');
navigate('profile-stack');
replace('login');
reset('home');
reset('*');
```

```params-table
{"headers":["You call","Address bar","What mounts"],"htmlColumns":[0,1,2],"rows":[["<code>navigate('home')</code>","<code>/home</code>","Root then tabs then home"],["<code>navigate('settings')</code>","<code>/settings</code>","Root then tabs then profile stack then settings"],["<code>navigate('(tabs)')</code>","Initial tab path, e.g. <code>/home</code>","Same chain as that leaf"],["<code>navigate('login')</code>","<code>/login</code>","Root then login (tabs hidden)"]]}
```

Deep links work the same way: open `/settings` and the router walks the leaf's `layoutChain` (root → tabs → profile stack) with hide/show keep-alive.

> [!NOTE]
> One browser history. Nested navigators do not get their own history stacks. `goBack()` is the browser back button.

### Keep-alive

Leaving a screen **hides** it (`inert`, `aria-hidden`). Coming back **shows** the same instance and restores scroll. `reset(route)` destroys that cache entry so the next visit remounts.

`useScreenFocus` from [[Hooks|docs/hooks]] still means “this leaf is the active route” — not merely mounted.

### Tab config reference

### Guards (`static guard`)

Guards run at navigate / replace / popstate / start, **before** the leaf mounts. Put them on a layout to cover every nested screen, or on a leaf to override.

`static guard` **must be a function** (not `!!getState('user')` at class load). Truthy return allows the route. Falsy return `replace`s to `static redirect` (default `'login'`), wipes keep-alive, and locks history so Back cannot reopen the protected tree.

```javascript title:Protect tabs; bounce signed-in users off login
import { TabLayout } from 'switch-framework-router';
import { SwitchComponent, getState } from 'switch-framework';

export class MyTabsLayout extends TabLayout {
  static redirect = 'login';
  static guard = () => getState('user');
}

export class LoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static redirect = '(tabs)';
  static guard = () => !getState('user');
}
```

`static protected = true` with no `guard` means `() => getState('user')`. `protected = false` is public.

Do **not** implement auth by returning only `<sw-redirect>` from a layout `render()` — that fights the outlet. Use tags in **leaf** `render()` (`<sw-link>`, `<sw-redirect>`); they keep their own element style.

On logout, clear `user` then `wipeTo('login')` so every protected keep-alive instance is destroyed. The browser cannot delete old history entries; lock + wipe is the web equivalent.

### Tab `match` (inferred)

```params-table
{"headers":["Field","Purpose"],"htmlColumns":[0,1],"rows":[["<code>name</code>","Tab identifier (also used as <code>initialTab</code>)"],["<code>title</code>","Label (optional)"],["<code>icon</code>","Icon name"],["<code>path</code>","Leaf path when the tab is tapped"],["<code>screen</code>","Custom element tag used to highlight the tab"],["<code>match</code>","Optional extras. Unioned with the tab name and every leaf under the child that belongs to this tab"]]}
```

### Custom chrome (`render` / `styleSheet`)

`render()` paints the navigator chrome. Screens go into `.tabcontainer`, `#content`, or the built-in `[data-sw-screens]` host.

> [!NOTE]
> **Key Concept:** Routed screens live in the layout outlet. Popup markup in a `.popups` / `data-popups` region is your chrome; keep it in the layout `render()`, not inside a leaf screen, if it should persist across those screens.

```javascript title:RootLayout with optional chrome
export class MyRootLayout extends RootLayout {
  static tag = 'my-root-layout';
  static screens = [MyTabsLayout, LoginScreen];

  render() {
    return `
      <div class="app-shell">
        <div id="content" class="content-area"></div>
        <div class="popups" data-popups>
          <my-search-modal></my-search-modal>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `<style>:host { position: fixed; inset: 0; } .content-area { flex: 1; overflow: auto; }</style>`;
  }
}
```

### RootLayout API

- `static isRootLayout` — `true` (do not nest this class)
- `static screens` — Leaf screens **and** nested layout classes
- `static stackScreens` — Extra stack children (merged with `screens`)
- `static tabsLayout` — TabLayout class (also treated as a child)
- `static splash` — Splash screen tag
- `static initialScreen` / `static initialRoute` — Starting **leaf** route key
- `static async init()` — Create state, show splash, return `{ initialRoute }`
- `render()` / `styleSheet()` — Optional root chrome
- Auto-boot finds this subclass in `app/_layout.js` (no default export)

`StackLayout` still works as a root for older apps. New apps should extend **RootLayout**.

### StackLayout API (nested or legacy root)

- `static screenName` — Layout id for `navigate('profile-stack')` (not a URL)
- `static screens` / `static stackScreens` — Children (leaves or nested layouts)
- `static initialScreen` / `static initialRoute` — Initial **leaf** inside this stack
- `static headerShown` — `true` paints Back + title chrome (hidden Back on `initialScreen`)
- `static guard` / `static redirect` / `static protected` — Auth at navigate time (see Guards)
- `static splash` — Used only when this class is the boot root
- `getContentContainer()` — Outlet: `.tabcontainer`, then `#content`, then `[data-sw-screens]`
- `render()` / `styleSheet()` — Chrome only

### TabLayout API

- `static screenName` — Layout id (default `'(tabs)'`)
- `static screens` — Tab leaves **and** nested stacks
- `static tabs` — Tab bar configuration
- `static initialTab` — Default tab `name`
- `static guard` / `static redirect` / `static protected` — Same as StackLayout; covers every tab leaf
- `static options` — Tab bar styling options
- `getContentContainer()` — Same outlet rules as StackLayout

Leaf screens may set `static inAnimation` / `outAnimation` / `navigatingAnimation`. The default is **none** — screens appear and hide with no transition unless you opt in. See [[Animations|docs/animations]].

### globalStates – static app data

`globalStates` holds navigation helpers and layout metadata: `navigate`, `go_back`, `replace`, `reset`, `wipeTo`, `tabsLayout`, `activeRoute`, `routeParams`, `searchParams`.

```javascript title:globalStates
globalStates.getState('activeRoute');
globalStates.getState('routeParams');
globalStates.getState('navigate');
globalStates.getState('reset');
globalStates.setState({ key: value });
```
