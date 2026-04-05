import { TabLayout, registerComponents, updateState, getState } from 'switch-framework';
import { CodeBlock } from '/components/CodeBlock.js';
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

registerComponents([CodeBlock, DocsChangelogLink, LiveView, LiveCodePreview, DocsLeftSidebarNav, DocsRightSidebarNav, DocsParamsTable, DocsPagination, DocsFeedback, DocsSearch, DocsSearchBar, TopBar, IconsBottomSheet, SwProfiles]);
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

  onMount() {
    this._bindMobileSidebar();
    this._syncMobileSidebarUI();
    this.useEffect(() => this._syncMobileSidebarUI(), ['mobile-sidebar-open']);
  }

  _syncMobileSidebarUI() {
    const open = !!getState('mobile-sidebar-open');
    this.select('.left-sidebar')?.classList.toggle('mobile-open', open);
    this.select('.mobile-sidebar-backdrop')?.classList.toggle('visible', open);
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
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
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
          grid-template-columns: 260px 1fr 240px;
          overflow: hidden;
          position: relative;
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
          position: relative;
          z-index: 1;
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
          display: none;
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

          .right-sidebar {
            display: none;
          }

          .mobile-sidebar-trigger {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 48px;
            padding: 0;
            margin: 0;
            border: none;
            border-radius: 0 12px 12px 0;
            background: var(--surface_2);
            color: var(--main_text);
            cursor: pointer;
            z-index: 40;
            box-shadow: 2px 0 8px rgba(0,0,0,0.08);
            transition: background 0.2s;
          }

          .mobile-sidebar-trigger:hover {
            background: var(--surface_hover);
          }

          .mobile-sidebar-trigger .switch_icon_chevron_right {
            transform: rotate(0deg);
            display: inline-block;
            font-size: 18px;
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
            top: 0;
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            z-index: 50;
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
            flex-direction: column;
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
