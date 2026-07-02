import { SwitchComponent, decodeData } from 'switch-framework';
import { useRouteChangesSubscriber } from 'switch-framework/router';

const HEADING_TAGS = [
  { tag: 'sw-doc-heading', level: 1, inner: '.doc-heading' },
  { tag: 'sw-doc-subheading', level: 2, inner: '.doc-subheading' },
  { tag: 'sw-doc-section-heading', level: 3, inner: '.doc-section-heading' },
  { tag: 'sw-doc-subsection-heading', level: 4, inner: '.doc-subsection-heading' }
];

export class DocsRightSidebarNav extends SwitchComponent {
  static tag = 'sw-docs-right-sidebar-nav';

  onMount() {
    this._activeId = '';
    this._bindTocClicks();
    this._setupRouteWatch();
    this._watchDocMount();
    this.buildToc();
  }

  onDestroy() {
    this._unsubRoute?.();
    this._unsubRoute = null;
    this._mountOb?.disconnect();
    this._mountOb = null;
    this._ob?.disconnect();
    this._ob = null;
  }

  _bindTocClicks() {
    this.listener('a.toc-link[data-id]', 'click', (e) => {
      e.preventDefault();
      const link = e.target.closest('a.toc-link[data-id]');
      const id = link?.getAttribute('data-id');
      if (!id) return;
      this._setActiveLink(id);
      this._scrollToHeading(id);
    });
  }

  _setActiveLink(id) {
    this._activeId = id;
    this.selectAll('.toc-link').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('data-id') === id);
    });
  }

  _scrollToHeading(id) {
    const container = this.getScrollContainer();
    const target = this._findHeadingById(id);
    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = container.scrollTop + (targetRect.top - containerRect.top) - 88;

    container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  _setupRouteWatch() {
    if (this._routeWatchBound) return;
    this._routeWatchBound = true;
    this._unsubRoute = useRouteChangesSubscriber(() => {
      this._mountOb?.disconnect();
      this._mountOb = null;
      this._activeId = '';
      setTimeout(() => {
        this._watchDocMount();
        this.buildToc();
      }, 50);
    });
  }

  getScrollContainer() {
    const layoutHost = this.getRootNode()?.host;
    const content = layoutHost?.shadowRoot?.querySelector('.content')
      ?? this.parentElement?.parentElement;
    return content?.querySelector('.tabcontainer') ?? null;
  }

  getScreenElement() {
    const container = this.getScrollContainer();
    return container?.firstElementChild ?? null;
  }

  getDocMount() {
    const screen = this.getScreenElement();
    return screen?.shadowRoot?.querySelector('#doc-mount') ?? null;
  }

  _watchDocMount() {
    const mount = this.getDocMount();
    if (!mount || this._mountOb) return;

    this._mountOb = new MutationObserver(() => {
      clearTimeout(this._tocTimer);
      this._tocTimer = setTimeout(() => this.buildToc(), 120);
    });
    this._mountOb.observe(mount, { childList: true, subtree: true });
  }

  _findHeadingById(id) {
    const mount = this.getDocMount();
    if (!mount || !id) return null;

    for (const { tag } of HEADING_TAGS) {
      for (const el of mount.querySelectorAll(tag)) {
        if (this._headingId(el) === id) return el;
      }
    }
    return mount.querySelector(`#${CSS.escape(id)}`);
  }

  _headingId(el) {
    if (el.id) return el.id;
    const raw = el.getAttribute('data');
    if (!raw) return '';
    try {
      return decodeData(raw)?.id || '';
    } catch {
      return '';
    }
  }

  _headingText(el, innerSelector) {
    const inner = el.shadowRoot?.querySelector(innerSelector);
    if (inner?.textContent?.trim()) return inner.textContent.trim();

    const raw = el.getAttribute('data');
    if (raw) {
      try {
        const html = decodeData(raw)?.html || '';
        return html.replace(/<[^>]+>/g, '').trim();
      } catch {
        /* ignore */
      }
    }
    return this._headingId(el);
  }

  getHeadings() {
    const mount = this.getDocMount();
    if (!mount) return [];

    const headings = [];
    for (const { tag, level, inner } of HEADING_TAGS) {
      mount.querySelectorAll(tag).forEach((el) => {
        const id = this._headingId(el);
        if (!id) return;
        headings.push({
          id,
          text: this._headingText(el, inner),
          level,
          el
        });
      });
    }

    return headings.sort((a, b) => {
      const pos = a.el.compareDocumentPosition(b.el);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }

  buildToc() {
    const headings = this.getHeadings();
    const list = this.select('.toc-list');
    if (!list) return;

    list.innerHTML = headings.length
      ? headings
          .map(
            (h) =>
              `<li class="toc-level-${h.level}"><a href="#${h.id}" class="toc-link" data-id="${h.id}">${this._escapeHtml(h.text)}</a></li>`
          )
          .join('')
      : '<li class="toc-empty">No sections</li>';

    if (this._activeId) this._setActiveLink(this._activeId);
    this.setupObserver();
  }

  _escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  setupObserver() {
    this._ob?.disconnect();
    const container = this.getScrollContainer();
    const headings = this.getHeadings();
    if (!container || !headings.length) return;

    this._ob = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const byTop = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        this._setActiveLink(byTop[0].target.id || this._headingId(byTop[0].target));
      },
      {
        root: container,
        rootMargin: '-96px 0px -65% 0px',
        threshold: [0, 0.1, 0.5, 1]
      }
    );

    headings.forEach(({ el }) => {
      if (el.id) this._ob.observe(el);
    });
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
          min-height: 0;
          overflow: hidden;
        }

        .right-sidebar {
          width: 100%;
          height: 100%;
          min-height: 0;
          background: var(--page_background);
          padding: 20px 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: var(--border_color) transparent;
        }

        .right-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .right-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .right-sidebar::-webkit-scrollbar-thumb {
          background: var(--border_color);
          border-radius: 3px;
        }

        .right-sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--muted_text);
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

        .toc-level-2 .toc-link { padding-left: 12px; }
        .toc-level-3 .toc-link { padding-left: 20px; font-size: 12px; }
        .toc-level-4 .toc-link { padding-left: 28px; font-size: 12px; }

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
