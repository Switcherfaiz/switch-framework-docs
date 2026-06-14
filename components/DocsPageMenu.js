import { SwitchComponent } from 'switch-framework';
import { readDoc } from '/utils/reader.js';
import { docPageFromScreenName } from '/utils/doc-loader.js';
import { copyText } from '/utils/clipboard.js';

export class DocsPageMenu extends SwitchComponent {
  static tag = 'sw-docs-page-menu';
  static observedAttributes = ['page'];

  onMount() {
    this._open = this._open ?? false;
    if (!this._eventsBound) {
      this._eventsBound = true;
      this._bindEvents();
    }
    this._syncMenu();
  }

  _bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const toggle = e.target?.closest?.('[data-toggle]');
      if (toggle) {
        e.stopPropagation();
        this._open = !this._open;
        this._syncMenu();
        return;
      }

      const item = e.target?.closest?.('[data-action]');
      if (!item) return;
      e.stopPropagation();
      const action = item.getAttribute('data-action');
      if (action === 'copy') this.copyPage();
      if (action === 'view-md') this.viewMarkdown();
      this._open = false;
      this._syncMenu();
    });

    if (!this._docClickBound) {
      this._docClickBound = true;
      this._onDocClick = (e) => {
        if (this.shadowRoot?.contains(e.target)) return;
        this._closeMenu();
      };
      document.addEventListener('click', this._onDocClick);
      this.addOnDestroy(() => document.removeEventListener('click', this._onDocClick));
    }
  }

  _syncMenu() {
    const panel = this.shadowRoot?.querySelector('.menu-panel');
    const chevron = this.shadowRoot?.querySelector('.chevron');
    const trigger = this.shadowRoot?.querySelector('.menu-trigger');
    if (panel) panel.classList.toggle('is-hidden', !this._open);
    if (chevron) chevron.classList.toggle('open', this._open);
    if (trigger) trigger.setAttribute('aria-expanded', this._open ? 'true' : 'false');
  }

  _closeMenu() {
    if (!this._open) return;
    this._open = false;
    this._syncMenu();
  }

  _showCopied() {
    const label = this.shadowRoot?.querySelector('.trigger-label');
    if (!label) return;
    label.textContent = 'Copied!';
    setTimeout(() => {
      if (label) label.textContent = 'Copy page';
    }, 2000);
  }

  getPage() {
    const attr = this.getAttribute('page');
    if (attr) return attr;
    return docPageFromScreenName('');
  }

  async copyPage() {
    const page = this.getPage();
    try {
      const md = await readDoc(`/docs/${page}.md`);
      const ok = await copyText(md);
      if (ok) this._showCopied();
    } catch {
      /* ignore */
    }
  }

  viewMarkdown() {
    const page = this.getPage();
    window.open(`/docs/${page}.md`, '_blank', 'noopener,noreferrer');
  }

  render() {
    return `
      <div class="menu-wrap">
        <button type="button" class="menu-trigger" data-toggle aria-expanded="false" aria-haspopup="true">
          <span class="trigger-label">Copy page</span>
          <span class="switch_icon_chevron_down chevron"></span>
        </button>
        <div class="menu-panel is-hidden" role="menu">
          <button type="button" class="menu-item" data-action="copy" role="menuitem">
            <span class="item-icon copy-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>
            </span>
            <span class="item-body">
              <span class="item-title">Copy page</span>
              <span class="item-desc">Copy this page as Markdown</span>
            </span>
          </button>
          <button type="button" class="menu-item" data-action="view-md" role="menuitem">
            <span class="item-icon" aria-hidden="true">M↓</span>
            <span class="item-body">
              <span class="item-title">View as Markdown</span>
              <span class="item-desc">Open raw .md in a new tab</span>
            </span>
            <span class="external" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          position: relative;
          z-index: 5;
        }

        * { box-sizing: border-box; font-family: inherit; }

        .menu-wrap {
          position: relative;
          display: flex;
          justify-content: flex-end;
        }

        .menu-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid var(--border_color);
          border-radius: 8px;
          background: var(--surface_2);
          color: var(--main_text);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .menu-trigger:hover {
          background: var(--surface_hover);
          border-color: var(--muted_text);
        }

        .chevron {
          font-size: 14px;
          transition: transform 0.15s;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .menu-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 280px;
          background: var(--surface_1, var(--page_background));
          border: 1px solid var(--border_color);
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
          padding: 6px;
          z-index: 20;
        }

        .menu-panel.is-hidden {
          display: none;
        }

        .menu-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--main_text);
          text-align: left;
          cursor: pointer;
          transition: background 0.12s;
        }

        .menu-item:hover {
          background: var(--surface_2);
        }

        .item-icon {
          flex-shrink: 0;
          width: 20px;
          margin-top: 2px;
          color: var(--muted_text);
          font-size: 13px;
          font-weight: 700;
          font-family: monospace;
        }

        .copy-icon {
          display: flex;
          align-items: center;
        }

        .item-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--main_text);
        }

        .item-desc {
          font-size: 12px;
          color: var(--muted_text);
          line-height: 1.4;
        }

        .external {
          flex-shrink: 0;
          display: flex;
          color: var(--muted_text);
          margin-top: 2px;
        }
      </style>
    `;
  }
}
