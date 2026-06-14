## Layouts

Switch Framework uses two layout types: **StackLayout** for push/pop navigation (like modals or full-screen flows) and **TabLayout** for tabbed views (like docs with a sidebar).

### StackLayout

Stack screens are rendered one at a time. Navigating to a new route pushes it onto the stack; `goBack()` pops. Use for: home, auth, modals, full-page flows.

```javascript title:app/_layout.js
import { StackLayout, createState } from 'switch-framework';

export class SwStackLayout extends StackLayout {
  static stackScreens = [SwIndexScreen, SwChangelogsScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-splash');
    createState([], 'patient-list');
    createState(0, 'docs-helpful-count');
    createState(false, 'search-open');
    await new Promise((r) => setTimeout(r, 2000));
    return { splash: 'sw-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();
```

### StackLayout – Advanced Usage

StackLayout supports custom `render()` and `styleSheet()` methods for building complex app shells. Use this when you need global UI elements (headers, nav bars) that persist across screen changes, or global popups (search modals, toasts) that should stay visible even when switching to tabs layout.

> **Key Concept:** The StackLayout's `render()` creates the container structure. Your screens are injected into the element with `id="content"`. Any content inside a container with `data-popups` attribute is automatically extracted to the app shell level and stays visible across layout switches.

```javascript title:StackLayout with Custom Render & Styles
import { StackLayout, createState, registerComponents } from 'switch-framework';

import { SwSearchModal } from '/components/SwSearchModal.js';
import { SwToastContainer } from '/components/SwToastContainer.js';

registerComponents([SwSearchModal, SwToastContainer]);

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [HomeScreen, ProfileScreen];
  static tabsLayout = SwTabsLayout;
  static initialRoute = 'home';

  render() {
    return `
      <div class="app-shell">
        <sw-global-header></sw-global-header>
        <div id="content" class="content-area"></div>
        <sw-bottom-nav></sw-bottom-nav>
        <div class="popups" data-popups>
          <sw-search-modal></sw-search-modal>
          <sw-toast-container></sw-toast-container>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `<style>:host { position: fixed; inset: 0; } .content-area { flex: 1; overflow: auto; }</style>`;
  }

  static async init({ renderSplashscreen }) {
    renderSplashscreen('sw-splash');
    await new Promise((r) => setTimeout(r, 1500));
    return { splash: 'sw-splash' };
  }
}

export default SwStackLayout.getAppLayout();
```

### Global Popups in StackLayout

Any content inside a container with `data-popups` attribute is automatically extracted to the app shell level. These popups (search modals, bottom sheets, toast notifications) remain visible even when you navigate to tabs layout. No additional configuration needed – just place your popup components inside the `data-popups` container.

- Add `data-popups` attribute to your popups container in `render()`
- Place any popup components inside – all contents are automatically extracted
- Popups are moved to app shell on first stack render and persist across layouts
- Use `pointer-events: none` on container, `pointer-events: auto` on children

```javascript title:Global Popups that Persist Across Layouts
export class SwStackLayout extends StackLayout {
  render() {
    return `
      <div class="stack">
        <div id="content" class="stack-content"></div>
        <div class="popups" data-popups>
          <sw-search-modal></sw-search-modal>
          <sw-icons-bottom-sheet></sw-icons-bottom-sheet>
        </div>
      </div>
    `;
  }
}
```

### StackLayout API Reference

- `static tag` - Custom element tag name (required for custom render)
- `static stackScreens` - Array of screen classes for stack navigation
- `static tabsLayout` - TabLayout class to switch to for tab routes
- `static splash` - Tag name of splash screen component
- `static initialRoute` - Starting route when app launches
- `render()` - Returns HTML structure with `#content` container
- `styleSheet()` - Returns CSS styles for the layout
- `static async init()` - App initialization, create states, show splash
- `getAppLayout()` - Returns layout config for framework registration

### globalStates – static app data

`globalStates` holds static data that stays constant across the app – things like `navigate`, `go_back`, `tabsLayout`, `activeRoute`, `routeParams`, `searchParams`. Use `getState(key)` to read and `setState(obj)` to merge updates. This is separate from `createState`/`updateState` (SwitchStateManager) which you use for reactive app state.

```javascript title:globalStates – static app data
globalStates.getState('activeRoute');
globalStates.getState('routeParams');
globalStates.getState('searchParams');
globalStates.getState('navigate');
globalStates.setState({ key: value });
```

### TabLayout

Tab screens share a container. The active tab is determined by the current route. Use for: docs, dashboards, multi-section apps.

```javascript title:TabLayout
export class SwTabsLayout extends TabLayout {
  static screens = [SwDocsIntroScreen, SwDocsStateScreen];
  static tabs = [{ name: 'docs', path: '/docs/:id', match: ['docs'] }];
  static initialTab = 'docs';
}
```
