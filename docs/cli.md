## CLI

Use `npx` to run the CLI without installing, or install globally for faster repeated use.

```bash title:Commands (npx)
npx create-switch-framework-app my-app
npx create-switch-framework-app my-app --yes --app-type web --port 4000
npx create-switch-framework-app my-desktop-app --app-type electron --port 3000
npx create-switch-framework-app my-app --use-local
```

### Global install

To install the CLI globally and use it without `npx`:

```bash title:Install globally and use
# Install globally (run once)
npm install -g create-switch-framework-app

# Then use without npx
create-switch-framework-app my-app
create-switch-framework-app my-app --yes --app-type web
```

### Options

```params-table
{"headers":["Option","Description"],"htmlColumns":[0,1],"rows":[["<code>--yes</code>, <code>-y</code>","Skip prompts and use defaults"],["<code>--app-type &lt;type&gt;</code>","<code>web</code> | <code>electron</code> | <code>both</code>"],["<code>--port &lt;port&gt;</code>","Server port. Default: 3000"],["<code>--no-install</code>","Do not run npm install after creation"],["<code>--use-local</code>","Use npm link for local switch-framework packages"],["<code>-h</code>, <code>--help</code>","Show help"]]}
```
