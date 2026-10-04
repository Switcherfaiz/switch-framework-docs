import { TabLayout, registerComponents, updateState, getState, syncOverlayBack } from 'switch-framework';
import { getActiveRoute, useRouteChangesSubscriber, replace } from 'switch-framework/router';
import { CodeBlock } from '/components/CodeBlock/index.js';
import { DocsChangelogLink } from '/components/DocsChangelogLink.js';
import { DocsLeftSidebarNav } from '/components/DocsLeftSidebarNav.js';
import { DocsRightSidebarNav } from '/components/DocsRightSidebarNav.js';
import { DocsParamsTable } from '/components/DocsParamsTable.js';
import { DocsPagination } from '/components/DocsPagination.js';
import { DocsFeedback } from '/components/DocsFeedback.js';
import { DocsSearch } from '/components/DocsSearch.js';
import { DocsSearchBar } from '/components/DocsSearchBar.js';
import { TopBar } from '/components/TopBar.js';
import { IconsBottomSheet } from '/components/IconsBottomSheet.js';

import { LiveView } from '/components/LiveView.js';
import { LiveCodePreview } from '/components/LiveCodePreview.js';
import { SwProfiles } from '/components/SwProfiles.js';
import {
  DocHeading,
  DocSubheading,
  DocSectionHeading,
  DocSubsectionHeading,
  DocParagraph,
  DocCallout,
  DocListItem,
  DocLoader,
  DocDivider
} from '/components/DocContent.js';
import { DocsPageMenu } from '/components/DocsPageMenu.js';

registerComponents([
  CodeBlock,
  DocsChangelogLink,
  LiveView,
  LiveCodePreview,
  DocsLeftSidebarNav,
  DocsRightSidebarNav,
  DocsParamsTable,
  DocsPagination,
  DocsFeedback,
  DocsSearch,
  DocsSearchBar,
  TopBar,
  IconsBottomSheet,
  SwProfiles,
  DocHeading,
  DocSubheading,
  DocSectionHeading,
  DocSubsectionHeading,
  DocParagraph,
  DocCallout,
  DocListItem,
  DocLoader,
  DocDivider,
  DocsPageMenu
]);
import { SwDocsIntroScreen } from './screens/introduction.js';
import { SwDocsInstallScreen } from './screens/installation/web.js';
import { SwDocsQuickstartScreen } from './screens/quickstart.js';
import { SwDocsCliScreen } from './screens/cli.js';
import { SwDocsRouterScreen } from './screens/router.js';
import { SwDocsStateScreen } from './screens/state.js';
import { SwDocsComponentsScreen } from './screens/components.js';
import { SwDocsComponentsFlatListScreen } from './screens/components-flatlist.js';
import { SwDocsComponentsScrollViewScreen } from './screens/components-scrollview.js';
import { SwDocsComponentsModalScreen } from './screens/components-modal.js';
import { SwDocsComponentsElectronTitleBarScreen } from './screens/components-electron-titlebar.js';
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
import { SwDocsDataFlowPropsScreen } from './screens/data-flow/props.js';
import { SwDocsExternalDependenciesScreen } from './screens/external-dependencies.js';
import { SwDocsExternalDependenciesCreatingScreen } from './screens/external-dependencies/creating.js';
import { SwDocsExternalDependenciesPackageJsonScreen } from './screens/external-dependencies/package-json.js';
import { SwDocsServerIntroScreen } from './screens/server/introduction.js';
import { SwDocsServerWebScreen } from './screens/server/web.js';
import { SwDocsServerDesktopScreen } from './screens/server/desktop.js';
import { SwDocsServerDesktopMultiScreen } from './screens/server/desktop-multi-server.js';
import { SwDocsServerDesktopSplashScreen } from './screens/server/desktop-splash.js';
import { SwDocsServerDesktopAuthScreen } from './screens/server/desktop-auth.js';
import { SwDocsServerDesktopElectronPackageScreen } from './screens/server/desktop-electron-package.js';

registerComponents([
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
  SwDocsComponentsScrollViewScreen,
  SwDocsComponentsModalScreen,
  SwDocsComponentsElectronTitleBarScreen,
  SwDocsHooksScreen,
  SwDocsDataFlowPropsScreen,
  SwDocsExternalDependenciesScreen,
  SwDocsExternalDependenciesCreatingScreen,
  SwDocsExternalDependenciesPackageJsonScreen,
  SwDocsServerIntroScreen,
  SwDocsServerWebScreen,
  SwDocsServerDesktopScreen,
  SwDocsServerDesktopMultiScreen,
  SwDocsServerDesktopSplashScreen,
  SwDocsServerDesktopAuthScreen,
  SwDocsServerDesktopElectronPackageScreen,
]);

export class SwTabsLayout extends TabLayout {
  static tag = 'sw-tabs-layout';
  static initialTab = 'docs';
  static tabs = [
    {
      name: 'docs',
      title: 'Docs',
      icon: 'description',
      match: ['docs'],
      initialRoute: 'docs/introduction'
    }
  ];
  static options = { position: 'bottom' };
  static screens = [
    SwDocsServerIntroScreen,
    SwDocsServerWebScreen,
    SwDocsServerDesktopScreen,
    SwDocsServerDesktopMultiScreen,
    SwDocsServerDesktopSplashScreen,
    SwDocsServerDesktopAuthScreen,
    SwDocsServerDesktopElectronPackageScreen,
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
    SwDocsComponentsScrollViewScreen,
    SwDocsComponentsModalScreen,
    SwDocsComponentsElectronTitleBarScreen,
    SwDocsHooksScreen,
    SwDocsDataFlowPropsScreen,
    SwDocsExternalDependenciesScreen,
    SwDocsExternalDependenciesCreatingScreen,
    SwDocsExternalDependenciesPackageJsonScreen
  ];

  onMount() {
    this._redirectBareDocsRoute();
    requestAnimationFrame(() => this._ensureDocRouteRendered());
    if (!this._docsRouteSub) {
      this._docsRouteSub = useRouteChangesSubscriber(() => {
        this._redirectBareDocsRoute();
        requestAnimationFrame(() => this._ensureDocRouteRendered());
      });
      this.addOnDestroy(() => { this._docsRouteSub?.(); });
    }
    this._bindMobileSidebar();
    this._syncMobileSidebarUI();
    this.useEffect(() => this._syncMobileSidebarUI(), ['mobile-sidebar-open']);
    this.addOnDestroy(() => syncOverlayBack(this, false));
  }

  _redirectBareDocsRoute() {
    const path = (window.location.pathname || '').replace(/^\//, '').replace(/\/$/, '');
    const route = getActiveRoute();
    if (path === 'docs' || route === 'docs') {
      replace('docs/introduction');
    }
  }

  _ensureDocRouteRendered() {
    const route = getActiveRoute();
    if (!route || !String(route).startsWith('docs/')) return;
    const tab = this.getContentContainer();
    if (!tab) return;
    if (!tab.firstElementChild) {
      replace(route);
    }
  }

  _syncMobileSidebarUI() {
    const open = !!getState('mobile-sidebar-open');
    this.select('.left-sidebar')?.classList.toggle('mobile-open', open);
    this.select('.mobile-sidebar-backdrop')?.classList.toggle('visible', open);
    syncOverlayBack(this, open, () => updateState('mobile-sidebar-open', false));
  }

  _bindMobileSidebar() {
    if (this._mobileSidebarBound) return;
    this._mobileSidebarBound = true;
    this.shadowRoot.addEventListener('click', (e) => {
      const trigger = e.target?.closest?.('#mobile-sidebar-trigger');
      const backdrop = e.target?.closest?.('.mobile-sidebar-backdrop');
      const closeBtn = e.target?.closest?.('#mobile-sidebar-close');
      if (trigger) {
        e.preventDefault();
        updateState('mobile-sidebar-open', (v) => !v);
      }
      if (backdrop || closeBtn) {
        e.preventDefault();
        updateState('mobile-sidebar-open', false);
      }
    });
  }

  render() {
    return `
      <div class="layout">
        <sw-topbar></sw-topbar>
        <div class="content">
          <button id="mobile-sidebar-trigger" class="mobile-sidebar-trigger" type="button" aria-label="Open sidebar">
            <span class="switch_icon_chevron_right"></span>
          </button>
          <div class="left-sidebar">
            <div class="mobile-sidebar-header">
              <button id="mobile-sidebar-close" class="mobile-sidebar-close" type="button" aria-label="Close sidebar">
                <span class="switch_icon_chevron_left"></span>
              </button>
            </div>
            <sw-docs-left-sidebar-nav></sw-docs-left-sidebar-nav>
          </div>
          <div class="mobile-sidebar-backdrop" aria-hidden="true"></div>
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
        @import '/assets/icons/style.css';

        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: inherit;
          overflow: hidden;
          font-family: var(--font);
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
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
          grid-template-columns: 248px minmax(0, 1fr) 320px;
          overflow: hidden;
          position: relative;
        }

        @media (min-width: 1400px) {
          .content {
            grid-template-columns: 260px minmax(0, 1fr) 360px;
          }
        }

        .left-sidebar {
          background: var(--page_background);
          border-right: 1px solid var(--border_color);
          overflow: hidden;
          min-height: 0;
          display: flex;
          flex-direction: column;
          grid-column: 1;
          grid-row: 1;
          position: relative;
          z-index: 2;
        }

        .mobile-sidebar-backdrop {
          display: none;
          pointer-events: none;
          grid-column: 1 / -1;
          grid-row: 1;
        }

        .tab-content-area {
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
          background: var(--page_background);
          grid-column: 2;
          grid-row: 1;
          position: relative;
          z-index: 1;
        }

        .right-sidebar {
          background: var(--page_background);
          border-left: 1px solid var(--border_color);
          overflow: hidden;
          min-height: 0;
          display: flex;
          flex-direction: column;
          grid-column: 3;
          grid-row: 1;
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

        .mobile-sidebar-trigger {
          display: none !important;
        }

        .mobile-sidebar-backdrop {
          display: none;
          pointer-events: none;
        }

        .mobile-sidebar-close {
          display: none;
        }

        @media (max-width: 1024px) {
          .content {
            grid-template-columns: 1fr;
          }

          .left-sidebar:not(.mobile-open) {
            display: none;
          }

          .tab-content-area {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            min-width: 0;
          }

          .right-sidebar {
            display: none;
          }

          .mobile-sidebar-trigger {
            display: none !important;
          }

          .mobile-sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 45;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s, visibility 0.2s;
          }

          .mobile-sidebar-backdrop.visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .left-sidebar.mobile-open {
            display: flex;
            position: fixed;
            left: 0;
            top: var(--header_height, 56px);
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            z-index: 50;
            background: var(--page_background);
            box-shadow: var(--shadow_lg);
            flex-direction: column;
            border-right: 1px solid var(--border_color);
          }

          .mobile-sidebar-header {
            flex-shrink: 0;
            padding: 12px;
            border-bottom: 1px solid var(--border_color);
          }

          .mobile-sidebar-close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            padding: 0;
            border: none;
            border-radius: 8px;
            background: var(--surface_2);
            color: var(--main_text);
            cursor: pointer;
          }

          .mobile-sidebar-close:hover {
            background: var(--surface_hover);
          }
        }
      </style>
    `;
  }
}
