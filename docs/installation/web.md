## Web Installation

Two ways to get started: install the packages yourself, or let the CLI do the heavy lifting. We recommend the CLI – it scaffolds everything so you can start coding in seconds.

### Option 1: Manual install

Add the core packages to your project:

```bash title:bash
npm i switch-framework switch-framework-backend
```

### Option 2: Create a new app (recommended)

One command, full project structure. Web, Electron, or both – you choose:

```bash title:bash
npx create-switch-framework-app my-app
```

**Using the local framework?** Run `npm link` in your `switch-framework` folder, then `npm link switch-framework` in your app. Your app will use your local copy instead of the npm version.
