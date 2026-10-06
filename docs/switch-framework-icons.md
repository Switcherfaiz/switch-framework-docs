## switch-framework-icons

`switch-framework-icons` is a first-party icon font. Do **not** add it to `switchFramework.imports`. Search and click an icon below to copy snippets.

### Switch Framework usage

Import the package so `<sw-icon>` is registered. Color and size can be set inline or with CSS selectors (`sw-icon` inherits `color` and `font-size`).

```html title:Using switch-framework-icons in Switch Framework
import 'switch-framework-icons'; // registerComponent

render() {
  return `<sw-icon name="magnifying_glass" size="18"></sw-icon>`;
}
```

```html title:Style with CSS or inline
styleSheet() {
  return `
    <style>
      sw-icon { font-size: 18px; color: var(--main_text); }
      .tab-btn.active sw-icon { color: #fff; }
    </style>
  `;
}

render() {
  return `<sw-icon name="heart" style="color:#e60023;font-size:22px"></sw-icon>`;
}
```

The create-app template already adds this in `index.html`:

```html
<link rel="stylesheet" href="/switch-framework-icons/style.css">
```

CSS `@import` does not use the JavaScript import map. If a shadow stylesheet still needs the font, use the HTTP URL:

```html title:Font inside styleSheet
styleSheet() {
  return `
    <style>
      @import url('/switch-framework-icons/style.css');
    </style>
  `;
}
```

`name` is the icon id without the `switch_icon_` prefix. `size` is pixels when you pass a number (`18` → `18px`). Optional `label` sets `aria-label`. Color follows `currentColor`.

### Independent usage

Any HTML page. Load the CSS, then use a span:

```html title:Using switch-framework-icons independently
<link rel="stylesheet" href="./node_modules/switch-framework-icons/style.css">

<span class="switch_icon_github"></span>
<span class="switch_icon_chevron_right"></span>
```

### All Icons

Click an icon to open its detail panel. Use the search bar to filter.
