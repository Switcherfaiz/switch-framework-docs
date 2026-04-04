export const layoutsStackCode = {
  title: 'app/_layout.js',
  language: 'javascript',
  code: `import { StackLayout, createState } from 'switch-framework';

export class SwStackLayout extends StackLayout {
  static stackScreens = [SwIndexScreen, SwChangelogsScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-splash');
    createState([], 'patient-list');
    createState(0, 'docs-helpful-count');
    createState(false, 'search-open');
    await new Promise((r) => setTimeout(r, 2000));
    return { splash: 'sw-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();`
};

export const layoutsGlobalStatesCode = {
  title: 'globalStates – static app data',
  language: 'javascript',
  code: `// globalStates holds static data that stays constant (navigate, go_back, tabsLayout, etc.)
// Use getState/setState for framework-internal keys:

globalStates.getState('activeRoute');    // current route string
globalStates.getState('routeParams');    // { id: '42' } from path params
globalStates.getState('searchParams');   // { name: 'Jane' } from ?name=Jane
globalStates.getState('navigate');      // function to navigate
globalStates.setState({ key: value });   // merge into global state (triggers subscribers)`
};

export const layoutsTabCode = {
  title: 'TabLayout',
  language: 'javascript',
  code: `export class SwTabsLayout extends TabLayout {
  static screens = [SwDocsIntroScreen, SwDocsStateScreen];
  static tabs = [{ name: 'docs', path: '/docs/:id', match: ['docs'] }];
  static initialTab = 'docs';
}`
};
