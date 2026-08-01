## ElectronTitleBar

**ElectronTitleBar** is the desktop window chrome for Switch Framework Electron apps. It provides a draggable title region and hooks for minimize, maximize/restore, and close. On web builds it stays hidden.

> **Key Concept:** Base setup runs **automatically** — no `super.onMount()`. Add `static { this.useState('your-key'); }`, read `getState('your-key')` in `render()`, wire clicks in `onMount()` with `useRef(this)`, or trigger actions from anywhere via **action states**.

### Automatic setup (Electron apps)

- `sw-app-shell` mounts **one** title bar at the top (tabs and stack layouts share it).
- `registerComponents([YourTitleBar])` registers the class and creates **default states** for your tag.
- Base shell layout, window-state sync, visibility state, and action-state watchers run without calling `super.onMount()`.

### Default states

For `static tag = 'sw-app-titlebar'`, the base class creates:

```params-table
{"headers":["State key","Initial","Purpose"],"htmlColumns":[0,1,2],"rows":[["<code>sw-app-titlebar-window-state</code>","<code>'normal'</code>","UI state: <code>normal</code>, <code>maximized</code>, or <code>minimized</code> — use in <code>render()</code>"],["<code>sw-app-titlebar-visible</code>","<code>true</code>","Show or hide the title bar from anywhere"],["<code>sw-app-titlebar-action-minimize</code>","<code>0</code>","Bump to minimize (from anywhere)"],["<code>sw-app-titlebar-action-maximize</code>","<code>0</code>","Bump to maximize"],["<code>sw-app-titlebar-action-restore</code>","<code>0</code>","Bump to restore"],["<code>sw-app-titlebar-action-close</code>","<code>0</code>","Bump to close"],["<code>sw-app-titlebar-action-toggle-maximize</code>","<code>0</code>","Bump to toggle maximize/restore"]]}
```

Pattern: **`${tag}-window-state`**, **`${tag}-visible`**, and **`${tag}-action-*`**. Subscribe in a `static {}` block with `this.useState('…')` for keys you read in `render()`.

### Full example

```javascript title:components/AppTitleBar.js
import { ElectronTitleBar, getState, updateState, useRef, registerComponents } from 'switch-framework';

export class AppTitleBar extends ElectronTitleBar {
  static tag = 'sw-app-titlebar';
  static titlebarHeight = 40;

  static { this.useState('sw-app-titlebar-window-state'); }

  render() {
    if (!this.isElectron()) return '';

    const maximized = getState('sw-app-titlebar-window-state') === 'maximized';
    const maxIcon = maximized ? 'switch_icon_window_restore' : 'switch_icon_window_maximize';
    const maxLabel = maximized ? 'Restore' : 'Maximize';

    return `
      <header class="titlebar" role="banner" aria-label="Window">
        <div class="drag">
          <span class="switch_icon_desktop app-icon" aria-hidden="true"></span>
          <span class="app-name">Desktest</span>
        </div>
        <div class="controls">
          <button type="button" class="ctrl" id="etb-minimize" aria-label="Minimize">
            <span class="switch_icon_window_minimize" aria-hidden="true"></span>
          </button>
          <button type="button" class="ctrl" id="etb-maximize" aria-label="${maxLabel}">
            <span class="${maxIcon}" aria-hidden="true"></span>
          </button>
          <button type="button" class="ctrl close" id="etb-close" aria-label="Close">
            <span class="switch_icon_close" aria-hidden="true"></span>
          </button>
        </div>
      </header>
    `;
  }

  onMount() {
    const titlebarRef = useRef(this);

    this.listener('#etb-minimize', 'click', () => titlebarRef.minimize());
    this.listener('#etb-maximize', 'click', () => titlebarRef.toggleMaximize());
    this.listener('#etb-close', 'click', () => titlebarRef.close());
    this.listener('.drag', 'dblclick', () => titlebarRef.toggleMaximize());
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';
        titlebar {
          background: linear-gradient(90deg, #1e1b4b, #312e81);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        titlebar .drag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 12px;
          -webkit-app-region: drag;
        }
        titlebar .app-icon::before { font-size: 14px; color: #c7d2fe; }
        titlebar .app-name { font-size: 13px; font-weight: 600; color: #e0e7ff; }
        titlebar .ctrl { color: #e0e7ff; }
        titlebar .ctrl span::before { font-size: 11px; }
        titlebar .ctrl:hover { background: rgba(255, 255, 255, 0.08); }
        titlebar .ctrl.close:hover { background: #e81123; color: #fff; }
      </style>
    `;
  }
}

registerComponents([AppTitleBar]);
```

Import `AppTitleBar` in `_layout.js` before the app shell mounts.

### Trigger actions via state (no click)

From any screen or component, bump an action state — the title bar runs the matching method and updates `window-state`:

```javascript
import { updateState } from 'switch-framework';

updateState('sw-app-titlebar-action-minimize', (n) => (n ?? 0) + 1);
updateState('sw-app-titlebar-action-toggle-maximize', (n) => (n ?? 0) + 1);
updateState('sw-app-titlebar-action-close', (n) => (n ?? 0) + 1);
```

### Show or hide the title bar

Use the **`${tag}-visible`** state from anywhere, or call ref methods in `onMount`.

```javascript
import { updateState } from 'switch-framework';

updateState('sw-app-titlebar-visible', false); // hide
updateState('sw-app-titlebar-visible', true);  // show
```

```javascript
onMount() {
  const titlebarRef = useRef(this);
  titlebarRef.hide();
  titlebarRef.show();
  titlebarRef.setVisible(false);
  titlebarRef.toggleVisible();
}
```

The shell mounts a **single** title bar at the top. Visibility is controlled by this state — not by duplicating title bar elements.

### Electron preload contract

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

### useRef — imperative controls

Like FlatList, call **`useRef(this)`** inside `onMount`:

```javascript
onMount() {
  const titlebarRef = useRef(this);
  titlebarRef.minimize();
  titlebarRef.toggleMaximize();
}
```

```params-table
{"headers":["Ref method","Description"],"htmlColumns":[0,1],"rows":[["<code>minimize()</code>","Minimize window; sets <code>window-state</code> to <code>minimized</code>."],["<code>maximize()</code>","Maximize; refreshes <code>window-state</code>."],["<code>restore()</code>","Restore from maximized."],["<code>toggleMaximize()</code>","Toggle maximize/restore."],["<code>close()</code>","Close the window."],["<code>refreshWindowState()</code>","Sync <code>window-state</code> from <code>isMaximized()</code>."],["<code>getWindowState()</code>","Read current <code>window-state</code> string."],["<code>show()</code>","Show title bar; sets <code>visible</code> state to <code>true</code>."],["<code>hide()</code>","Hide title bar; sets <code>visible</code> state to <code>false</code>."],["<code>setVisible(boolean)</code>","Show or hide the title bar."],["<code>getVisible()</code>","Read whether the title bar is visible."],["<code>toggleVisible()</code>","Toggle title bar visibility."]]}
```

### Styling

```params-table
{"headers":["Target","Selector","Use for"],"htmlColumns":[0,1,2],"rows":[["Host","<code>:host { }</code>","Height via <code>static titlebarHeight</code> — no <code>position: fixed</code>"],["Global CSS","<code>sw-app-titlebar { }</code>","External host styles"],["Internals","<code>titlebar .ctrl { }</code>","Drag region, buttons — <code>titlebar</code> scope alias"]]}

```

### Static configuration

```params-table
{"headers":["Property","Description"],"htmlColumns":[0,1],"rows":[["<code>static tag</code>","Custom element tag; shell auto-detects on <code>registerComponents</code>."],["<code>static titlebarHeight</code>","Height in px (<code>32</code> default)."],["<code>static windowStateKey</code>","Set by <code>registerStates</code> — <code>${tag}-window-state</code>."],["<code>static visibleStateKey</code>","Set by <code>registerStates</code> — <code>${tag}-visible</code>."],["<code>static minimizeActionKey</code>","<code>${tag}-action-minimize</code>"],["<code>static maximizeActionKey</code>","<code>${tag}-action-maximize</code>"],["<code>static restoreActionKey</code>","<code>${tag}-action-restore</code>"],["<code>static closeActionKey</code>","<code>${tag}-action-close</code>"],["<code>static toggleMaximizeActionKey</code>","<code>${tag}-action-toggle-maximize</code>"]]}
```

### Lifecycle

- **Base setup** — automatic on connect (shell layout, action watchers, OS maximize sync).
- **Your `onMount`** — listeners only; use `useRef(this)`, no `super.onMount()`.
- **`render()`** — `getState('sw-app-titlebar-window-state')` for conditional icons.
- **Re-render** — `static { this.useState('sw-app-titlebar-window-state'); }` when window state changes.
