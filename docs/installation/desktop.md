## Desktop App Installation

Use the CLI to scaffold a Switch Framework app with Electron for desktop distribution. Your app runs in a native window with access to Node.js APIs when needed.

### Create a desktop app

```bash title:Create Electron app
npx create-switch-framework-app my-desktop-app --template electron
```

The Electron template includes the same app structure as the web template, plus Electron main process files. Build for Windows, macOS, or Linux.

### Build for production

Run `npm run build` (or the script defined in your Electron template) to package the app. Output goes to `dist/` or the configured output directory.
