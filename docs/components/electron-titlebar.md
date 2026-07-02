## ElectronTitleBar

**ElectronTitleBar** is the desktop window chrome for Switch Framework Electron apps. It renders minimize, maximize/restore, and close controls plus a draggable title region. On web builds it stays hidden — the component checks `window.switchApp.isElectron` and renders nothing in the browser.

> **Key Concept:** ElectronTitleBar extends `SwitchComponent`. The framework mounts it automatically inside `sw-app-shell` for both **tabs** and **stack** layouts. Extend it to customize appearance while keeping the same window-control behavior.

### Automatic setup (Electron apps)

When you scaffold with the Electron template, the title bar is already wired:

- `sw-app-shell` embeds two title bar instances — one for tabs layout (`data-host="tabs"`) and one for stack layout (`data-host="stack"`).
- Only the title bar matching the active layout is visible.
- `sw-app-initial` calls `installElectronTitleBarRouteSync()` so visibility updates on route changes.

You do **not** need to add `<sw-electron-titlebar>` to your screens. Focus on styling or extending the component when you want custom chrome.

### Electron preload contract

The title bar talks to the desktop host through `window.switchApp`. Your Electron **preload** script must expose at least:

```javascript title:electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('switchApp', {
  isElectron: true,
  windowControls: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onMaximizedChanged: (callback) => {
      const handler = (_event, maximized) => callback(maximized);
      ipcRenderer.on('window:maximized-changed', handler);
      return () => ipcRenderer.removeListener('window:maximized-changed', handler);
    }
  }
});
```

Wire the corresponding IPC handlers in your Electron **main** process (`BrowserWindow.minimize()`, `maximize()`, `close()`, etc.). If `windowControls` is missing, the bar still renders but buttons do nothing.

### Basic usage — default title bar

Import and register the built-in component (already done by `registerFramework()`). No extra markup is required:

```javascript title:app/_layout.js
import { StackLayout } from 'switch-framework';
// ElectronTitleBar is registered automatically via registerFramework()

export class SwStackLayout extends StackLayout {
  static stackScreens = [/* your screens */];
  static tabsLayout = SwTabsLayout;
  static initialRoute = 'index';
}

export default SwStackLayout.getAppLayout();
```

Run the app with `npm run electron:dev`. The fixed title bar appears at the top; content scrolls underneath in the stack/tabs shell.

### Extending ElectronTitleBar

Extend the class to add an app title, change colors, or adjust height. Call `super.onMount()` so shell layout and window-control listeners stay connected.

Keep button ids `#etb-minimize`, `#etb-maximize`, and `#etb-close` if you override `render()` and still want the default handlers — or override `bindInteractionHandlers()` for custom behavior.

```javascript title:components/AppTitleBar.js
import { ElectronTitleBar, registerComponents } from 'switch-framework';

export class AppTitleBar extends ElectronTitleBar {
  static tag = 'sw-app-titlebar';
  static titlebarHeight = 40;

  render() {
    if (!this.isElectron()) return '';

    return `
      <header class="titlebar" role="banner" aria-label="Window">
        <div class="drag">
          <span class="app-name">My Desktop App</span>
        </div>
        <div class="controls">
          <button type="button" class="ctrl" id="etb-minimize" aria-label="Minimize">
            <span class="switch_icon_window_minimize" aria-hidden="true"></span>
          </button>
          <button type="button" class="ctrl" id="etb-maximize" aria-label="Maximize">
            <span class="switch_icon_window_maximize" aria-hidden="true"></span>
          </button>
          <button type="button" class="ctrl close" id="etb-close" aria-label="Close">
            <span class="switch_icon_close" aria-hidden="true"></span>
          </button>
        </div>
      </header>
    `;
  }

  onMount() {
    super.onMount();
  }

  styleSheet() {
    return `
      <style>
        titlebar {
          background: linear-gradient(90deg, #1e1b4b, #312e81);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        titlebar .app-name {
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 14px;
          font-size: 13px;
          font-weight: 600;
          color: #e0e7ff;
          -webkit-app-region: drag;
        }
        titlebar .ctrl {
          color: #e0e7ff;
        }
        titlebar .ctrl:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        titlebar .ctrl.close:hover {
          background: #e81123;
          color: #fff;
        }
      </style>
    `;
  }
}

registerComponents([AppTitleBar]);
```

Register your custom tag in layout init so `sw-app-shell` uses it instead of the default:

```javascript title:app/_layout.js init hook
static async init({ globalStates, renderSplashscreen }) {
  renderSplashscreen('sw-splash');
  globalStates.setState({ electronTitleBarTag: 'sw-app-titlebar' });
  await new Promise((r) => setTimeout(r, 800));
  return { splash: 'sw-splash', initialRoute: 'index' };
}
```

Import `AppTitleBar` in `_layout.js` (or a barrel file) so `registerComponents` runs before the shell renders.

### Styling ElectronTitleBar

ElectronTitleBar renders inside shadow DOM. Style it from an extended component’s `styleSheet()` using these patterns:

```params-table
{"headers":["Target","Selector","Use for"],"htmlColumns":[1],"rows":[["Host element","<code>:host { }</code>","Height override, display, inherited CSS variables"],["Global CSS","<code>sw-app-titlebar { }</code>","Host styles from an external stylesheet"],["Title bar internals","<code>titlebar { }</code> or <code>titlebar .ctrl { }</code>","Background, drag region, window buttons"]]}
```

The **`titlebar`** keyword is a scope alias — the framework rewrites it to `.titlebar` (the inner header class). Base ElectronTitleBar styles merge automatically; you do not call `super.styleSheet()`.

**Common inner classes** (use with `titlebar` or directly in `styleSheet()`):

- `titlebar` — full header row (draggable)
- `titlebar .drag` — flexible drag region (left side)
- `titlebar .controls` — window buttons container (non-draggable)
- `titlebar .ctrl` — minimize / maximize / restore buttons
- `titlebar .ctrl.close` — close button (red hover by default)

**Document-level layout:** on mount, the component sets `html.electron-shell` and `--electron-titlebar-h`. Match shell padding in your layouts with:

```css
padding-top: var(--electron-titlebar-h, 32px);
```

### Runtime environment checks

Use static or instance helpers to branch desktop vs web logic:

```javascript
import { ElectronTitleBar } from 'switch-framework';

if (ElectronTitleBar.isElectron()) {
  // desktop-only feature
}

export class SettingsScreen extends SwitchComponent {
  render() {
    if (this.isWeb()) {
      return `<p>Settings (web)</p>`;
    }
    const controls = this.getWindowControls();
    return `<p>Desktop — controls ${controls ? 'available' : 'missing'}</p>`;
  }
}
```

### Static configuration

```params-table
{"headers":["Property","Default","Description"],"htmlColumns":[0,1],"rows":[["<code>static tag</code>","<code>'sw-electron-titlebar'</code>","Custom element name. Set <code>electronTitleBarTag</code> global state to use a different registered tag."],["<code>static titlebarHeight</code>","<code>32</code>","Height in pixels. Sets <code>--electron-titlebar-h</code> on <code>document.documentElement</code> via <code>applyElectronShellLayout()</code>."]]}
```

### User overridable methods

Override these when extending — call `super.onMount()` / `super.onDestroy()` unless you fully replace lifecycle behavior.

- `render()` — Return title bar HTML. Return `''` on web (base class does this automatically).
- `styleSheet()` — Return CSS for host and inner chrome. Use the `titlebar` scope alias for inner selectors.
- `bindInteractionHandlers()` — Attach minimize/maximize/close and double-click-to-maximize on `.drag`. Override to customize control wiring.
- `syncMaximizeIcon()` — Update maximize button icon/label after state changes. Called automatically when `windowControls.onMaximizedChanged` exists.
- `onMount()` — Applies electron shell layout CSS vars and binds handlers.
- `onDestroy()` — Unsubscribes from `onMaximizedChanged` if registered.

### Methods

```params-table
{"headers":["Method","Parameters","Returns","Description"],"htmlColumns":[0,1,2],"rows":[["<code>ElectronTitleBar.isElectron()</code>","none","<code>boolean</code>","Static. True when <code>window.switchApp.isElectron</code> is set."],["<code>ElectronTitleBar.isWeb()</code>","none","<code>boolean</code>","Static. Inverse of <code>isElectron()</code>."],["<code>isElectron()</code>","none","<code>boolean</code>","Instance check for Electron shell."],["<code>isWeb()</code>","none","<code>boolean</code>","Instance check for browser / web build."],["<code>getWindowControls()</code>","none","<code>object | null</code>","Returns <code>window.switchApp.windowControls</code> (minimize, maximize, close, isMaximized, onMaximizedChanged)."],["<code>syncMaximizeIcon()</code>","none","<code>Promise&lt;void&gt;</code>","Syncs maximize/restore icon and aria-label from <code>controls.isMaximized()</code>."],["<code>bindInteractionHandlers()</code>","none","<code>void</code>","Wires click handlers to window controls and double-click on drag region."],["<code>render()</code>","none","<code>string</code>","Builds title bar markup. Empty string when not in Electron."],["<code>styleSheet()</code>","none","<code>string</code>","Default chrome styles plus merged extended styles."],["<code>onMount()</code>","none","<code>void</code>","Calls <code>applyElectronShellLayout(titlebarHeight)</code> and <code>bindInteractionHandlers()</code>."],["<code>onDestroy()</code>","none","<code>void</code>","Cleans up maximize-state subscription."]]}
```

### Shell helpers (optional)

These utilities live in `switch-framework/electron/shell.js` and are used internally by the app shell:

```params-table
{"headers":["Function","Description"],"htmlColumns":[0],"rows":[["<code>isElectronShell()</code>","Same environment check as <code>ElectronTitleBar.isElectron()</code>."],["<code>isWebShell()</code>","True outside the Electron shell."],["<code>getWindowControls()</code>","Returns <code>window.switchApp.windowControls</code>."],["<code>applyElectronShellLayout(heightPx?)</code>","Adds <code>html.electron-shell</code> class and sets <code>--electron-titlebar-h</code>."],["<code>syncElectronTitleBarHost(route?)</code>","Shows tabs or stack title bar based on active layout."],["<code>installElectronTitleBarRouteSync()</code>","Subscribes to route changes; returns unsubscribe function."],["<code>getElectronTitleBarTag()</code>","Reads <code>electronTitleBarTag</code> from global state or defaults to <code>sw-electron-titlebar</code>."],["<code>electronTitleBarHtml(host)</code>","Returns markup string for manual placement (<code>'tabs'</code> or <code>'stack'</code>). Rarely needed — shells embed bars by default."]]}
```

### Lifecycle

- **Web:** component connects, `render()` returns `''`, host stays hidden via `:host(:not([data-electron]))`.
- **Electron:** `onMount()` sets document CSS variables, binds window controls, subscribes to maximize changes.
- **Layout switch:** `sw-app-shell._syncTitleBars()` toggles `hidden` on the tabs vs stack title bar instance.
- **Destroy:** `onDestroy()` removes the maximize listener subscription.
