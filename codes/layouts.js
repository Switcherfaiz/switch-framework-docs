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

export const layoutsStackAdvancedCode = {
  title: 'StackLayout with Custom Render & Styles',
  language: 'javascript',
  code: `import { StackLayout, createState, registerComponents } from 'switch-framework';

// Import your popup components
import { SwSearchModal } from '/components/SwSearchModal.js';
import { SwToastContainer } from '/components/SwToastContainer.js';

// Register your popup components
registerComponents([SwSearchModal, SwToastContainer]);

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  // Register your screens of the stack layout
  static stackScreens = [HomeScreen, ProfileScreen];
  static tabsLayout = SwTabsLayout;
  static initialRoute = 'home';

  // Custom render for complex app shells with global UI elements
  render() {
    return \`
      <div class="app-shell">
        <sw-global-header></sw-global-header>
        <div id="content" class="content-area"></div>
        <sw-bottom-nav></sw-bottom-nav>
        <!-- Any content inside data-popups is auto-extracted to app shell -->
        <div class="popups" data-popups>
          <sw-search-modal></sw-search-modal>
          <sw-toast-container></sw-toast-container>
        </div>
      </div>
    \`;
  }

  // Custom styles for the stack layout shell
  styleSheet() {
    return \`
      <style>
        :host {
          position: fixed;
          inset: 0;
          display: block;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
        }

        .app-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .content-area {
          flex: 1;
          overflow: auto;
          overflow-x: hidden;
        }

        .popups {
          position: fixed;
          inset: 0;
          z-index: 10000;
          pointer-events: none;
        }

        .popups > * {
          pointer-events: auto;
        }
      </style>
    \`;
  }

  static async init({ renderSplashscreen }) {
    renderSplashscreen('sw-splash');
    await new Promise((r) => setTimeout(r, 1500));
    return { splash: 'sw-splash' };
  }
}

export default SwStackLayout.getAppLayout();`
};

export const layoutsStackPopupsCode = {
  title: 'Global Popups that Persist Across Layouts',
  language: 'javascript',
  code: `// Any content inside a container with data-popups attribute
// is automatically extracted to the app shell level and
// stays visible even when switching to tabs layout.
// No static configuration needed – just place components inside!

export class SwStackLayout extends StackLayout {
  render() {
    return \`
      <div class="stack">
        <div id="content" class="stack-content"></div>
        <!-- All contents here are auto-extracted to app shell -->
        <div class="popups" data-popups>
          <sw-search-modal></sw-search-modal>
          <sw-icons-bottom-sheet></sw-icons-bottom-sheet>
          <sw-notification-toast></sw-notification-toast>
          <!-- Add as many popups as you need -->
        </div>
      </div>
    \`;
  }

  styleSheet() {
    return \`
      <style>
        .popups {
          position: fixed;
          inset: 0;
          z-index: 10000;
          pointer-events: none; /* Container ignores clicks */
        }
        .popups > * {
          pointer-events: auto; /* Children receive clicks */
        }
      </style>
    \`;
  }
}

// These popups are automatically moved to app shell on first render
// and remain visible even when navigating to tabs layout`
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
