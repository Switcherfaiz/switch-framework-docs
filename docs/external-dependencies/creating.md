## Creating a Switch package

A Switch component package is a normal ESM npm package that **peers** on `switch-framework`, self-registers on import, and paints with the **host app’s CSS variables** so light/dark theme just works.

> [!TIP]
> Copy the same three import styles this app already uses: bare `from 'switch-framework'`, a side-effect import so `registerComponent` runs, then the tag in `render()` with `createProps` / `getProps`.

### Package layout

```text title:Minimal package
your-package/
├── package.json
├── index.js          # registerComponent + named helpers
└── stylesheet.js     # optional, imported relatively from index.js
```

`index.js` is the browser entry. Keep files ESM. Relative imports (`./stylesheet.js`) are served under `/npm/<name>/` — do not import `switch-framework` by a relative path into `node_modules`.

### `package.json` (the published package)

```json title:package.json (component package)
{
  "name": "@your-scope/your-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./stylesheet.js": "./stylesheet.js",
    "./package.json": "./package.json"
  },
  "files": ["index.js", "stylesheet.js"],
  "peerDependencies": {
    "switch-framework": ">=0.3.0"
  },
  "keywords": ["switch-framework", "switch-component"]
}
```

```params-table
{"headers":["Field","Why it matters"],"htmlColumns":[0,1],"rows":[["<code>type: \"module\"</code>","Phase 1 serves ESM only. CommonJS-only packages fail at boot."],["<code>exports</code> / <code>main</code>","Backend picks <code>exports[\".\"]</code>, then <code>browser</code>, <code>module</code>, then <code>main</code>."],["<code>peerDependencies.switch-framework</code>","Do <strong>not</strong> nest a second copy of the framework. The app’s import map always points <code>switch-framework</code> at the app install so state and components stay one store."],["<code>exports</code> subpaths","Needed if consumers import <code>@your-scope/your-package/stylesheet.js</code>."]]}
```

> [!WARNING]
> Put `switch-framework` in **`peerDependencies`**, not `dependencies`. If you bundle or nest it, the package talks to a different state store than the app.

Consumers still have to **allowlist** your package name. Peer metadata does not auto-serve you yet. See [[Allowlisting in package.json|docs/external-dependencies/package-json]].

### Component contract

```javascript title:index.js
import { SwitchComponent, registerComponent, onState, getState } from 'switch-framework';
import { masonrySheet } from './stylesheet.js';

export function formatCount(value) {
  const num = Number(value) || 0;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

export class TwMasonry extends SwitchComponent {
  static tag = 'tw-your-masonry';

  onMount() {
    const { dataKey } = this.getProps() || {};
    if (!dataKey) return;
    this.addOnDestroy(onState(dataKey, () => this._paint()));
    this._paint();
  }

  render() {
    return `<div class="grid"></div>`;
  }

  styleSheet() {
    return masonrySheet();
  }
}

registerComponent(TwMasonry);
```

```params-table
{"headers":["Rule","Do this"],"htmlColumns":[0,1],"rows":[["Unique <code>static tag</code>","Prefix with your scope, e.g. <code>tw-faiz-masonry</code>. Global custom-element names collide."],["Self-register","Call <code>registerComponent(YourClass)</code> at module top level so <code>import '@your-scope/pkg'</code> is enough."],["Pass data with props","Host uses <code>data=\"${createProps({ dataKey: 'pins' })}\"</code>. You read <code>this.getProps()</code>."],["Subscribe to state","<code>onState(dataKey, …)</code> + a small paint — do not assume the host re-renders you."],["Named helpers","Export functions next to the class. Consumers import what they need."]]}
```

Do **not** call `super.render()` to compose UI. The host imports your tag and places it in *their* `render()`.

### Theme with app CSS variables

The host app owns `:root` / `html[data-theme="dark"]` (see [[Theming|docs/theming]]). Custom properties inherit into your shadow tree. Use them instead of hardcoded `#fff` / `#111` so the package follows light and dark mode:

```javascript title:stylesheet.js
export function masonrySheet() {
  return `
    <style>
      :host { display: block; width: 100%; font-family: inherit; color: var(--main_text, #111); }
      .tile { background: var(--surface_2, #f6f6f6); border-radius: 16px; }
      .tile p { color: var(--main_text, #111); }
    </style>
  `;
}
```

Prefer `var(--white_background)`, `var(--page_background)`, `var(--surface_2)`, `var(--main_text)`, `var(--sub_text)`, `var(--border_color)`, and `currentColor` on icons. Fallbacks after the comma keep the package readable if a host has not defined those names.

### Local development without publishing

From the app:

```json title:app package.json (workspace)
{
  "workspaces": ["packages/*"],
  "dependencies": {
    "@your-scope/your-package": "0.1.0"
  },
  "switchFramework": {
    "imports": ["@your-scope/your-package"]
  }
}
```

Or `npm link` the package, then still add the name to `imports` and restart.

### Checklist before `npm publish`

- `"type": "module"` and a reachable ESM entry
- `peerDependencies.switch-framework`
- Unique tag + `registerComponent` on import
- Styles use app CSS variables
- README tells the consumer to add the name to `switchFramework.imports`

How the consumer imports it: [[Importing packages|docs/external-dependencies]].
