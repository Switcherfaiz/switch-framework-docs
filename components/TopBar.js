import { SwitchComponent, updateState, getState } from '/switch-framework';
import { navigate as swNavigate } from '/switch-framework/router/index.js';
import { getTheme, changeTheme } from '/switch-framework/themes/index.js';

export class TopBar extends SwitchComponent {
  static tag = 'sw-topbar';
  static { this.useState('search-open'); }

  onMount() {
    this.bindTopBarEvents();
    this.setupThemeSubscription();
    this.setupGlobalKeys();
    this.updateThemeIcon();
  }

  bindTopBarEvents() {
    if (this._topBarEventsBound) return;
    this._topBarEventsBound = true;
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (link) {
        e.preventDefault();
        swNavigate(link.getAttribute('data-route'));
        return;
      }
      const themeBtn = e.target?.closest?.('#theme-toggle');
      if (themeBtn) {
        e.preventDefault();
        changeTheme(getTheme() === 'dark' ? 'light' : 'dark');
        this.updateThemeIcon();
        return;
      }
      const trigger = e.target?.closest?.('#search-trigger');
      if (trigger) {
        e.preventDefault();
        updateState('search-open', true);
      }
    });
  }

  setupThemeSubscription() {
    if (this._themeSubbed) return;
    this._themeSubbed = true;
    this._themeHandler = () => this.updateThemeIcon();
    document.addEventListener('theme:change', this._themeHandler);
    this.addOnDestroy(() => {
      document.removeEventListener('theme:change', this._themeHandler);
    });
  }

  setupGlobalKeys() {
    if (this._keysBound) return;
    this._keysBound = true;
    this._keyHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        updateState('search-open', (v) => !v);
      }
      if (e.key === 'Escape') updateState('search-open', false);
    };
    document.addEventListener('keydown', this._keyHandler);
    this.addOnDestroy(() => document.removeEventListener('keydown', this._keyHandler));
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
      { label: 'Changelogs', to: 'changelogs' },
      { label: 'Authors', to: 'authors' },
      { label: 'About', to: 'about' }
    ];
  }

  render() {
    const navLinks = this.getNavLinks();

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
            <kbd>Ctrl+K</kbd>
          </button>
          <div class="button-group">
            <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer" class="btn-icon btn-github" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="currentColor"/>
              </svg>
            </a>
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

      <sw-docs-search></sw-docs-search>
    `;
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
          gap: 24px;
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
          flex-shrink: 0;
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
          justify-content: flex-end;
          gap: 24px;
          flex: 1;
          min-width: 0;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
          max-width: 600px;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 8px;
          padding: 10px 12px;
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

        .button-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-github {
          color: var(--main_text);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-github:hover {
          color: var(--primary);
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
        }

        @media (max-width: 768px) {
          .topbar { padding: 12px 24px; }
          .right-section { gap: 12px; }
        }

        @media (max-width: 640px) {
          .topbar { padding: 12px 16px; }
          .search-trigger span { display: none; }
        }
      </style>
    `;
  }
}
