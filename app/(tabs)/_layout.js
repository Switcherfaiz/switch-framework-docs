import { TabLayout, registerComponents } from 'switch-framework';
import { CodeBlock } from '/components/CodeBlock.js';
import { DocsChangelogLink } from '/components/DocsChangelogLink.js';
import { DocsLeftSidebarNav } from '/components/DocsLeftSidebarNav.js';
import { DocsRightSidebarNav } from '/components/DocsRightSidebarNav.js';
import { DocsParamsTable } from '/components/DocsParamsTable.js';
import { DocsPagination } from '/components/DocsPagination.js';
import { DocsFeedback } from '/components/DocsFeedback.js';
import { TopBar } from '/components/TopBar.js';

import { LiveView } from '/components/LiveView.js';
import { LiveCodePreview } from '/components/LiveCodePreview.js';
import { SwProfiles } from '/components/SwProfiles.js';

registerComponents([CodeBlock, DocsChangelogLink, LiveView, LiveCodePreview, DocsLeftSidebarNav, DocsRightSidebarNav, DocsParamsTable, DocsPagination, DocsFeedback, TopBar, SwProfiles]);
import { SwDocsIntroScreen } from './screens/introduction.js';
import { SwDocsInstallScreen } from './screens/installation/web.js';
import { SwDocsQuickstartScreen } from './screens/quickstart.js';
import { SwDocsCliScreen } from './screens/cli.js';
import { SwDocsRouterScreen } from './screens/router.js';
import { SwDocsStateScreen } from './screens/state.js';
import { SwDocsComponentsScreen } from './screens/components.js';
import { SwDocsComponentsFlatListScreen } from './screens/components-flatlist.js';
import { SwDocsThemingScreen } from './screens/theming.js';
import { SwDocsAnimationsScreen } from './screens/animations.js';
import { SwDocsSwitchIconsScreen } from './screens/switch-icons.js';
import { SwDocsTutorialReactiveButtonScreen } from './screens/tutorial/reactive-button.js';
import { SwDocsThinkingScreen } from './screens/thinking.js';
import { SwDocsGoalsScreen } from './screens/goals.js';
import { SwDocsFolderStructureScreen } from './screens/folder-structure.js';
import { SwDocsLayoutsScreen } from './screens/layouts.js';
import { SwDocsInstallationDesktopScreen } from './screens/installation/desktop.js';
import { SwDocsHooksScreen } from './screens/hooks.js';
import { SwDocsRedirectScreen } from './screens/docs-redirect.js';
import { SwDocsServerIntroScreen } from './screens/server/introduction.js';
import { SwDocsServerWebScreen } from './screens/server/web.js';
import { SwDocsServerDesktopScreen } from './screens/server/desktop.js';

export class SwTabsLayout extends TabLayout {
  static tag = 'sw-tabs-layout';
  static initialTab = 'docs';
  static tabs = [
    {
      name: 'docs',
      title: 'Docs',
      icon: 'description',
      path: '/docs/:id',
      screen: 'sw-docs-intro-screen',
      match: ['docs'],
      initialRoute: 'docs/introduction'
    }
  ];
  static options = { position: 'bottom' };
  static screens = [
    SwDocsRedirectScreen,
    SwDocsServerIntroScreen,
    SwDocsServerWebScreen,
    SwDocsServerDesktopScreen,
    SwDocsIntroScreen,
    SwDocsTutorialReactiveButtonScreen,
    SwDocsThinkingScreen,
    SwDocsGoalsScreen,
    SwDocsInstallScreen,
    SwDocsInstallationDesktopScreen,
    SwDocsQuickstartScreen,
    SwDocsCliScreen,
    SwDocsRouterScreen,
    SwDocsFolderStructureScreen,
    SwDocsLayoutsScreen,
    SwDocsStateScreen,
    SwDocsThemingScreen,
    SwDocsAnimationsScreen,
    SwDocsSwitchIconsScreen,
    SwDocsComponentsScreen,
    SwDocsComponentsFlatListScreen,
    SwDocsHooksScreen
  ];

  render() {
    return `
      <div class="layout">
        <sw-topbar></sw-topbar>
        <div class="content">
          <div class="left-sidebar">
            <sw-docs-left-sidebar-nav></sw-docs-left-sidebar-nav>
          </div>
          <div class="tab-content-area">
            <div class="tabcontainer"></div>
          </div>
          <div class="right-sidebar">
            <sw-docs-right-sidebar-nav></sw-docs-right-sidebar-nav>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style> 
      :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: inherit;
    overflow: hidden;
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
}

* {
    box-sizing: border-box;
    font-family: inherit
}


.layout {
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 240px;
  overflow: hidden;
}

.left-sidebar {
  background: var(--page_background);
  border-right: 1px solid var(--border_color);
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.right-sidebar {
  background: var(--page_background);
  border-left: 1px solid var(--border_color);
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tab-content-area {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--page_background);
}

.tabcontainer {
  z-index: 1;
  flex: 1;
  min-height: 0;
  overflow: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--border_color) transparent;
}

.tabcontainer::-webkit-scrollbar {
  width: 6px;
}

.tabcontainer::-webkit-scrollbar-track {
  background: transparent;
}

.tabcontainer::-webkit-scrollbar-thumb {
  background: var(--border_color);
  border-radius: 3px;
}

.tabcontainer::-webkit-scrollbar-thumb:hover {
  background: var(--muted_text);
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .left-sidebar,
  .right-sidebar {
    display: none;
  }
}

</style>
    `;
  }
}
