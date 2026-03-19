import { StackLayout, createState, registerComponents } from 'switch-framework';
import { SwStarterSplashScreen } from '/components/SwStarterSplashScreen.js';
import { SwTabBar } from '/components/SwTabBar.js';

registerComponents([SwStarterSplashScreen, SwTabBar]);
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

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    createState('docs-helpful-count', 0);
    createState('search-open', false);
    createState('search-query', '');
    createState('liveview-tutorial', { count: 0 });
    createState('live-edit-mode', 'view');
    createState('docs-active-route', '');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();
