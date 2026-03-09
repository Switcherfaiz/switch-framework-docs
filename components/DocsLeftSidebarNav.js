export class DocsLeftSidebarNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();
    this.updateActive();

    if (globalStates?.subscribe) {
      this._unsub = globalStates.subscribe(() => this.updateActive());
    }

    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
      if (typeof navigate === 'function') navigate(route);
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
          { label: 'Introduction', to: 'intro' },
          { label: 'Installation', to: 'install' },
          { label: 'Quick Start', to: 'quickstart' }
        ]
      },
      {
        title: 'Core Concepts',
        items: [
          { label: 'Router', to: 'router' },
          { label: 'Stack', to: 'stack' },
          { label: 'Tabs', to: 'tabs' },
          { label: 'State Management', to: 'state' }
        ]
      },
      {
        title: 'API',
        items: [
          { label: 'Components', to: 'components' },
          { label: 'Hooks', to: 'hooks' },
          { label: 'Middleware', to: 'middleware' }
        ]
      }
    ];
  }

  updateActive() {
    const activeRoute = globalStates?.getState ? globalStates.getState('activeRoute') : '';
    this.shadowRoot.querySelectorAll('.nav-link').forEach(el => {
      const to = el.getAttribute('data-route');
      el.classList.toggle('active', String(activeRoute || '') === String(to));
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
          color: #6b7280;
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
          color: #374151;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s;
          cursor: pointer;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #3713ec;
        }

        .nav-link.active {
          background: #e0e7ff;
          color: #3713ec;
          font-weight: 500;
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-left-sidebar-nav')) {
  customElements.define('sw-docs-left-sidebar-nav', DocsLeftSidebarNav);
}
