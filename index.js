import { startApp, setGlobalComponentSheet } from 'switch-framework';
import { initTheme } from 'switch-framework/themes';
import { replace } from 'switch-framework/router';
import layout from './app/_layout.js';

async function loadGlobalIconSheet() {
  try {
    const res = await fetch('/assets/icons/style.css');
    if (!res.ok) return;
    let css = await res.text();
    css = css.replace(/url\((['"]?)fonts\//g, "url($1/assets/icons/fonts/");
    await setGlobalComponentSheet(css);
  } catch (_) {}
}

initTheme();
loadGlobalIconSheet().finally(() => {
  startApp(layout);
});

document.addEventListener('app:ready', () => {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  if (path === 'docs') replace('docs/introduction');
});
