## Layouts

Switch Framework uses two layout types: **StackLayout** for push/pop navigation and **TabLayout** for tabbed views.

Screens do **not** need `static layout`. Register them in the correct layout array and the framework assigns `stack` or `tabs` automatically. You can still set `static layout = 'stack'` or `'tabs'` explicitly if you want — it must match where the screen is registered.

### StackLayout

Stack screens render one at a time. Use for: landing pages, auth, intro, full-page flows.

```javascript title:app/_layout.js
import { StackLayout, createState } from 'switch-framework';
import { MyTabsLayout } from './(tabs)/_layout.js';
import { IndexScreen } from './index.js';
import { NotFoundScreen } from './+not-found.js';

export class MyStackLayout extends StackLayout {
  static stackScreens = [IndexScreen, NotFoundScreen];
  static tabsLayout = MyTabsLayout;
  static initialRoute = 'index';

  static async init({ renderSplashscreen }) {
    renderSplashscreen('my-splash');
    createState('user', null);
    return { splash: 'my-splash', initialRoute: 'index' };
  }
}
```

Load this file from `index.html` — the framework auto-starts when it finds your `StackLayout` subclass:

```html title:index.html
<sw-app-initial></sw-app-initial>
<script type="module" src="/app/_layout.js"></script>
```

### TabLayout

Tab screens share a tab bar and content area. Register screens in `static screens` and define tab bar items in `static tabs`.

```javascript title:app/(tabs)/_layout.js
import { TabLayout } from 'switch-framework';
import { HomeScreen } from './home/index.js';
import { HomeCategoryScreen } from './home/[id].js';
import { ExploreScreen } from './explore/index.js';

export class MyTabsLayout extends TabLayout {
  static tag = 'my-tabs-layout';
  static initialTab = 'home';

  static tabs = [
    {
      name: 'home',
      title: 'Home',
      icon: 'home',
      path: '/home',
      screen: 'my-home-screen',
      match: ['home']
    },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'compass',
      path: '/explore',
      screen: 'my-explore-screen',
      match: ['explore']
    }
  ];

  static screens = [
    HomeScreen,          // /home
    HomeCategoryScreen,  // /home/:id
    ExploreScreen
  ];
}
```

### Screen config (minimal)

```javascript title:Stack screen — registered in stackScreens
export class LoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static title = 'Login';
  static tag = 'my-login-screen';
  // static layout = 'stack';  // optional — inferred from stackScreens
}
```

```javascript title:Tab screen — registered in TabLayout.screens
export class ExploreScreen extends SwitchComponent {
  static screenName = 'explore';
  static path = '/explore';
  static title = 'Explore';
  static tag = 'my-explore-screen';
  // static layout = 'tabs';   // optional — inferred from TabLayout.screens
}
```

### Same URL prefix, two routes

For `/home` and `/home/:id`, use two screens with distinct `screenName` values (same pattern as `boards` and `boards/:id`):

```params-table
{"headers":["screenName","path","Registered in"],"htmlColumns":[0,1,2],"rows":[["<code>home</code>","<code>/home</code>","<code>TabLayout.screens</code>"],["<code>home/:id</code>","<code>/home/:id</code>","<code>TabLayout.screens</code>"]]}
```

Add the route prefix to the tab's `match` array: `match: ['home']`. Give `/home` and `/home/:id` **different `static tag` values** so each custom element is its own class.

### Tab config reference

Each item in `static tabs`:

```params-table
{"headers":["Field","Purpose"],"htmlColumns":[0,1],"rows":[["<code>name</code>","Tab identifier"],["<code>title</code>","Label (optional)"],["<code>icon</code>","Icon name"],["<code>path</code>","Default path when tab is tapped"],["<code>screen</code>","Custom element tag for the tab icon highlight"],["<code>match</code>","Route prefixes owned by this tab"]]}
```

### StackLayout – Advanced Usage

StackLayout supports custom `render()` and `styleSheet()` for global shells and popups.

> **Key Concept:** Your screens render inside the tab/stack content container. Content inside a `data-popups` container is extracted to the app shell and persists across layout switches.

```javascript title:StackLayout with Custom Render & Styles
export class MyStackLayout extends StackLayout {
  static tag = 'my-stack-layout';
  static stackScreens = [HomeScreen];
  static tabsLayout = MyTabsLayout;

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

### StackLayout API Reference

- `static stackScreens` — Array of stack screen classes
- `static tabsLayout` — TabLayout class for tab routes
- `static splash` — Splash screen tag
- `static initialRoute` — Starting route key
- `static async init()` — Create state, show splash, return `{ initialRoute }`
- `render()` / `styleSheet()` — Optional custom shell HTML/CSS

### TabLayout API Reference

- `static screens` — Array of tab screen classes
- `static tabs` — Tab bar configuration
- `static initialTab` — Default active tab name
- `static options` — Tab bar styling options
- `getContentContainer()` — Where routed screens render (override if needed)

### globalStates – static app data

`globalStates` holds navigation helpers and layout metadata: `navigate`, `go_back`, `tabsLayout`, `activeRoute`, `routeParams`, `searchParams`.

```javascript title:globalStates
globalStates.getState('activeRoute');
globalStates.getState('routeParams');
globalStates.getState('navigate');
globalStates.setState({ key: value });
```
