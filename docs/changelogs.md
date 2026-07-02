# Changelogs

Release notes and version history for Switch Framework. Each version includes new features, improvements, and bug fixes.

## v0.2.6 – July 2, 2026

**Features**

- [[FlatList|docs/components/flatlist]] – React Native–style list component: vertical and horizontal scrolling, multi-column grids, infinite scroll via `onEndReached`, header/footer/separators, and state-driven updates through `dataState`, `horizontalState`, and `numColumnsState`
- FlatList imperative scroll APIs via `useRef`: `scrollToIndex`, `scrollToEnd`, `scrollToOffset`, and `scrollBy` — ideal for carousels and album rows
- FlatList styling scope alias — use `flatlist { }` in extended `styleSheet()` to target scroll area, scrollbar, and inner layout without calling `super.styleSheet()`
- [[ElectronTitleBar|docs/components/electron-titlebar]] – desktop window chrome for Electron apps with draggable region and minimize, maximize/restore, and close controls using Switch icons
- Electron title bar auto-mounts in `sw-app-shell` for both tabs and stack layouts; visibility follows the active layout via `installElectronTitleBarRouteSync()`
- Electron shell helpers (`applyElectronShellLayout`, `syncElectronTitleBarHost`, `getWindowControls`) and `titlebar` styling scope alias for custom chrome

**Improvements**

- `SwitchComponent` now merges `styleSheet()` rules from the full inheritance chain automatically — extended FlatList and ElectronTitleBar classes only add their own rules
- State manager reports clearer duplicate `createState` errors with owner hints from the call stack
- Stack and tab shells reserve title bar height in Electron via `--electron-titlebar-h` so content no longer sits under window controls
- FlatList and ElectronTitleBar docs with live preview examples; code blocks auto-detect Switch components and mount them on Run
- CLI templates (web and Electron) updated with Montserrat fonts, themed splash screen, and improved server bootstrap

**Bug Fixes**

- Fixed state subscription rerenders — components now update reliably when watched keys change
- Fixed Electron title bar host switching when navigating between tabs and stack routes
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
