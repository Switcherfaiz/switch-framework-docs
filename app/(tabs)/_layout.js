import { TabLayout, registerComponents } from '/switch-framework/index.js';
import { CodeBlock } from '/components/CodeBlock.js';
import { DocsLeftSidebarNav } from '/components/DocsLeftSidebarNav.js';
import { DocsRightSidebarNav } from '/components/DocsRightSidebarNav.js';
import { DocsParamsTable } from '/components/DocsParamsTable.js';
import { DocsPagination } from '/components/DocsPagination.js';
import { DocsFeedback } from '/components/DocsFeedback.js';
import { TopBar } from '/components/TopBar.js';

registerComponents([CodeBlock, DocsLeftSidebarNav, DocsRightSidebarNav, DocsParamsTable, DocsPagination, DocsFeedback, TopBar]);
import { SwDocsIntroScreen } from './screens/introduction.js';
import { SwDocsInstallScreen } from './screens/installation.js';
import { SwDocsQuickstartScreen } from './screens/quickstart.js';
import { SwDocsCliScreen } from './screens/cli.js';
import { SwDocsRouterScreen } from './screens/router.js';
import { SwDocsStateScreen } from './screens/state.js';
import { SwDocsComponentsScreen } from './screens/components.js';
import { SwDocsThemingScreen } from './screens/theming.js';
import { SwDocsAnimationsScreen } from './screens/animations.js';
import { SwDocsChangelogsScreen } from './screens/changelogs.js';
import { SwDocsRedirectScreen } from './screens/docs-redirect.js';

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
    SwDocsIntroScreen,
    SwDocsInstallScreen,
    SwDocsQuickstartScreen,
    SwDocsCliScreen,
    SwDocsRouterScreen,
    SwDocsStateScreen,
    SwDocsComponentsScreen,
    SwDocsThemingScreen,
    SwDocsAnimationsScreen,
    SwDocsChangelogsScreen
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
  background: var(--surface_2);
  border-right: 1px solid var(--border_color);
  overflow: hidden;
}

.right-sidebar {
  border-left: 1px solid var(--border_color);
  overflow: hidden;
}

.tab-content-area {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
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
  width: 8px;
  height: 8px;
}

.tabcontainer::-webkit-scrollbar-track {
  background: transparent;
}

.tabcontainer::-webkit-scrollbar-thumb {
  background: var(--border_color);
  border-radius: 4px;
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
