import { SwitchComponent, useState, updateState, getState } from '/switch-framework/index.js';
import { navigate as swNavigate } from '/switch-framework/router/index.js';
import { getTheme, changeTheme } from '/switch-framework/themes/index.js';

const SEARCH_STORAGE_KEY = 'switch-docs-search-history';
const MAX_HISTORY = 10;

function getSearchHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSearchQuery(q) {
  if (!q || !q.trim()) return;
  const history = getSearchHistory().filter((h) => h !== q.trim());
  history.unshift(q.trim());
  localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export class TopBar extends SwitchComponent {
  static tag = 'sw-topbar';

  connected() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      swNavigate(route);
    });

    const startFreeBtn = this.shadowRoot.querySelector('#topbar-start-free');
    if (startFreeBtn) {
      startFreeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        swNavigate('docs/introduction');
      });
    }

    this.updateThemeIcon();
    this._themeHandler = () => this.updateThemeIcon();
    document.addEventListener('theme:change', this._themeHandler);

    const [searchOpen, unsubSearch] = useState('search-open', () => this._renderToShadow());
    this._unsubSearch = unsubSearch;

    this._keyHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const wasOpen = getState('search-open');
        updateState('search-open', (v) => !v);
        if (!wasOpen) {
          requestAnimationFrame(() => {
            const input = this.shadowRoot.querySelector('#search-input');
            if (input) {
              input.focus();
              input.value = '';
            }
          });
        }
      }
      if (e.key === 'Escape') {
        updateState('search-open', false);
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    this.shadowRoot.addEventListener('click', (e) => {
      const themeBtn = e.target?.closest?.('#theme-toggle');
      if (themeBtn) {
        e.preventDefault();
        const next = getTheme() === 'dark' ? 'light' : 'dark';
        changeTheme(next);
        this.updateThemeIcon();
        return;
      }
      const trigger = e.target?.closest?.('#search-trigger');
      if (trigger) {
        e.preventDefault();
        updateState('search-open', true);
        requestAnimationFrame(() => {
          this.shadowRoot.querySelector('#search-input')?.focus();
        });
        return;
      }
      const closeBtn = e.target?.closest?.('#search-close');
      if (closeBtn) {
        updateState('search-open', false);
        return;
      }
      const overlay = e.target?.closest?.('.search-overlay');
      if (overlay && !e.target.closest('.search-modal')) {
        updateState('search-open', false);
        return;
      }
      const suggestion = e.target?.closest?.('.suggestion-item');
      if (suggestion) {
        const q = suggestion.getAttribute('data-query');
        if (q) {
          const input = this.shadowRoot.querySelector('#search-input');
          if (input) input.value = q;
          saveSearchQuery(q);
          updateState('search-open', false);
        }
      }
    });

    this.shadowRoot.addEventListener('keydown', (e) => {
      const input = e.target?.closest?.('#search-input');
      if (!input || e.target !== input) return;
      if (e.key === 'Enter') {
        const q = input.value?.trim();
        if (q) {
          saveSearchQuery(q);
          updateState('search-open', false);
        }
      }
    });
  }

  disconnected() {
    if (this._themeHandler) document.removeEventListener('theme:change', this._themeHandler);
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this._unsubSearch) this._unsubSearch();
  }

  updateThemeIcon() {
    const sun = this.shadowRoot?.querySelectorAll('.icon-sun');
    const moon = this.shadowRoot?.querySelectorAll('.icon-moon');
    const isDark = getTheme() === 'dark';
    sun?.forEach((el) => { el.style.display = isDark ? 'none' : 'block'; });
    moon?.forEach((el) => { el.style.display = isDark ? 'block' : 'none'; });
  }

  getNavLinks() {
    return [
      { label: 'Docs', to: 'docs/introduction' },
      { label: 'Components', to: 'docs/components' },
      { label: 'Blog', to: '/blog' },
      { label: 'Showcase', to: '/showcase' }
    ];
  }

  getSearchOpen() {
    return getState('search-open') === true;
  }

  render() {
    const navLinks = this.getNavLinks();
    const searchOpen = this.getSearchOpen();
    const history = getSearchHistory();
    const filtered = history;

    return `
      <header class="topbar">
        <div class="left-section">
          <a href="#" data-route="index" class="logo-section logo-link">
            <div class="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7H7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13H17C18.6569 13 20 14.3431 20 16C20 17.6569 18.6569 19 17 19H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="7" cy="10" r="2" fill="currentColor"/>
                <circle cx="17" cy="16" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h2 class="logo-text">Switch Framework</h2>
          </a>
          <nav class="nav-links">
            ${navLinks.map(({ label, to }) => `
              <a href="#" data-route="${to}" class="nav-link">${label}</a>
            `).join('')}
          </nav>
        </div>
        <div class="right-section">
          <button id="search-trigger" class="search-trigger" type="button">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>
          <div class="button-group">
            <button id="topbar-start-free" class="btn-secondary">Start for free</button>
            <a href="https://github.com/Switcherfaiz/switch-framework-docs" target="_blank" rel="noopener noreferrer" class="btn-secondary btn-github">GitHub</a>
            <button id="theme-toggle" class="btn-icon" type="button" aria-label="Toggle theme">
              <svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
                <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div class="search-overlay ${searchOpen ? 'open' : ''}" id="search-overlay">
        <div class="search-modal">
          <div class="search-modal-header">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input id="search-input" type="text" placeholder="Search documentation..." autocomplete="off" />
            <kbd>ESC</kbd>
            <button id="search-close" class="search-close-btn" type="button" aria-label="Close">×</button>
          </div>
          <div class="search-suggestions">
            <div class="suggestions-title">Recent searches</div>
            ${filtered.length ? filtered.map((q) => `
              <button type="button" class="suggestion-item" data-query="${this.escapeAttr(q)}">${this.escapeHtml(q)}</button>
            `).join('') : '<div class="suggestions-empty">No recent searches</div>'}
          </div>
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
    return String(s).replace(/"/g, '&quot;');
  }

  styleSheet() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        :host {
          display: block;
          width: 100%;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 40px;
          border-bottom: 1px solid var(--border_color);
          background: var(--page_background);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Montserrat', sans-serif;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-link {
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .logo-link:hover {
          opacity: 0.85;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #3713ec;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .nav-link {
          color: var(--sub_text);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 8px;
          padding: 10px 12px;
          min-width: 250px;
          max-width: 256px;
          height: 40px;
          cursor: pointer;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          color: var(--muted_text);
          transition: border-color 0.2s;
          text-align: left;
        }

        .search-trigger:hover {
          border-color: var(--primary);
          color: var(--sub_text);
        }

        .search-trigger .search-icon {
          color: var(--muted_text);
          flex-shrink: 0;
        }

        .search-trigger span { flex: 1; }

        .search-trigger kbd {
          font-size: 11px;
          color: var(--muted_text);
          border: 1px solid var(--border_color);
          background: transparent;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: sans-serif;
        }

        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1000;
          display: none;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
        }

        .search-overlay.open {
          display: flex;
        }

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

        .search-modal-header .search-icon {
          color: var(--muted_text);
          flex-shrink: 0;
        }

        .search-modal-header input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: var(--main_text);
        }

        .search-modal-header input::placeholder {
          color: var(--muted_text);
        }

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

        .search-close-btn:hover {
          background: var(--surface_hover);
          color: var(--main_text);
        }

        .search-suggestions {
          max-height: 280px;
          overflow-y: auto;
          padding: 8px 0;
        }

        .suggestions-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted_text);
          padding: 8px 16px;
        }

        .suggestion-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: none;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          color: var(--main_text);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }

        .suggestion-item:hover {
          background: var(--surface_hover);
        }

        .suggestions-empty {
          padding: 16px;
          font-size: 14px;
          color: var(--muted_text);
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-secondary {
          padding: 10px 24px;
          height: 40px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          border: none;
          background: transparent;
          color: var(--main_text);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-secondary:hover {
          color: var(--primary);
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: var(--main_text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: var(--surface_hover);
        }

        @media (max-width: 1024px) {
          .nav-links { display: none; }
          .search-trigger { max-width: 200px; }
        }

        @media (max-width: 768px) {
          .topbar { padding: 12px 24px; }
          .right-section { gap: 12px; }
          .btn-secondary:not(.btn-github) { display: none; }
          .search-trigger { min-width: 120px; }
        }

        @media (max-width: 640px) {
          .topbar { padding: 12px 16px; }
          .search-trigger { display: none; }
        }
      </style>
    `;
  }
}
