import { SwitchComponent } from 'switch-framework';
import { navigate, useRouteChangesSubscriber, getActiveRoute } from 'switch-framework/router';

export class DocsLeftSidebarNav extends SwitchComponent {
  static tag = 'sw-docs-left-sidebar-nav';

  constructor() {
    super();
    this._expanded = {};
  }

  getExpandedStateForRoute(activeRoute) {
    const route = String(activeRoute || '');
    const routeMap = {
      'quick-start': ['docs/introduction', 'docs/tutorial/reactive-button', 'docs/thinking', 'docs/goals'],
      installation: ['docs/cli', 'docs/installation/web', 'docs/installation/desktop'],
      'app-structure': ['docs/folder-structure', 'docs/layouts', 'docs/router', 'docs/state', 'docs/theming', 'docs/animations', 'docs/switch-icons'],
      components: ['docs/components', 'docs/components/flatlist', 'docs/hooks'],
      backend: ['docs/server/introduction', 'docs/server/web', 'docs/server/desktop']
    };
    const updates = {};
    for (const [key, routes] of Object.entries(routeMap)) {
      const containsActive = routes.some((r) => route === r || route.startsWith(r + '/'));
      if (containsActive) updates[key] = true;
    }
    return { ...(this._expanded || {}), ...updates };
  }

  connected() {
    const activeRoute = getActiveRoute();
    this._expanded = this.getExpandedStateForRoute(activeRoute);
    if (Object.keys(this._expanded).length === 0) {
      this._expanded = { 'quick-start': true };
    }
    this.updateActive();
    this._unsub = useRouteChangesSubscriber(() => {
      const route = getActiveRoute();
      this._expanded = { ...this._expanded, ...this.getExpandedStateForRoute(route) };
      this._renderToShadow();
      this.updateActive();
    });

    this.shadowRoot.addEventListener('click', (e) => {
      const expandBtn = e.target?.closest?.('[data-expand]');
      if (expandBtn) {
        e.preventDefault();
        const key = expandBtn.getAttribute('data-expand');
        this._expanded[key] = !this._expanded[key];
        this._renderToShadow();
        return;
      }
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      navigate(route);
    });
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  getNavItems() {
    return [
      {
        title: 'GET STARTED',
        items: [
          {
            label: 'Quick start',
            expandable: true,
            key: 'quick-start',
            children: [
              { label: 'Introduction', to: 'docs/introduction' },
              { label: 'Tutorial: Reactive button', to: 'docs/tutorial/reactive-button' },
              { label: 'Thinking in Switch Framework', to: 'docs/thinking' },
              { label: 'Switch Framework Main Goals', to: 'docs/goals' }
            ]
          },
          {
            label: 'Installation',
            expandable: true,
            key: 'installation',
            children: [
              { label: 'cli', to: 'docs/cli' },
              { label: 'Web app installation', to: 'docs/installation/web' },
              { label: 'Desktop app installation', to: 'docs/installation/desktop' }
            ]
          }
        ]
      },
      {
        title: 'CORE CONCEPTS',
        items: [
          {
            label: 'App Structure',
            expandable: true,
            key: 'app-structure',
            children: [
              { label: 'Folder Structure', to: 'docs/folder-structure' },
              { label: 'Layouts', to: 'docs/layouts' },
              { label: 'Routing', to: 'docs/router' },
              { label: 'State Management', to: 'docs/state' },
              { label: 'Theming', to: 'docs/theming' },
              { label: 'Animations', to: 'docs/animations' },
              { label: 'Switch Icons', to: 'docs/switch-icons' }
            ]
          }
        ]
      },
      {
        title: 'API',
        items: [
          {
            label: 'Components',
            expandable: true,
            key: 'components',
            children: [
              { label: 'Component Setup', to: 'docs/components' },
              { label: 'Flatlists', to: 'docs/components/flatlist' },
              { label: 'Hooks', to: 'docs/hooks' }
            ]
          }
        ]
      },
      {
        title: 'BACKEND',
        items: [
          {
            label: 'Server',
            expandable: true,
            key: 'backend',
            children: [
              { label: 'Introduction', to: 'docs/server/introduction' },
              { label: 'Web Server', to: 'docs/server/web' },
              { label: 'Desktop Server', to: 'docs/server/desktop' }
            ]
          }
        ]
      }
    ];
  }

  updateActive() {
    const activeRoute = getActiveRoute();
    this.shadowRoot?.querySelectorAll('.nav-link').forEach(el => {
      const to = el.getAttribute('data-route');
      const isActive = String(activeRoute || '') === String(to);
      el.classList.toggle('active', isActive);
    });
  }

  renderItem(item, indent = false) {
    if (item.expandable && item.children) {
      const key = item.key || item.label.toLowerCase().replace(/\s+/g, '-');
      const expanded = !!(this._expanded || {})[key];
      return `
        <li class="nav-expandable">
          <button type="button" class="nav-expand-btn" data-expand="${key}" aria-expanded="${expanded}">
            <span class="nav-expand-label">${item.label}</span>
            <span class="nav-chevron ${expanded ? 'expanded' : ''}"><span class="switch_icon_chevron_right"></span></span>
          </button>
          <ul class="nav-sublist ${expanded ? 'expanded' : ''}">
            ${item.children.map((child) => `
              <li>
                <a href="#" data-route="${child.to}" class="nav-link">${child.label}</a>
              </li>
            `).join('')}
          </ul>
        </li>
      `;
    }
    return `
      <li>
        <a href="#" data-route="${item.to}" class="nav-link ${indent ? 'nav-sublink' : ''}">${item.label}</a>
      </li>
    `;
  }

  render() {
    const navItems = this.getNavItems();

    return `
      <nav class="docs-nav">
        ${navItems.map(({ title, items }) => `
          <div class="nav-group">
            <h3 class="nav-title">${title}</h3>
            <ul class="nav-list">
              ${items.map((item) => this.renderItem(item)).join('')}
            </ul>
          </div>
        `).join('')}
      </nav>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .docs-nav {
          padding: 24px 12px 48px 12px;
          height: 100%;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: var(--border_color) transparent;
        }

        .docs-nav::-webkit-scrollbar {
          width: 6px;
        }

        .docs-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .docs-nav::-webkit-scrollbar-thumb {
          background: var(--border_color);
          border-radius: 3px;
        }

        .docs-nav::-webkit-scrollbar-thumb:hover {
          background: var(--muted_text);
        }

        .nav-group {
          padding: 0 12px;
          margin-bottom: 28px;
        }

        .nav-group:last-child {
          margin-bottom: 0;
        }

        .nav-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted_text);
          margin: 0 0 12px;
          padding-left: 12px;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-list li {
          margin-bottom: 2px;
        }

        .nav-link {
          display: block;
          padding: 10px 14px;
          font-size: 13px;
          color: var(--sub_text);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .nav-link:hover {
          background: var(--surface_hover);
          color: var(--primary);
        }

        .nav-link.active {
          position: relative;
          background: transparent;
          color: var(--primary);
          font-weight: 600;
          border-color: transparent;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
        }

        .nav-expandable {
          margin-bottom: 2px;
        }

        .nav-expand-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--sub_text);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .nav-expand-btn:hover {
          background: var(--surface_hover);
          color: var(--primary);
        }

        .nav-expand-label {
          font-weight: 700;
          font-size: 14px;
        }

        .nav-chevron {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--muted_text);
          transition: transform 0.2s ease;
        }

        .nav-chevron.expanded {
          transform: rotate(90deg);
        }

        .nav-sublist {
          list-style: none;
          padding: 0 0 0 8px;
          margin: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.2s ease;
        }

        .nav-sublist.expanded {
          max-height: 400px;
        }

        .nav-sublist li {
          margin-bottom: 2px;
        }

        .nav-sublist .nav-link {
          padding: 8px 12px 8px 20px;
          font-weight: 600;
          font-size: 12px;
        }
      </style>
    `;
  }
}
