## Quick Start

Here's the mental model: you have a **layout** (stack + optional tabs), **screens** (routes mapped to custom elements), and an **init** phase where you load data and show a splash. Once you get this, you've got 80% of the framework.

### Folder structure

```text title:Project structure
my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── index.js            # startApp(layout)
├── app/
│   ├── _layout.js      # StackLayout with static config
│   ├── index.js        # Home screen
│   └── (tabs)/
│       ├── _layout.js  # TabLayout + tab screens
│       └── screens/    # Doc screens
└── components/
```

### Default files

**index.js** – Bootstrap the app:

```javascript title:index.js
import { startApp } from 'switch-framework';
import layout from './app/_layout.js';

startApp(layout);
```

**app/_layout.js** – Stack layout with static config:

```javascript title:app/_layout.js
import { StackLayout } from 'switch-framework';
import SwIndexScreen from './index.js';
import SwUserNotFoundScreen from './+not-found.js';
import SwTabsLayout from './(tabs)/_layout.js';

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, SwUserNotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    await new Promise(r => setTimeout(r, 2000));
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();
```

### Layout parameters

**StackLayout** uses static config. Pass screen *classes* (not instances) to `stackScreens` and `tabsLayout`. The framework auto-registers them via `getScreenConfig()` and `getLayoutConfig()`.

**StackLayout statics:** `stackScreens` (array of screen classes), `tabsLayout` (TabLayout class), `splash`, `initialRoute`, `init`

**TabLayout statics:** `screens` (array of screen classes), `tabs`, `initialTab`, `options`. Screens must have `layout: 'tabs'` and a `screenName` matching a tab's `match` array.

**init** – async function run before app mounts. Receives `{ globalStates, renderSplashscreen }`. Return `{ splash, initialRoute }`. Call `renderSplashscreen('sw-starter-splash')` to show splash; the framework registers `tabsLayout` automatically.

### Tab layout element

Your tabs layout custom element (e.g. `sw-tabs-layout`) must implement `getContentContainer()` returning the element where tab screens render. Use class `tabcontainer` for that element. The framework injects screen content into it.

```javascript title:(tabs)/_layout.js
getContentContainer() {
  return this.shadowRoot.querySelector('.tabcontainer');
}

render() {
  return `
    <div class="layout">
      <nav class="tabbar"><!-- tab bar --></nav>
      <div class="tabcontainer"></div>
    </div>
  `;
}
```

### Splash screen & init

`init` runs before the app mounts. Call `renderSplashscreen('sw-starter-splash')` to show a splash. Do async work (e.g. auth), then `globalStates.setState({ tabsLayout })`. Return `{ splash, initialRoute }`.
