import { previousRoute, nextRoute, navigate } from '/switch-framework/router/index.js';

const DOC_ORDER = ['introduction', 'installation', 'quickstart', 'cli', 'router', 'state', 'theming', 'animations', 'changelogs'];

export class DocsPagination extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();
    this.updateLinks();

    if (globalStates?.subscribe) {
      this._unsub = globalStates.subscribe(() => this.updateLinks());
    }

    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const target = action === 'prev' ? previousRoute('docs', DOC_ORDER) : nextRoute('docs', DOC_ORDER);
      if (target?.route) navigate(target.route, target.params || {});
    });
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }

  updateLinks() {
    const prev = previousRoute('docs', DOC_ORDER);
    const next = nextRoute('docs', DOC_ORDER);
    const prevBtn = this.shadowRoot.querySelector('[data-action="prev"]');
    const nextBtn = this.shadowRoot.querySelector('[data-action="next"]');
    const prevLabel = this.shadowRoot.querySelector('.pagination-btn.prev .pagination-page');
    const nextLabel = this.shadowRoot.querySelector('.pagination-btn.next .pagination-page');

    if (prevBtn) {
      prevBtn.disabled = !prev;
      prevBtn.style.opacity = prev ? '1' : '0.5';
      prevBtn.style.pointerEvents = prev ? 'auto' : 'none';
    }
    if (nextBtn) {
      nextBtn.disabled = !next;
      nextBtn.style.opacity = next ? '1' : '0.5';
      nextBtn.style.pointerEvents = next ? 'auto' : 'none';
    }
    if (prevLabel) prevLabel.textContent = prev?.title || 'Previous';
    if (nextLabel) nextLabel.textContent = next?.title || 'Next';
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="pagination">
        <button data-action="prev" class="pagination-btn prev" type="button">
          <span class="switch_icon_chevron_left"></span>
          <div class="pagination-text">
            <span class="pagination-label">Previous</span>
            <span class="pagination-page">Introduction</span>
          </div>
        </button>
        <button data-action="next" class="pagination-btn next" type="button">
          <div class="pagination-text">
            <span class="pagination-label">Next</span>
            <span class="pagination-page">Installation</span>
          </div>
          <span class="switch_icon_chevron_right"></span>
        </button>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--border_color);
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border: 1px solid var(--border_color);
          border-radius: 8px;
          background: var(--surface_1);
          color: var(--sub_text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--surface_hover);
          border-color: var(--primary);
          color: var(--primary);
        }

        .pagination-btn .switch_icon_chevron_left,
        .pagination-btn .switch_icon_chevron_right {
          font-size: 20px;
        }

        .pagination-btn.prev { margin-right: auto; }
        .pagination-btn.next { margin-left: auto; flex-direction: row-reverse; }

        .pagination-text { display: flex; flex-direction: column; align-items: flex-start; }
        .pagination-btn.next .pagination-text { align-items: flex-end; }

        .pagination-label {
          font-size: 12px;
          color: var(--muted_text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pagination-page { font-size: 14px; font-weight: 600; color: var(--main_text); }

        @media (max-width: 768px) {
          .pagination { flex-direction: column; gap: 12px; }
          .pagination-btn.prev, .pagination-btn.next { width: 100%; justify-content: center; }
          .pagination-btn.next { flex-direction: row; }
          .pagination-text { align-items: center !important; }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-pagination')) {
  customElements.define('sw-docs-pagination', DocsPagination);
}
