import { startApp } from 'switch-framework';
import { initTheme } from 'switch-framework/themes';
import { replace } from 'switch-framework/router';
import layout from './app/_layout.js';

initTheme();
startApp(layout);

document.addEventListener('app:ready', () => {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  if (path === 'docs') replace('docs/introduction');
});
