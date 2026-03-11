import { Stack, registerScreens, createState } from '/switch-framework/index.js';
import tabsLayout from './(tabs)/_layout.js';

const tabScreens = Array.isArray(tabsLayout?.screens) ? tabsLayout.screens : [];

const stackScreens = [
  Stack.screen({
    name: 'index',
    path: '/',
    title: 'Welcome',
    tag: 'sw-index-screen'
  }),
  Stack.screen({
    name: '+not-found',
    path: '/+not-found',
    title: 'Not Found',
    tag: 'sw-user-not-found-screen'
  })
];

const screens = registerScreens({
  stackScreens,
  tabsLayout,
  tabScreens,
  validate: true
}).screens;

const layout = {
  splash: 'sw-starter-splash',
  initialRoute: 'index',
  screens,

  async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');

    // Create app-level state (SwitchStateManager) – any component can subscribe
    createState(0, 'docs-helpful-count');

    // your async operation here that made splashscreen appear
    await new Promise((resolve) => setTimeout(resolve, 3000));

    globalStates.setState({
      tabsLayout
    });

    return {
      splash: 'sw-starter-splash',
      initialRoute: 'index'
    };
  }
};

export default layout;
