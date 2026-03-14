import { SwitchComponent } from '/switch-framework/index.js';
import { useRouteChangesSubscriber } from '/switch-framework/router/index.js';

export class DocsRightSidebarNav extends SwitchComponent {
  static tag = 'sw-docs-right-sidebar-nav';

  connected() {
    this._ob = null;
    this._unsubRoute = useRouteChangesSubscriber(() => {
      setTimeout(() => this.buildToc(), 50);
    });
    setTimeout(() => this.buildToc(), 50);
    this.shadowRoot.addEventListener('click', (e) => this.handleClick(e));
  }

  disconnected() {
    if (this._ob) this._ob.disconnect();
    if (this._unsubRoute) this._unsubRoute();
  }

  getScrollContainer() {
    const content = this.parentElement?.parentElement;
    return content?.querySelector('.tabcontainer') ?? null;
  }

  getScreenElement() {
    const container = this.getScrollContainer();
    return container?.firstElementChild ?? null;
  }

  getHeadings() {
    const screen = this.getScreenElement();
    if (!screen?.shadowRoot) return [];
    const section = screen.shadowRoot.querySelector('.doc-section');
    if (!section) return [];
    const nodes = section.querySelectorAll('h1[id], h2[id], h3[id]');
    return Array.from(nodes).map((el) => ({
      id: el.id,
      text: el.textContent?.trim() || el.id,
      level: parseInt(el.tagName.charAt(1), 10)
    }));
  }

  buildToc() {
    const headings = this.getHeadings();
    const list = this.shadowRoot.querySelector('.toc-list');
    if (!list) return;

    list.innerHTML = headings.length
      ? headings
          .map(
            (h) =>
              `<li><a href="#${h.id}" class="toc-link" data-id="${h.id}">${h.text}</a></li>`
          )
          .join('')
      : '<li class="toc-empty">No sections</li>';

    this.setupObserver();
  }

  setupObserver() {
    if (this._ob) this._ob.disconnect();
    const container = this.getScrollContainer();
    const screen = this.getScreenElement();
    if (!container || !screen?.shadowRoot) return;

    const headings = screen.shadowRoot.querySelectorAll(
      '.doc-section h1[id], .doc-section h2[id], .doc-section h3[id]'
    );
    if (!headings.length) return;

    this._ob = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const byTop = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        const id = byTop[0].target.id;
        this.shadowRoot.querySelectorAll('.toc-link').forEach((a) => {
          a.classList.toggle('active', a.getAttribute('data-id') === id);
        });
      },
      {
        root: container,
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach((el) => this._ob.observe(el));
  }

  handleClick(e) {
    const link = e.target?.closest?.('a.toc-link[data-id]');
    if (!link) return;
    e.preventDefault();
    const id = link.getAttribute('data-id');
    const screen = this.getScreenElement();
    const target = screen?.shadowRoot?.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    return `
      <aside class="right-sidebar">
        <div class="toc">
          <h3 class="toc-title">On this page</h3>
          <nav class="toc-nav">
            <ul class="toc-list"></ul>
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
          background: var(--page_background);
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
          margin-left: 0;
          font-size: 13px;
          color: var(--sub_text);
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.15s;
          border-left: 2px solid transparent;
        }

        .toc-link:hover {
          background: var(--surface_hover);
          color: var(--primary);
        }

        .toc-link.active {
          color: var(--primary);
          font-weight: 600;
          border-left-color: var(--primary);
          background: var(--primary_light);
        }

        .toc-empty {
          font-size: 13px;
          color: var(--muted_text);
          padding: 6px 12px;
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
