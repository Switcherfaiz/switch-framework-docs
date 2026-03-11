import { navigate, useRouteChangesSubscriber, getActiveRoute } from '/switch-framework/router/index.js';

export class DocsLeftSidebarNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();
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

  disconnectedCallback() {
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

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
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
          padding: 20px 0;
          height: 100%;
          overflow-y: auto;
        }

        .nav-group {
          padding: 0 16px;
          margin-bottom: 24px;
        }

        .nav-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted_text);
          margin: 0 0 8px;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-link {
          display: block;
          padding: 8px 12px;
          font-size: 14px;
          color: var(--sub_text);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s;
          cursor: pointer;
        }

        .nav-link:hover {
          background: var(--surface_hover);
          color: var(--primary);
        }

        .nav-link.active {
          background: var(--primary_light);
          color: var(--primary);
          font-weight: 600;
          position: relative;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-left-sidebar-nav')) {
  customElements.define('sw-docs-left-sidebar-nav', DocsLeftSidebarNav);
}
