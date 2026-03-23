import { SwitchComponent, updateState, getState, useState } from 'switch-framework';
import { navigate as swNavigate } from 'switch-framework/router';
import { searchRoutes } from '/data/search-routes.js';

const STORAGE_KEY = 'switch-docs-search-history';
const MAX_HISTORY = 10;

function getSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSearchQuery(q) {
  if (!q?.trim()) return;
  const history = getSearchHistory().filter((h) => h !== q.trim());
  history.unshift(q.trim());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export class DocsSearch extends SwitchComponent {
  static tag = 'sw-docs-search';
  static { this.useState('search-open'); }

  onMount() {
    this.style.pointerEvents = getState('search-open') === true ? 'auto' : '';
    this.focusInputIfOpen();
    this.subscribeToSearchQuery();
    this.bindResultClickEvents();
    this.bindCloseEvents();
    this.bindInputEvents();
    this.bindGlobalKeys();
  }

  subscribeToSearchQuery() {
    useState('search-query', (query) => this.updateSuggestionsContent(query || ''));
  }

  updateSuggestionsContent(query) {
    const container = this.select('.search-suggestions');
    if (!container) return;
    container.innerHTML = this.buildSuggestionsHTML(query);
  }

  buildSuggestionsHTML(query) {
    const q = String(query || '').trim();
    const results = searchRoutes(query);
    const history = getSearchHistory();
    const showResults = q.length > 0;
    const showHistory = !showResults && history.length > 0;
    if (showResults) {
      const title = '<div class="suggestions-title">Results</div>';
      const items = results.length
        ? results.slice(0, 12).map((r) =>
            `<button type="button" class="search-result-item suggestion-item" data-route="${this.escapeAttr(r.route)}">${this.escapeHtml(r.title)}</button>`
          ).join('')
        : '<div class="suggestions-empty">No results found</div>';
      return title + items;
    }
    if (showHistory) {
      const title = '<div class="suggestions-title">Recent searches</div>';
      const items = history.map((h) =>
        `<button type="button" class="suggestion-item" data-query="${this.escapeAttr(h)}">${this.escapeHtml(h)}</button>`
      ).join('');
      return title + items;
    }
    return '<div class="suggestions-empty">Type to search docs. Try "state", "router", "cli"...</div>';
  }

  focusInputIfOpen() {
    if (getState('search-open') === true) {
      requestAnimationFrame(() => this.select('#search-input')?.focus());
    }
  }

  bindCloseEvents() {
    this.listener('#search-close', 'click', () => updateState('search-open', false));
    this.listener('.search-overlay', 'click', (e) => {
      if (e.target === this.select('.search-overlay')) updateState('search-open', false);
    });
  }

  bindInputEvents() {
    this.listener('#search-input', 'input', (e) => updateState('search-query', e.target.value || ''));
    this.listener('#search-input', 'keydown', (e) => {
      if (e.key === 'Escape') updateState('search-open', false);
      if (e.key === 'Enter') {
        const first = this.select('.search-result-item');
        if (first) first.click();
      }
    });
  }

  bindResultClickEvents() {
    this.listener('.search-result-item', 'click', (e) => {
      const item = e.target?.closest?.('.search-result-item');
      if (!item) return;
      const route = item.getAttribute('data-route');
      if (route) {
        saveSearchQuery(getState('search-query'));
        swNavigate(route.startsWith('/') ? route : '/' + route);
        updateState('search-open', false);
        updateState('search-query', '');
      }
    });
    this.listener('.suggestion-item', 'click', (e) => {
      const histItem = e.target?.closest?.('.suggestion-item');
      if (!histItem) return;
      const q = histItem.getAttribute('data-query');
      if (q) {
        updateState('search-query', q);
        const inp = this.select('#search-input');
        if (inp) { inp.value = q; inp.focus(); }
      }
    });
  }

  bindGlobalKeys() {
    this._keyHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        updateState('search-open', (v) => !v);
        if (!getState('search-open')) return;
        requestAnimationFrame(() => {
          const input = this.select('#search-input');
          if (input) {
            input.value = getState('search-query') || '';
            input.focus();
          }
        });
      }
      if (e.key === 'Escape') updateState('search-open', false);
    };
    document.addEventListener('keydown', this._keyHandler);
    this.addOnDestroy(() => document.removeEventListener('keydown', this._keyHandler));
  }

  render() {
    const open = getState('search-open') === true;
    const query = getState('search-query') || '';

    return `
      <div class="search-overlay ${open ? 'open' : ''}" id="search-overlay">
        <div class="search-modal">
          <div class="search-modal-header">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input id="search-input" type="text" placeholder="Search documentation..." value="${this.escapeAttr(query)}" autocomplete="off" />
            <kbd>ESC</kbd>
            <button id="search-close" class="search-close-btn" type="button" aria-label="Close">×</button>
          </div>
          <div class="search-suggestions">${this.buildSuggestionsHTML(query)}</div>
        </div>
      </div>
    `;
  }

  escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  styleSheet() {
    return `
      <style>
        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 13000;
          display: none;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
        }
        .search-overlay.open { display: flex; }
        .search-modal {
          background: var(--surface_1);
          border: 1px solid var(--border_color);
          border-radius: 12px;
          box-shadow: var(--shadow_lg);
          width: 100%;
          max-width: 560px;
          overflow: hidden;
        }
        .search-modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border_color);
        }
        .search-modal-header .search-icon { color: var(--muted_text); flex-shrink: 0; }
        .search-modal-header input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 16px;
          font-family: inherit;
          color: var(--main_text);
        }
        .search-modal-header input::placeholder { color: var(--muted_text); }
        .search-modal-header kbd {
          font-size: 11px;
          color: var(--muted_text);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border_color);
        }
        .search-close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--muted_text);
          font-size: 24px;
          cursor: pointer;
          border-radius: 6px;
          line-height: 1;
        }
        .search-close-btn:hover { background: var(--surface_hover); color: var(--main_text); }
        .search-suggestions { max-height: 280px; overflow-y: auto; padding: 8px 0; }
        .suggestions-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted_text);
          padding: 8px 16px;
        }
        .suggestion-item, .search-result-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: none;
          font-size: 14px;
          font-family: inherit;
          color: var(--main_text);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }
        .suggestion-item:hover, .search-result-item:hover { background: var(--surface_hover); }
        .suggestions-empty { padding: 16px; font-size: 14px; color: var(--muted_text); }
      </style>
    `;
  }
}
