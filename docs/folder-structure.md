# Folder Structure

A typical Switch Framework app follows a simple folder structure. The `app/` directory holds your layouts and screens; `components/` holds shared UI.

> [!TIP]
> Keep screens as `app/.../index.js` with a `SwitchComponent` subclass. Shared UI lives in `components/` and is registered with `registerComponents([...])` from your layout `init` or module top-level.

## Web app structure

```text title:Web app structure
my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── server.js           # Express server (serves static + switch-framework)
├── app/
│   ├── _layout.js      # RootLayout — framework auto-starts from here
│   ├── index.js        # Root stack screen (landing / redirect)
│   ├── +not-found.js   # 404 screen
│   ├── login/
│   │   └── index.js    # Root stack screen (tabs hidden)
│   └── (tabs)/
│       ├── _layout.js  # TabLayout — screens + tab bar config
│       ├── home/
│       │   ├── index.js    # Tab screen — /home
│       │   └── [id].js     # Tab screen — /home/:id
│       ├── explore/
│       │   └── index.js    # Tab screen — /explore
│       └── profile/
│           ├── _layout.js  # Nested StackLayout — profile / settings / about
│           └── index.js    # Leaf — /profile
├── components/         # Reusable components
└── assets/             # Styles, fonts, icons
```

## index.html

The entry HTML only needs `<sw-app-initial>` and a script that loads your root layout. **No `startApp()` call** — the framework detects your `RootLayout` (or `StackLayout`) subclass and boots automatically.

```html title:index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Switch Framework App</title>
  <link rel="stylesheet" href="/assets/styles/styles.css">
  <link rel="stylesheet" href="/switch-framework-icons/style.css">
</head>
<body>
  <sw-app-initial></sw-app-initial>
  <script type="module" src="/app/_layout.js"></script>
</body>
</html>
```

## Auto boot

When `index.html` loads `app/_layout.js`:

1. The framework sees `<sw-app-initial>` in the page
2. It finds your `RootLayout` subclass in that file (or a `StackLayout` if you have no RootLayout)
3. It calls `initTheme()`, registers screens, and starts routing

You never call `startApp()` yourself unless you use a custom entry setup.

## Screen registration

Screens are registered **only in layout files**, not on the screen class itself:

```params-table
{"headers":["Where","What you pass","Layout used"],"htmlColumns":[0,1,2],"rows":[["<code>RootLayout.static screens</code>","Leaf screens and nested layout classes","Root stack, plus nested kinds"],["<code>TabLayout.static screens</code>","Tab leaves and nested stacks","<code>tabs</code> for leaves under tabs"],["<code>StackLayout.static screens</code>","Nested stack leaves","Same kind as the parent chain, unless under tabs"]]}
```

```javascript title:app/_layout.js
import { RootLayout } from 'switch-framework-router';
import 'switch-framework-icons';

export class MyRootLayout extends RootLayout {
  static screens = [MyTabsLayout, IndexScreen, LoginScreen, NotFoundScreen];
  static tabsLayout = MyTabsLayout;
  static initialScreen = 'index';
}
```

```javascript title:app/(tabs)/_layout.js
export class MyTabsLayout extends TabLayout {
  static screens = [HomeScreen, HomeCategoryScreen, ExploreScreen];
  static tabs = [
    { name: 'home', path: '/home', screen: 'my-home-screen', match: ['home'] },
    { name: 'explore', path: '/explore', screen: 'my-explore-screen', match: ['explore'] }
  ];
}
```

## Screen config (on the screen class)

Each screen only needs route identity. **`static layout` is optional** — omit it and the framework infers from registration:

```params-table
{"headers":["Registered in","Layout used"],"htmlColumns":[0,1],"rows":[["<code>RootLayout.screens</code> (leaf, not under tabs)","<code>stack</code>"],["<code>TabLayout.screens</code> (or any layout under tabs)","<code>tabs</code>"]]}
```

If you set `static layout` explicitly, it must match where you register the screen.

```javascript title:app/(tabs)/home/index.js
export class HomeScreen extends SwitchComponent {
  static screenName = 'home';       // route key
  static path = '/home';            // URL path
  static title = 'Home';
  static tag = 'my-home-screen';    // custom element tag
}
```

```javascript title:app/(tabs)/home/[id].js
export class HomeCategoryScreen extends SwitchComponent {
  static screenName = 'home/:id';   // route key (same pattern as boards/:id)
  static path = '/home/:id';
  static title = 'Home';
  static tag = 'my-home-category-screen';
}
```

Layout (`stack` vs `tabs`) is inferred from which array you add the screen to. Two screens must not share `static tag`.

## App with a Mongo API

Keep `server.js` for the web app. Put Express + MongoDB in a sibling `backend/` folder with its own `server.js`, `routes/`, `middlewares/`, and `models/`.

```text title:Web app + API
my-app/
├── server.js              # Serves the UI (port 5173)
├── backend/
│   ├── server.js          # Express API (port 4000)
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── uploads/
├── app/
└── components/
```

## Electron app structure

Electron apps add `main.js`, `preload.js`, and an `electron/` folder. The server runs first; Electron's BrowserWindow loads `http://localhost:PORT`.

```text title:Electron app structure
my-app/
├── index.html          # Same as web — <sw-app-initial> + app/_layout.js
├── main.js             # Electron entry
├── preload.js
├── server.js
├── electron/
│   ├── main.js
│   └── preload.js
├── app/
│   ├── _layout.js
│   └── (tabs)/
│       └── _layout.js
├── components/
└── assets/
```

## Key files

- `index.html` — `<sw-app-initial>` + `<script src="/app/_layout.js">`
- `app/_layout.js` — `RootLayout`: `screens`, `tabsLayout`, `init`
- `app/(tabs)/_layout.js` — `TabLayout`: `screens`, `tabs`, `screenName`
- Nested `app/.../_layout.js` — `StackLayout` / extra `TabLayout` with `screenName` (no `path`)
- Screen files — `screenName`, `path`, `title`, `tag` only
