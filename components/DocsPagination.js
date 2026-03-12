import { SwitchComponent } from '/switch-framework/index.js';
import { previousRoute, nextRoute, navigate, useRouteChangesSubscriber } from '/switch-framework/router/index.js';

const DOC_ORDER = ['introduction', 'installation', 'quickstart', 'cli', 'router', 'state', 'components', 'theming', 'animations', 'changelogs'];

export class DocsPagination extends SwitchComponent {
  static tag = 'sw-docs-pagination';

  connected() {
    this.updateLinks();
    this._unsub = useRouteChangesSubscriber(() => this.updateLinks());

    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const target = action === 'prev' ? previousRoute('docs', DOC_ORDER) : nextRoute('docs', DOC_ORDER);
      if (target?.route) navigate(target.route, target.params || {});
    });
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  updateLinks() {
    const prev = previousRoute('docs', DOC_ORDER);
    const next = nextRoute('docs', DOC_ORDER);
    const prevBtn = this.shadowRoot.querySelector('[data-action="prev"]');
    const nextBtn = this.shadowRoot.querySelector('[data-action="next"]');
    const prevLabel = this.shadowRoot.querySelector('.pagination-btn.prev .pagination-page');
    const nextLabel = this.shadowRoot.querySelector('.pagination-btn.next .pagination-page');

    if (prevBtn) prevBtn.disabled = !prev;
    if (nextBtn) nextBtn.disabled = !next;
    if (prevLabel) prevLabel.textContent = prev?.title || 'Previous';
    if (nextLabel) nextLabel.textContent = next?.title || 'Next';
  }

  render() {
    return `
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
          align-items: stretch;
          gap: 16px;
          margin-top: 72px;
          padding-top: 32px;
          border-top: 1px solid var(--border_color);
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          border: 1px solid var(--border_color);
          border-radius: 12px;
          background: var(--surface_2);
          color: var(--sub_text);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          max-width: 280px;
          min-height: 72px;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--surface_hover);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: var(--shadow_sm);
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-btn .switch_icon_chevron_left,
        .pagination-btn .switch_icon_chevron_right {
          font-size: 22px;
          flex-shrink: 0;
        }

        .pagination-btn.prev { margin-right: auto; }
        .pagination-btn.next { margin-left: auto; flex-direction: row-reverse; }

        .pagination-text { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
        .pagination-btn.next .pagination-text { align-items: flex-end; }

        .pagination-label {
          font-size: 11px;
          color: var(--muted_text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .pagination-page { font-size: 15px; font-weight: 600; color: var(--main_text); }

        @media (max-width: 768px) {
          .pagination { flex-direction: column; gap: 12px; }
          .pagination-btn.prev, .pagination-btn.next {
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }
          .pagination-btn.next { flex-direction: row; }
          .pagination-text { align-items: center !important; }
        }
      </style>
    `;
  }
}
