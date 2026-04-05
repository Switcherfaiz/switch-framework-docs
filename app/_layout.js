import { StackLayout, createState, registerComponents } from 'switch-framework';
import { SwStarterSplashScreen } from '/components/SwStarterSplashScreen.js';
import { SwTabBar } from '/components/SwTabBar.js';
import { DocsSearch } from '/components/DocsSearch.js';
import { IconsBottomSheet } from '/components/IconsBottomSheet.js';

registerComponents([SwStarterSplashScreen, SwTabBar, DocsSearch, IconsBottomSheet]);
import { SwIndexScreen } from './index.js';
import NotFoundScreen from './+not-found.js';
import { SwChangelogsScreen } from './changelogs.js';
import { SwAuthorsScreen } from './authors.js';
import { SwAboutScreen } from './about.js';
import { SwPrivacyPolicyScreen } from './privacy-policy.js';
import { SwTermsOfServiceScreen } from './terms-of-service.js';
import { SwLicenseScreen } from './license.js';
import { SwTabsLayout } from './(tabs)/_layout.js';

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, SwChangelogsScreen, SwAuthorsScreen, SwAboutScreen, SwPrivacyPolicyScreen, SwTermsOfServiceScreen, SwLicenseScreen, NotFoundScreen];
  static tabsLayout = SwTabsLayout;

  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  render() {
    return `
      <div class="stack">
        <div id="content" class="stack-content"></div>
        <div class="popups" data-popups>
          <sw-docs-search></sw-docs-search>
          <sw-icons-bottom-sheet></sw-icons-bottom-sheet>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          position: fixed;
          inset: 0;
          display: block;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .stack {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .stack-content {
          height: 100%;
          width: 100%;
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
          pointer-events: none;
        }
      </style>
    `;
  }

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    createState('docs-helpful-count', 0);
    createState('search-open', false);
    createState('search-query', '');
    createState('liveview-tutorial', { count: 0 });
    createState('live-edit-mode', 'view');
    createState('docs-active-route', '');
    createState('icon-sheet', { open: false, iconKey: null, index: 0, filteredKeys: [] });
    createState('icons-filter', { query: '', displayCount: 96 });
    createState('mobile-sidebar-open', false);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
  
}

export default SwStackLayout.getAppLayout();
