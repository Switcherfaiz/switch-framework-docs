## Theming

Switch Framework provides theme helpers for dark and light mode. Import from `switch-framework/themes`:

```javascript title:Import theme helpers
import {
  getSystemTheme,
  getTheme,
  changeTheme,
  initTheme,
  useThemesChangesSubscriber
} from 'switch-framework/themes';
```

### Setup

In your `assets/styles` folder, add a `styles.css` with `:root` and `body[data-theme="dark"]` for CSS variables. The theme helpers set `data-theme` on `document.body`.

```css title:styles.css (example)
:root, body {
  --page_background: #ffffff;
  --main_text: #0f172a;
}

body[data-theme="dark"] {
  --page_background: #0f172a;
  --main_text: #f8fafc;
}
```

### Initialize on app start

Call `initTheme()` before `startApp` so the app loads with the correct theme. It checks `localStorage` first; if no stored theme, it uses the system preference.

```javascript title:index.js
import { startApp } from 'switch-framework';
import { initTheme } from 'switch-framework/themes';

initTheme();
startApp(layout);
```

### changeTheme – what to pass

Pass `'dark'` or `'light'` to `changeTheme`. It sets `data-theme` on `document.body`, saves to localStorage, and dispatches a `theme:change` event.

```javascript title:Toggle theme
import { getTheme, changeTheme } from 'switch-framework/themes';

// Pass 'dark' or 'light'
changeTheme(getTheme() === 'dark' ? 'light' : 'dark');
```

### All theming functions

- `getSystemTheme()` – returns `'dark'` or `'light'` from `prefers-color-scheme`
- `getTheme()` – returns current theme (localStorage first, else system)
- `changeTheme('dark' | 'light')` – sets theme, updates `body[data-theme]`, saves to localStorage, dispatches `theme:change`
- `initTheme()` – call before startApp; applies stored or system theme
- `useThemesChangesSubscriber(callback)` – subscribe to theme changes; callback receives current theme; returns unsubscribe
