export class DocsRightSidebarNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <aside class="right-sidebar">
        <div class="toc">
          <h3 class="toc-title">On this page</h3>
          <nav class="toc-nav">
            <ul class="toc-list">
              <li><a href="#overview" class="toc-link">Overview</a></li>
              <li><a href="#examples" class="toc-link">Examples</a></li>
              <li><a href="#api" class="toc-link">API Reference</a></li>
            </ul>
          </nav>
        </div>
      </aside>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 240px;
          height: 100%;
        }

        .right-sidebar {
          width: 100%;
          height: 100%;
          background: var(--surface_2);
          border-left: 1px solid var(--border_color);
          padding: 20px 0;
          overflow-y: auto;
        }

        .toc {
          padding: 0 16px;
        }

        .toc-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted_text);
          margin: 0 0 12px;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-link {
          display: block;
          padding: 6px 12px;
          font-size: 13px;
          color: var(--sub_text);
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.15s;
        }

        .toc-link:hover {
          background: var(--surface_hover);
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          :host {
            display: none;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-right-sidebar-nav')) {
  customElements.define('sw-docs-right-sidebar-nav', DocsRightSidebarNav);
}
