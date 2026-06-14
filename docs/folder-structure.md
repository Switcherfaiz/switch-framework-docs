# Folder Structure

A typical Switch Framework app follows a simple folder structure. The `app/` directory holds your layout and screens; `components/` holds shared UI.

## Web app structure

```text title:Web app structure
my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── index.js            # startApp(layout)
├── server.js           # Express server (serves static + switch-framework)
├── app/
│   ├── _layout.js      # StackLayout with stackScreens, tabsLayout
│   ├── index.js        # Home screen
│   ├── +not-found.js   # 404 screen
│   └── (tabs)/
│       ├── _layout.js  # TabLayout + screens
│       ├── index.js    # Tab screen
│       └── explore.js  # Tab screen
├── components/         # Reusable components
└── assets/             # Styles, fonts, icons
```

## index.html

The entry HTML must include `<sw-app-initial>` (where the framework mounts) and a module script that loads `index.js`. Link your global styles (e.g. CSS variables) in the head.

```html title:index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Switch Framework App</title>
  <link rel="stylesheet" href="/assets/styles/styles.css">
  <link rel="stylesheet" href="/assets/icons/style.css">
</head>
<body>
  <sw-app-initial></sw-app-initial>
  <script type="module" src="/index.js"></script>
</body>
</html>
```

## Electron app structure

Electron apps add `main.js`, `preload.js`, and an `electron/` folder. The server runs first; Electron's BrowserWindow loads `http://localhost:PORT`. Use `npm run electron:dev` to start.

```text title:Electron app structure
my-app/
├── index.html          # Same as web – <sw-app-initial> + script
├── index.js            # startApp(layout)
├── main.js             # Electron entry (requires electron/main.js)
├── preload.js          # Electron preload (requires electron/preload.js)
├── server.js           # Express server (Electron loads http://localhost:PORT)
├── electron/
│   ├── main.js         # Electron BrowserWindow, loads app URL
│   ├── preload.js      # contextBridge for renderer
│   └── electron-builder.json
├── app/
│   ├── _layout.js
│   ├── index.js
│   ├── +not-found.js
│   └── (tabs)/
│       ├── _layout.js
│       ├── index.js
│       └── explore.js
├── components/
└── assets/
```

## Key files

- `index.html` – Entry point. Contains `<sw-app-initial>` and script tag for `index.js`.
- `index.js` – Bootstraps the app with `startApp(layout)`.
- `app/_layout.js` – Root layout. Defines `stackScreens`, `tabsLayout`, `init`.
- `app/(tabs)/_layout.js` – Tab layout. Defines `screens` and `tabs`.
- `app/(tabs)/` – Individual screen components (e.g. `index.js`, `explore.js`).
