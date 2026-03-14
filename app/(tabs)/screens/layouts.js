import { SwitchComponent, encodeData } from '/switch-framework/index.js';

const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
  .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
  .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
  .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
  .feature-list { list-style: none; padding: 0; margin: 16px 0; }
  .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
`;

export class SwDocsLayoutsScreen extends SwitchComponent {
  static screenName = 'docs/layouts';
  static path = '/docs/layouts';
  static title = 'Layouts';
  static tag = 'sw-docs-layouts-screen';
  static layout = 'tabs';

  render() {
    const stackCode = {
      title: 'app/_layout.js',
      language: 'javascript',
      code: `import { StackLayout, createState } from '/switch-framework/index.js';

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

    const globalStatesCode = {
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

    const tabCode = {
      title: 'TabLayout',
      language: 'javascript',
      code: `export class SwTabsLayout extends TabLayout {
  static screens = [SwDocsIntroScreen, SwDocsStateScreen];
  static tabs = [{ name: 'docs', path: '/docs/:id', match: ['docs'] }];
  static initialTab = 'docs';
}` 
    };

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Layouts</h2>
        <p class="section-desc">
          Switch Framework uses two layout types: <strong>StackLayout</strong> for push/pop navigation (like modals or full-screen flows) and <strong>TabLayout</strong> for tabbed views (like docs with a sidebar).
        </p>
        <h3 class="subsection" id="stack">StackLayout</h3>
        <p class="section-desc">
          Stack screens are rendered one at a time. Navigating to a new route pushes it onto the stack; <code>goBack()</code> pops. Use for: home, auth, modals, full-page flows.
        </p>
        <sw-codeblock data="${encodeData(stackCode)}"></sw-codeblock>
        <h3 class="subsection" id="globalstates">globalStates – static app data</h3>
        <p class="section-desc">
          <code>globalStates</code> holds static data that stays constant across the app – things like <code>navigate</code>, <code>go_back</code>, <code>tabsLayout</code>, <code>activeRoute</code>, <code>routeParams</code>, <code>searchParams</code>. Use <code>getState(key)</code> to read and <code>setState(obj)</code> to merge updates. This is separate from <code>createState</code>/<code>updateState</code> (SwitchStateManager) which you use for reactive app state.
        </p>
        <sw-codeblock data="${encodeData(globalStatesCode)}"></sw-codeblock>
        <h3 class="subsection" id="tabs">TabLayout</h3>
        <p class="section-desc">
          Tab screens share a container. The active tab is determined by the current route. Use for: docs, dashboards, multi-section apps.
        </p>
        <sw-codeblock data="${encodeData(tabCode)}"></sw-codeblock>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
