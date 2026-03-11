import { startApp } from '/switch-framework/index.js';
import { initTheme } from '/switch-framework/themes/index.js';
import layout from './app/_layout.js';
import { appRegisters } from './app/register.js';

initTheme();
startApp(layout, appRegisters);
