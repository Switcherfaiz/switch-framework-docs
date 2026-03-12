import { SwitchComponent } from '/switch-framework/index.js';
import { navigate, useRouteChangesSubscriber, getActiveRoute } from '/switch-framework/router/index.js';

export class DocsLeftSidebarNav extends SwitchComponent {
  static tag = 'sw-docs-left-sidebar-nav';

  connected() {
    this.updateActive();
    this._unsub = useRouteChangesSubscriber(() => this.updateActive());

    this.shadowRoot.addEventListener('click', (e) => {
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
        title: 'Getting Started',
        items: [
          { label: 'Introduction', to: 'docs/introduction' },
          { label: 'Installation', to: 'docs/installation' },
          { label: 'Quick Start', to: 'docs/quickstart' },
          { label: 'CLI (create-switch-framework-app)', to: 'docs/cli' }
        ]
      },
      {
        title: 'Core Concepts',
        items: [
          { label: 'Router', to: 'docs/router' },
          { label: 'State Management', to: 'docs/state' },
          { label: 'Theming', to: 'docs/theming' },
          { label: 'Animations', to: 'docs/animations' }
        ]
      },
      {
        title: 'API',
        items: [
          { label: 'Components', to: 'docs/components' },
          { label: 'Hooks', to: 'docs/hooks' },
          { label: 'Middleware', to: 'docs/middleware' }
        ]
      },
      {
        title: 'Reference',
        items: [
          { label: 'Changelogs', to: 'docs/changelogs' }
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

  render() {
    const navItems = this.getNavItems();

    return `
      <nav class="docs-nav">
        ${navItems.map(({ title, items }) => `
          <div class="nav-group">
            <h3 class="nav-title">${title}</h3>
            <ul class="nav-list">
              ${items.map(({ label, to }) => `
                <li>
                  <a href="#" data-route="${to}" class="nav-link">${label}</a>
                </li>
              `).join('')}
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
        }

        .docs-nav {
          padding: 24px 12px;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: thin;
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
          background: var(--primary_light);
          color: var(--primary);
          font-weight: 600;
          border-color: rgba(var(--primary-rgb, 55, 19, 236), 0.2);
          box-shadow: var(--shadow_sm);
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
      </style>
    `;
  }
}
