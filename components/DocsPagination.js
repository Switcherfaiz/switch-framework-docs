import { SwitchComponent } from 'switch-framework';
import { navigate, getActiveRoute, useRouteChangesSubscriber } from 'switch-framework/router';
import { DOC_ORDER } from '/data/search-routes.js';

export class DocsPagination extends SwitchComponent {
  static tag = 'sw-docs-pagination';

  onMount() {
    this.setupRouteSubscription();
    this.bindPaginationEvents();
  }

  setupRouteSubscription() {
    if (this._routeSubbed) return;
    this._routeSubbed = true;
    this._unsub = useRouteChangesSubscriber(() => this.rerender());
    this.addOnDestroy(() => { this._unsub?.(); });
  }

  bindPaginationEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button[data-action]');
      if (!btn || btn.disabled) return;
      const action = btn.getAttribute('data-action');
      const { prev, next } = this.getPrevNext();
      const target = action === 'prev' ? prev : next;
      if (target) navigate(target.route);
    });
  }

  getPrevNext() {
    const active = getActiveRoute() || '';
    const idx = DOC_ORDER.findIndex((r) => r.route === active);
    const prev = idx > 0 ? DOC_ORDER[idx - 1] : null;
    const next = idx >= 0 && idx < DOC_ORDER.length - 1 ? DOC_ORDER[idx + 1] : null;
    return { prev, next };
  }

  render() {
    const { prev, next } = this.getPrevNext();

    return `
      <div class="pagination">
        <button data-action="prev" class="pagination-btn prev" type="button" ${prev ? '' : 'disabled'}>
          <span class="switch_icon_chevron_left"></span>
          <div class="pagination-text">
            <span class="pagination-label">Previous</span>
            <span class="pagination-page">${prev ? this.escapeHtml(prev.title) : 'Previous'}</span>
          </div>
        </button>
        <button data-action="next" class="pagination-btn next" type="button" ${next ? '' : 'disabled'}>
          <div class="pagination-text">
            <span class="pagination-label">Next</span>
            <span class="pagination-page">${next ? this.escapeHtml(next.title) : 'Next'}</span>
          </div>
          <span class="switch_icon_chevron_right"></span>
        </button>
      </div>
    `;
  }

  escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
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
