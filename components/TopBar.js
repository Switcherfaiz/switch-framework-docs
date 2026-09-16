import { SwitchComponent, useShared, onState, updateState, useEffect, VERSION } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { getTheme, changeTheme, useThemesChangesSubscriber } from 'switch-framework/themes';
import { navigateDoc, isDocRoute } from '/utils/doc-nav.js';

const NAV = [
  { label: 'Docs', to: 'docs/introduction' },
  { label: 'Changelogs', to: 'changelogs' },
  { label: 'Authors', to: 'authors' },
  { label: 'About', to: 'about' },
];

function isNavActive(route, to) {
  return to === 'docs/introduction'
    ? String(route).startsWith('docs')
    : route === to;
}

export class TopBar extends SwitchComponent {
  static tag = 'sw-topbar';

  render() {
    const [route] = useShared('activeRoute', '');
    const [theme, setTheme] = useShared('docs-theme', getTheme());
    this._setTheme = setTheme;
    const isDark = theme === 'dark';

    return `
      <header class="topbar ${String(route).startsWith('docs') ? 'on-docs' : ''}">
        <div class="left-section">
          <button id="mobile-nav-toggle" class="btn-icon mobile-nav" type="button" aria-label="Open documentation menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <a href="#" data-route="index" class="logo-section logo-link">
            <div class="logo-icon">
              <img class="logo-light" src="/assets/files/Switch_framework_logo_purple.svg" alt="Switch Framework" width="22" height="22" style="${isDark ? 'display:none' : 'display:block'}" />
              <img class="logo-dark" src="/assets/files/Switch_framework_logo_white.svg" alt="Switch Framework" width="22" height="22" style="${isDark ? 'display:block' : 'display:none'}" />
            </div>
            <h2 class="logo-text">Switch Framework</h2>
          </a>
          <a href="#" data-route="changelogs" class="version" title="switch-framework ${VERSION}">v${VERSION}</a>
          <nav class="nav-links">
            ${NAV.map(({ label, to }) => `
              <a href="#" data-route="${to}" class="nav-link${isNavActive(route, to) ? ' active' : ''}">${label}</a>
            `).join('')}
          </nav>
        </div>
        <div class="right-section">
          <sw-docs-search-bar></sw-docs-search-bar>
          <sw-docs-search></sw-docs-search>
          <div class="button-group">
            <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer" class="btn-icon btn-github" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="currentColor"/>
              </svg>
            </a>
            <button id="theme-toggle" class="btn-icon" type="button" aria-label="Toggle theme">
              <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="${isDark ? 'display:none' : 'display:block'}">
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
                <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="${isDark ? 'display:block' : 'display:none'}">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  effects() {
    useEffect(() => useThemesChangesSubscriber((theme) => {
      this._setTheme?.(theme);
    }), []);
  }

  onMount() {
    this.listener('a[data-route]', 'click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (isDocRoute(route)) navigateDoc(route);
      else navigate(route);
    });

    this.listener('#theme-toggle', 'click', (e) => {
      e.preventDefault();
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      changeTheme(next);
      this._setTheme(next);
    });

    this.listener('#mobile-nav-toggle', 'click', (e) => {
      e.preventDefault();
      updateState('mobile-sidebar-open', (v) => !v);
    });

    onState('activeRoute', (route) => {
      const value = String(route || '');
      this.select('.topbar')?.classList.toggle('on-docs', value.startsWith('docs'));
      this.selectAll('.nav-link')?.forEach((a) => {
        a.classList.toggle('active', isNavActive(value, a.getAttribute('data-route')));
      });
    });

    onState('docs-theme', (theme) => {
      const isDark = String(theme || 'light') === 'dark';
      this.selectAll('.icon-sun')?.forEach((el) => { el.style.display = isDark ? 'none' : 'block'; });
      this.selectAll('.icon-moon')?.forEach((el) => { el.style.display = isDark ? 'block' : 'none'; });
      this.selectAll('.logo-light')?.forEach((el) => { el.style.display = isDark ? 'none' : 'block'; });
      this.selectAll('.logo-dark')?.forEach((el) => { el.style.display = isDark ? 'block' : 'none'; });
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative;
          z-index: 60;
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
          gap: 20px;
          padding: 0 20px;
          height: var(--header_height, 56px);
          border-bottom: 1px solid var(--border_color);
          background: color-mix(in srgb, var(--page_background) 78%, transparent);
          backdrop-filter: saturate(1.4) blur(18px);
          -webkit-backdrop-filter: saturate(1.4) blur(18px);
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: var(--font);
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-link {
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .logo-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-text {
          font-size: 14px;
          font-weight: 700;
          color: var(--main_text);
          letter-spacing: -0.03em;
          line-height: 1.2;
          white-space: nowrap;
        }

        .version {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--sub_text);
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 999px;
          padding: 2px 8px;
          text-decoration: none;
          line-height: 1.4;
          flex-shrink: 0;
        }

        .version:hover {
          color: var(--main_text);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          color: var(--sub_text);
          text-decoration: none;
          font-size: 13px;
          font-weight: 550;
          padding: 6px 10px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--main_text);
          background: var(--surface_2);
        }

        .nav-link.active {
          color: var(--main_text);
          background: var(--surface_2);
        }

        .right-section {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .btn-github {
          color: var(--main_text);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--main_text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .btn-icon:hover {
          background: var(--surface_2);
        }

        .mobile-nav {
          display: none;
        }

        @media (max-width: 1024px) {
          .nav-links { display: none; }
          .on-docs .mobile-nav { display: flex; }
        }

        @media (max-width: 768px) {
          .topbar { padding: 0 12px; }
          .right-section { gap: 8px; }
          .left-section { gap: 8px; }
        }

        @media (max-width: 520px) {
          .logo-text { font-size: 12px; }
        }
      </style>
    `;
  }
}
