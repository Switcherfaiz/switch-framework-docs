import { StackLayout, createState, registerComponents, setGlobalComponentSheet } from 'switch-framework';
import { replace } from 'switch-framework/router';
import { SwStarterSplashScreen } from '/components/SwStarterSplashScreen.js';
import { SwTabBar } from '/components/SwTabBar.js';
import { DocsSearch } from '/components/DocsSearch.js';
import { DocsSearchBar } from '/components/DocsSearchBar.js';
import { IconsBottomSheet } from '/components/IconsBottomSheet.js';
import { TopBar } from '/components/TopBar.js';
import { DocsFooter } from '/components/DocsFooter.js';
import { CodeBlock } from '/components/CodeBlock/index.js';
import { SwProfiles } from '/components/SwProfiles.js';

registerComponents([SwStarterSplashScreen, SwTabBar, DocsSearch, DocsSearchBar, IconsBottomSheet, TopBar, DocsFooter, CodeBlock, SwProfiles]);

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

  static render() {
    return `<div class="popups" data-popups></div>`;
  }

  static styleSheet() {
    return `
      <style>

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
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
}

async function loadGlobalIconSheet() {
  try {
    const res = await fetch('/assets/icons/style.css');
    if (!res.ok) return;
    let css = await res.text();
    css = css.replace(/url\((['"]?)fonts\//g, "url($1/assets/icons/fonts/");
    await setGlobalComponentSheet(css);
  } catch (_) {}
}

loadGlobalIconSheet();

document.addEventListener('app:ready', () => {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  if (path === 'docs') replace('docs/introduction');
});
