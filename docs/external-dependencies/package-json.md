## Allowlisting in package.json

The browser only sees packages you **explicitly** list. `npm i` installs on disk; `switchFramework.imports` is what Switch is allowed to put on the import map and serve from `/npm`.

> [!NOTE]
> SDK names are always mapped: `switch-framework`, `switch-framework/router`, `switch-framework/themes`, `switch-framework/overlay`, `switch-framework-icons`, and `switch-framework-router`. You never add those names to `imports`. That list is for third-party packs only.

### App `package.json` (consumer)

This is the file in the **project you run** (`npm run dev`), not the component package.

```json title:package.json
{
  "name": "my-app",
  "type": "module",
  "dependencies": {
    "switch-framework": "^0.3.0",
    "switch-framework-backend": "^0.3.0",
    "@faiz/tw-masonry": "^0.1.0"
  },
  "switchFramework": {
    "port": 3000,
    "imports": ["@faiz/tw-masonry"]
  }
}
```

```params-table
{"headers":["Key","Role"],"htmlColumns":[0,1],"rows":[["<code>dependencies</code>","Installs the package so <code>require.resolve</code> can find it."],["<code>switchFramework.port</code>","Default HTTP port for the CLI / scaffold."],["<code>switchFramework.imports</code>","Allowlist of <strong>bare specifier names</strong> the browser may import."]]}
```

Restart the server after you change `imports`. The map is generated once at boot.

### Array or object

Both shapes work. Values other than `true` or a string in the object form are ignored.

```json title:Array (usual)
"switchFramework": {
  "imports": ["@faiz/tw-masonry", "date-fns"]
}
```

```json title:Object
"switchFramework": {
  "imports": {
    "@faiz/tw-masonry": true,
    "date-fns": true
  }
}
```

Scoped names are one entry (`"@faiz/tw-masonry"`), not `"@faiz"` plus `"tw-masonry"`.

### Merge with `config()`

```javascript title:server.js
switchFrameworkBackend.config({
  PORT: 3000,
  staticRoot: path.join(__dirname, '.'),
  imports: ['date-fns']
});
```

Names from `package.json` and `config({ imports })` are unioned. Use `config` for env-specific extras; keep the stable list in `package.json` so it is obvious in the repo.

### What gets served besides the name you listed

For each allowlisted package the backend:

1. Resolves it from the **app** `node_modules` (or workspace / link).
2. Picks the browser ESM entry (`exports["."]`, `browser`, `module`, `main`).
3. Adds `"/npm/<name>/<entry-file>"` and `"<name>/"` to the import map.
4. Walks that package’s **`dependencies`** (not peer/dev) up to **depth 3** so nested ESM helpers load. `switch-framework` and `switch-framework-backend` are skipped and stay on the app copy.

If the name is missing or has no ESM entry, **boot fails** with a clear error (`listed import "…" is not installed` / `CommonJS-only`). That is intentional — better than a blank screen.

### Package `package.json` (publisher)

Authors do **not** set `switchFramework.imports`. That key is only on the **app**. The published package should look like this so consumers can allowlist it easily:

```json title:package.json (published component)
{
  "name": "@your-scope/your-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "switch-framework": ">=0.3.0"
  }
}
```

Tell users in your README:

```markdown title:README snippet
npm i @your-scope/your-package

Then in the app package.json:

"switchFramework": {
  "imports": ["@your-scope/your-package"]
}

Restart the Switch server, then:

import '@your-scope/your-package';
```

### Linked / workspace packages

Same allowlist. Example from the test app:

```json title:App using a workspace package
{
  "workspaces": ["packages/*"],
  "dependencies": {
    "@faiz/tw-masonry": "0.1.0"
  },
  "switchFramework": {
    "port": 5173,
    "imports": ["@faiz/tw-masonry"]
  }
}
```

`packages/tw-masonry` is not reachable as `/packages/...` (that path 404s). The browser only hits `/npm/@faiz/tw-masonry/index.js`.

### Security jail (why the extra JSON field exists)

```params-table
{"headers":["Request","Result"],"htmlColumns":[0,1],"rows":[["<code>GET /npm/@faiz/tw-masonry/index.js</code>","200 if that name is listed and the file is inside the package root"],["<code>GET /npm/express</code>","404 unless you listed <code>express</code> (do not)"],["<code>GET /node_modules/...</code>","Always 404"],["<code>GET /backend</code>, <code>/.env</code>, <code>/.git</code>","Always 404"]]}
```

Only `.js`, `.mjs`, `.css`, `.json`, `.svg`, `.woff2` are sent. The URL is never passed to `require.resolve` — the allowlist map is.

Inspect the live map: `GET /__switch/imports.json`.

Related: [[Importing packages|docs/external-dependencies]] · [[Creating a Switch package|docs/external-dependencies/creating]] · [[Web Server|docs/server/web]]
