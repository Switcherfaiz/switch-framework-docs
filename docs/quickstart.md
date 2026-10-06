## Quick Start

Get a Switch Framework app running in minutes.

> [!TIP]
> The CLI is the fastest path. Run `npx create-switch-framework-app my-app`, then `cd my-app` and `npm run dev`. See [[CLI|docs/cli]] for flags (`--app-type`, `--port`, `--yes`).

### 1. Create a project

```bash title:bash
npx create-switch-framework-app my-app
cd my-app
npm run dev
```

Or clone the test app structure manually.

### 2. index.html

```html title:index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>
  <link rel="stylesheet" href="/assets/styles/styles.css">
</head>
<body>
  <sw-app-initial></sw-app-initial>
  <script type="module" src="/app/_layout.js"></script>
</body>
</html>
```

No `startApp()` — the framework auto-boots when it finds your `RootLayout` (or `StackLayout`).

### 3. Root layout

```javascript title:app/_layout.js
import { RootLayout } from 'switch-framework-router';
import { IndexScreen } from './index.js';
import { MyTabsLayout } from './(tabs)/_layout.js';

export class MyRootLayout extends RootLayout {
  static screens = [MyTabsLayout, IndexScreen];
  static tabsLayout = MyTabsLayout;
  static initialScreen = 'index';
}
```

### 4. Tab layout

```javascript title:app/(tabs)/_layout.js
import { TabLayout } from 'switch-framework-router';
import { HomeScreen } from './home/index.js';

export class MyTabsLayout extends TabLayout {
  static screens = [HomeScreen];
  static tabs = [
    { name: 'home', title: 'Home', icon: 'home', path: '/home', screen: 'my-home-screen', match: ['home'] }
  ];
}
```

### 5. A screen

```javascript title:app/(tabs)/home/index.js
import { SwitchComponent } from 'switch-framework';

export class HomeScreen extends SwitchComponent {
  static screenName = 'home';
  static path = '/home';
  static title = 'Home';
  static tag = 'my-home-screen';

  render() {
    return `<div>Hello!</div>`;
  }
}
```

That's it — four static fields on the screen, register it in a layout `screens` list, and the framework handles routing and nested layout switching. Navigate with leaf names (`navigate('home')`) or a layout id (`navigate('(tabs)')` → that layout's initial leaf path). See [[Layouts|docs/layouts]] and [[Router|docs/router]].

### What you don't need

- `startApp()` in user code
- `export default layout.getAppLayout()`

### Optional

- `static layout = 'tabs'|'stack'` — only if you want it explicit; otherwise inferred from which layout `screens` list you register in
