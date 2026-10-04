## Importing packages

Switch serves **allowlisted** npm packages to the browser through the same import map as `switch-framework`. There is no bundler. You write a normal bare `import`; the backend resolves the package from your app install and serves only files inside that package root.

> [!TIP]
> Three steps: `npm i` the package, add its name to `switchFramework.imports` in the **app** `package.json`, restart the server, then import it like `switch-framework`. Details for the JSON live on [[Allowlisting in package.json|docs/external-dependencies/package-json]]. To publish your own tag, see [[Creating a Switch package|docs/external-dependencies/creating]].

### 1. Install

```bash title:bash
npm i @your-scope/your-package
```

The package must be a real dependency of the app (or a workspace / `npm link` install). The backend uses `require.resolve` from the app root — it will not fetch from the registry at request time.

### 2. Allow it

In the **app** `package.json` (not the package you published):

```json title:package.json (app)
{
  "dependencies": {
    "switch-framework": "^0.3.0",
    "switch-framework-backend": "^0.3.0",
    "@your-scope/your-package": "^1.0.0"
  },
  "switchFramework": {
    "port": 3000,
    "imports": ["@your-scope/your-package"]
  }
}
```

Restart `npm run dev`. The import map is built at boot. Changing `imports` without a restart does nothing.

You can also pass the same list to the backend:

```javascript title:server.js (optional extra list)
switchFrameworkBackend.config({
  PORT,
  staticRoot: path.join(__dirname, '.'),
  imports: ['@your-scope/your-package']
});
```

`package.json` and `config({ imports })` are merged. `switch-framework`, `switch-framework/router`, and `switch-framework/themes` are always mapped — you do not list them.

### 3. Import in a screen or component

Same syntax you already use for the framework:

```javascript title:app/(tabs)/home/index.js
import { SwitchComponent, createProps } from 'switch-framework';
import '@your-scope/your-package';
import { formatCount } from '@your-scope/your-package';

export class HomeScreen extends SwitchComponent {
  static tag = 'my-home-screen';
  static screenName = 'home';
  static path = '/home';

  render() {
    return `
      <p>${formatCount(1200)} items</p>
      <tw-your-tag data="${createProps({ dataKey: 'home-pins' })}"></tw-your-tag>
    `;
  }
}
```

Side-effect `import '@your-scope/your-package'` is what registers the custom element. Putting the tag in `render()` without importing the module does nothing — the tag does not exist until that module ran.

Subpath imports work when the package `exports` them (and because the map includes `"pkg/"`):

```javascript title:Subpath import
import { masonrySheet } from '@your-scope/your-package/stylesheet.js';
```

### What the browser actually requests

| You write | Browser GET | Disk |
|---|---|---|
| `from 'switch-framework'` | `/switch-framework/index.js` | installed `switch-framework` |
| `from '@your-scope/your-package'` | `/npm/@your-scope/your-package/index.js` (entry file) | that package’s ESM entry |
| `from './TwPinCard/index.js'` | `/components/TwPinCard/index.js` | your app static files |

The import map entry **must** point at the package entry **file**, not `/npm/@scope/name`. Relative imports inside the package (`./stylesheet.js`) then stay under `/npm/@scope/name/`.

> [!NOTE]
> Empty `imports` is correct for a fresh app: only `switch-framework*` is on the map. Add names as you need them. Unknown `/npm/...` is **404**. `/node_modules` is never mounted.

### Helpers vs tags

A package can export **functions** (`formatCount`) and/or **register a `SwitchComponent`**. Tags need `registerComponent` at module load. Helpers are a normal named export. You can import either, or both.

### Lazy load

Static `import` runs when the screen module loads (best for first paint). `import()` after a click or `useScreenFocus` is the same allowlist — only the *when* of the GET changes:

```javascript title:Lazy import
async function openWidget() {
  await import('@your-scope/your-package');
}
```

### Debug

```params-table
{"headers":["Check","What it tells you"],"htmlColumns":[0,1],"rows":[["Server boot log","<code>npm @your-scope/your-package</code> listed next to the running URL"],["<code>GET /__switch/imports.json</code>","The injected import map and allowlisted package names"],["DevTools → the module URL","Should be <code>/npm/&lt;name&gt;/&lt;entry&gt;</code>, never <code>/node_modules/...</code>"],["Boot error","Allowlisted name not installed, or no browser ESM entry"]]}
```

### Do not

- Import `/node_modules/...` or `node:` specifiers from app code.
- Expect CommonJS-only packages to load in phase 1 (ESM `exports` / `module` / `type: "module"` only).
- Skip the allowlist because the package is already in `dependencies` — extra deps (`express`, `dotenv`, `esbuild`) must not ship to the browser.
- Type `/npm/@scope/name` in source. That URL is an implementation detail.

Next: [[Creating a Switch package|docs/external-dependencies/creating]] · [[Allowlisting in package.json|docs/external-dependencies/package-json]]
