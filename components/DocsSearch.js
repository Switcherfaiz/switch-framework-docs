import { Modal, updateState, getState, onState, useShared } from 'switch-framework';
import { navigate as swNavigate } from 'switch-framework/router';
import { navigateDoc, isDocRoute } from '/utils/doc-nav.js';
import { searchRoutes } from '/data/search-routes.js';

const STORAGE_KEY = 'switch-docs-search-history';
const MAX_HISTORY = 10;

function history() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function remember(q) {
  if (!q?.trim()) return;
  const next = [q.trim(), ...history().filter((h) => h !== q.trim())].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isSearchHotkey(e) {
  return (e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK');
}

let hotkeyOwner = null;

function bindSearchHotkey(host) {
  if (hotkeyOwner || !host) return;
  hotkeyOwner = host;
  const onKey = (e) => {
    if (!isSearchHotkey(e)) return;
    e.preventDefault();
    e.stopPropagation();
    updateState('search-open', true);
  };
  document.addEventListener('keydown', onKey, true);
  host.addOnDestroy(() => {
    if (hotkeyOwner !== host) return;
    document.removeEventListener('keydown', onKey, true);
    hotkeyOwner = null;
  });
}

export class DocsSearch extends Modal {
  static tag = 'sw-docs-search';
  static visibleState = 'search-open';
  static animationType = 'fade';
  static presentationStyle = 'centered';
  static interceptBack = true;
  static transparent = false;

  onMount() {
    bindSearchHotkey(this);

    onState('search-query', (query) => {
      const box = this.select('.search-suggestions');
      if (box) box.innerHTML = this.suggestions(query || '');
    });
    onState('search-open', (open) => {
      if (!open) return;
      requestAnimationFrame(() => this.select('#search-input')?.focus());
    });

    this.listener('#search-close', 'click', () => this.dismiss());
    this.listener('#search-input', 'input', (e) => updateState('search-query', e.target.value || ''));
    this.listener('#search-input', 'keydown', (e) => {
      if (e.key === 'Enter') this.select('.search-result-item')?.click();
    });
    this.listener('.search-result-item', 'click', (e) => {
      const route = e.target?.closest?.('.search-result-item')?.getAttribute('data-route');
      if (!route) return;
      remember(getState('search-query'));
      const path = route.replace(/^\//, '');
      if (isDocRoute(path)) navigateDoc(path);
      else swNavigate(path);
      this.dismiss();
      updateState('search-query', '');
    });
    this.listener('.suggestion-item', 'click', (e) => {
      const q = e.target?.closest?.('.suggestion-item')?.getAttribute('data-query');
      if (!q) return;
      updateState('search-query', q);
      const input = this.select('#search-input');
      if (input) { input.value = q; input.focus(); }
    });
  }

  suggestions(query) {
    const q = String(query || '').trim();
    if (q) {
      const results = searchRoutes(query).slice(0, 12);
      const items = results.length
        ? results.map((r) => `<button type="button" class="search-result-item suggestion-item" data-route="${escapeAttr(r.route)}">${escapeHtml(r.title)}</button>`).join('')
        : '<div class="suggestions-empty">No results found</div>';
      return `<div class="suggestions-title">Results</div>${items}`;
    }
    const recent = history();
    if (recent.length) {
      const items = recent.map((h) => `<button type="button" class="suggestion-item" data-query="${escapeAttr(h)}">${escapeHtml(h)}</button>`).join('');
      return `<div class="suggestions-title">Recent searches</div>${items}`;
    }
    return '<div class="suggestions-empty">Type to search docs. Try "state", "router", "cli"...</div>';
  }

  render() {
    const [query] = useShared('search-query', '');
    return `
      <div class="search-modal">
        <div class="search-modal-header">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
            <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input id="search-input" data-modal-autofocus type="text" placeholder="Search documentation..." value="${escapeAttr(query)}" autocomplete="off" />
          <kbd>ESC</kbd>
          <button id="search-close" class="search-close-btn" type="button" aria-label="Close">×</button>
        </div>
        <div class="search-suggestions">${this.suggestions(query)}</div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        .search-modal {
          background: var(--surface_1);
          border: 1px solid var(--border_color);
          border-radius: 16px;
          box-shadow: var(--shadow_lg);
          width: 100%;
          max-width: 640px;
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
