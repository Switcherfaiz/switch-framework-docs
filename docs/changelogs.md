# Changelogs

Release notes and version history for Switch Framework. Each version includes new features, improvements, and bug fixes.


## v0.2.9 – September 2, 2026

**New Hooks (React-style simplified API)**

Three new hooks that replace the `createState` + `static { this.useState() }` + `getState` + `updateState` ceremony for most cases. The old API is fully preserved and will not be removed — these are additions.

- **`useState(initialValue)`** — local component state. Returns `[value, setter]`. The setter rerenders only this instance. No global key needed. Slots are stable across rerenders — initial value is used only on the first render; every subsequent render reads back whatever the setter last wrote. Calling one setter does not reset other local states.

- **`useShared(key, defaultValue?)`** — global shared state. Returns `[value, setter]`. Subscribes this component to the key so it rerenders when the value changes from anywhere. **Idempotent:** if the key does not exist yet it is created automatically with `defaultValue`, so no separate `createState` is needed for feature-level states. First caller with a key wins; later callers with a different default simply use the already-created value.

- **`onState(key, callback)`** — subscribe to a global key and run a callback on each change without triggering `render()`. Use for CSS animations, badge counts, or any DOM patch where rebuilding `innerHTML` would discard state. Call from `onMount()`. Subscriptions are deduped per key — the same key on every rerender updates the callback reference instead of stacking new listeners.

**Engine change**

- `_currentComponent` is now set to the active component **before** `render()` runs (previously it was set after). This is what enables calling `useState`, `useShared`, and `onState` directly inside `render()`.

**Deprecations** — still work, will not be removed in v0.x

- `static { this.useState('key') }` — superseded by `useShared(key, default)` in `render()`
- `useState('key', callbackFn)` — superseded by `onState(key, callbackFn)` in `onMount()`. `onState` deduplicates automatically; `addOnDestroy` is not required.

---

## v0.2.8 – August 21, 2026

**Features**

- [[Hooks|docs/hooks]] `useScreenFocus(fn)` – run a callback only while this screen is the active route (keep-alive safe). `home` matches `/home` only; `home/:id` matches `/home/travel`
- `isScreenActive(screenName)` router helper for the same matching rules
- Screen keep-alive navigation – stack/tab screens are hidden/shown instead of destroyed, and each screen has its own scroll slot so back-navigation restores position
- Unique `static tag` warning – if two classes share a tag, the console explains that the first class wins

**Improvements**

- `useEffect` now follows React-style hook slots: `[]` runs once per mount, deps re-run when keys change, including router keys on `globalStates`
- Hidden screens use `inert` + `aria-hidden` so they cannot be focused or clicked
- [[Router|docs/router]] and [[Layouts|docs/layouts]] docs require a unique tag per screen (`/home` vs `/home/:id`)

**Bug Fixes**

- Empty `useEffect([])` now runs on mount
- Shared overflow containers no longer reset scroll when returning to a previous screen


## v0.2.7 – August 1, 2026

**Features**

- [[Props|docs/data-flow/props]] management: `createProps(props)` encodes JSON-safe props for a child component's `data` attribute; the child reads them with `this.getProps()` — no manual `encodeData`/`decodeData` or `getAttribute` calls
- `SwitchComponent.getProps()` – built-in instance method that decodes the `data` attribute with per-attribute-value caching, so calling it in `render()`, `onMount()`, and event handlers costs nothing extra
- Props reactivity built into the base class – every `SwitchComponent` observes its `data` attribute and re-renders automatically when the parent replaces the encoded props (the attribute is never removed or modified by the framework)
- State-key props pattern for reusable [[Components|docs/components]] – pass parent-created state keys inside props (`valueState`, `onChangeState`, action states); the child resolves callbacks with `getState(key)` at event time, so parents can replace callbacks anytime
- Auto-boot by convention – when a page contains `<sw-app-initial>` and `/app/_layout.js` exports a `StackLayout` subclass (with no default export), the framework starts the app by itself: no `startApp()`, `initTheme()`, or `getAppLayout()` in user code, and `index.html` can point its module script directly at `/app/_layout.js`
- `StackLayout.startApp(registers)` static – boots the whole app from the layout class (theme init, self-registration of layout, tabs layout and all screens, then start)
- `registerComponent(Cls)` for component-level self-registration – call it at the bottom of the component's own file (requires `static tag`); screens that use a component simply import its file, keeping layout registration pools empty

**Improvements**

- `createProps` warns in the console when a prop value is a function – JSON encoding drops functions, so store callbacks in a state (`createState`/`updateState`) and pass the state-key string instead
- `hasAppStarted()` guard – manual `startApp()` boots and auto-boot never run twice; apps exporting a default layout config keep full manual control and are never auto-started
- Layouts already self-register through `getAppLayout()` (stack layout, tabs layout, and every screen) – combined with `registerComponent`, apps need no central registration lists at all

**Deprecations**

- `export default MyLayout.getAppLayout()` + manual `startApp(layout)` boot – still fully supported for apps that need custom boot order (like loading assets before start), but superseded by auto-boot for standard apps
- Manual `if (!customElements.get(tag)) customElements.define(tag, Cls)` guards in component files – use `registerComponent(Cls)` with a `static tag` instead
- Reading props manually with `decodeData(this.getAttribute('data'))` inside components – use `this.getProps()`
- Duplicating `static observedAttributes = ['data']` + `attributeChangedCallback` in every component for props reactivity – the `SwitchComponent` base class now handles it


## v0.2.6 – July 3, 2026


**Features**

- [[FlatList|docs/components/flatlist]] – React Native–style list component: vertical and horizontal scrolling, multi-column grids, infinite scroll via `onEndReached`, header/footer/separators, and state-driven updates through `dataState`, `horizontalState`, and `numColumnsState`
- FlatList imperative scroll APIs via `useRef`: `scrollToIndex`, `scrollToEnd`, `scrollToOffset`, and `scrollBy` — ideal for carousels and album rows
- FlatList styling scope alias — use `flatlist { }` in extended `styleSheet()` to target scroll area, scrollbar, and inner layout without calling `super.styleSheet()`
- [[ElectronTitleBar|docs/components/electron-titlebar]] – desktop window chrome for Electron apps with draggable region and minimize, maximize/restore, and close controls using Switch icons
- **React-style `useEffect`** – call `useEffect(callback, deps)` inside `effects()` (not `onMount`). Supports `[]` run-once, dependency arrays, cleanup returns, and **multiple `useEffect` calls** per component
- **`useScreenFocus`** router helper – fetch or refresh when a screen becomes active without putting loading/data keys in the effect deps (avoids infinite re-renders)
- Electron title bar **`${tag}-visible`** state — show or hide the bar from anywhere with `updateState`, or via ref methods `show()`, `hide()`, `setVisible()`, and `toggleVisible()`
- CLI docs note which **Electron version matches your installed Node.js** when building desktop apps

**Improvements**

- `SwitchComponent` now merges `styleSheet()` rules from the full inheritance chain automatically — extended FlatList and ElectronTitleBar classes only add their own rules
- State manager reports clearer duplicate `createState` errors with owner hints from the call stack
- Stack and tab shells reserve title bar height in Electron via `--electron-titlebar-h` so content no longer sits under window controls
- **Single title bar** in `sw-app-shell` — one default bar at the top for tabs and stack layouts (no duplicate chrome)
- `static useState` subscriptions run before the first render so loader/fetch UIs update reliably
- `useEffect` deps support router keys like `activeRoute` from `globalStates`
- FlatList and ElectronTitleBar docs with live preview examples; [[Hooks|docs/hooks]] docs expanded with `effects()`, fetch examples, and multiple `useEffect` usage
- CLI templates pin **`switch-framework@^0.2.6`** (`switch-framework-backend` unchanged at `^0.2.0`)

**Bug Fixes**

- Fixed state subscription rerenders — components now update reliably when watched keys change
- Fixed duplicate Electron title bars appearing at the same time
- Fixed title bar `hidden` / `display` not fully collapsing when visibility state is `false`
- Fixed docs search (`Ctrl+K`) state not updating correctly after keyboard shortcut
- Fixed mobile docs layout — main content and loading spinner no longer offset to the right when sidebars collapse
- Fixed live code preview shell — import map, icon stylesheet, and component mounting for FlatList and other Switch component examples
- Fixed stack/tabs shell pointer-events and z-index layering with sidebars and tab content

## v0.2.5 – April 8, 2026

**Features**

- [[StackLayout|docs/layouts]] now supports `static render()` and `static styleSheet()` for rendering popups or elements that come with stackLayout without waiting for the initial screen — good for global popups and toasts around stack layout
- [[FlatList|docs/components/flatlist]] improvements: optimized scroll performance, better grid layout calculations, and enhanced state-driven re-rendering

**Improvements**

- Updated [[Layouts|docs/layouts]] documentation with comprehensive StackLayout API reference
- FlatList now properly handles dynamic data updates with `updateState` without full re-renders
- Docs sidebar navigation now works correctly in both desktop and mobile tab layouts
- Theme-aware logos and splash screen with rotating animations and gradient loaders

**Bug Fixes**

- Fixed pointer-events blocking in sw-stack-shell when tabs layout is active
- Resolved z-index layering issues between tab content and sidebars
- Fixed popup visibility being lost when navigating between stack and tabs layouts

## v0.2.1 – March 17, 2026

**Features**

- Docs search component with dedicated routes JSON – search matches keywords and navigates to the selected doc
- Dashboard and CLI docs now show `npm install -g create-switch-framework-app` for global install
- CLI page documents global install usage and how to run the CLI when installed globally

**Improvements**

- Expanded state management docs: static state behavior, onMount, getState in methods and styleSheet, useEffect for data fetching with loader, dependency array and rerender behavior
- Fixed docs pagination (Previous/Next) to correctly point to all doc screens in order
- Migrated DocsPagination and DocsLeftSidebarNav from deprecated connected/disconnected to onMount/onDestroy

## v0.2.0 – March 16, 2026

**Features**

- Next.js-like server API: `switchFrameworkBackend.config()` and `app.initServer((server) => { ... })`
- Clean import specifiers: `'switch-framework'` and `'switch-framework/router'` instead of path-based imports
- Import map auto-injection: server injects import map into index.html on request – no import map in your HTML source
- Backend owns Express setup: framework routes, static files, SPA catch-all, and session built-in
- Dual module support: works with both CommonJS (`require`) and ESM (`import`)

**Improvements**

- Simplified server.js: user adds middleware via `initServer` callback; no manual `app.use` for framework routes
- New [[Server documentation|docs/server/introduction]] (Introduction, Web Server, Desktop Server)
- Updated CLI templates and docs code snippets to use clean import specifiers

## v1.2.0 – March 10, 2026

**Features**

- Added [[State Management|docs/state]] for lightweight reactive state management
- Introduced modal components with state-driven visibility and animations
- Added Toast/Alert components for bottom-up notifications
- New fullscreen pin viewer with scale-up reveal animation
- Framework [[Theming|docs/theming]] system with dark/light mode support

**Improvements**

- Refactored documentation to use modular screen components
- Enhanced [[Animations|docs/animations]] system with keyframes and transitions
- Better code organization with state helpers in app/state.js
- Improved type safety in router with route parameter handling

**Bug Fixes**

- Fixed modal z-index stacking issues
- Corrected route matching for static vs dynamic paths
- Fixed template literal syntax in code blocks

## v1.1.0 – February 28, 2026

**Features**

- Added responsive tab layout system
- Introduced stack navigation for modal-like flows
- New [[Router|docs/router]] with URL parameter support

**Improvements**

- Better CSS variable system for theming
- Optimized Web Components performance

## v1.0.0 – January 15, 2026

**Initial Release**

- Runtime-first framework with no build step required
- Web Components-based architecture
- Built-in router with stack and tab layouts
- Basic theming system
- Documentation and examples
