export class TopBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();

    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
      if (typeof navigate === 'function') navigate(route);
    });
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }

  getNavLinks() {
    return [
      { label: 'Docs', to: '/docs' },
      { label: 'Components', to: '/components' },
      { label: 'Blog', to: '/blog' },
      { label: 'Showcase', to: '/showcase' }
    ];
  }

  render() {
    const navLinks = this.getNavLinks();

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <header class="topbar">
        <div class="left-section">
          <div class="logo-section">
            <div class="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7H7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13H17C18.6569 13 20 14.3431 20 16C20 17.6569 18.6569 19 17 19H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="7" cy="10" r="2" fill="currentColor"/>
                <circle cx="17" cy="16" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h2 class="logo-text">Switch Framework</h2>
          </div>
          <nav class="nav-links">
            ${navLinks.map(({ label, to }) => `
              <a href="#" data-route="${to}" class="nav-link">${label}</a>
            `).join('')}
          </nav>
        </div>
        <div class="right-section">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="Search documentation..." />
            <kbd>⌘K</kbd>
          </div>
          <div class="button-group">
            <button class="btn-secondary">Start for free</button>
            <button class="btn-secondary">GitHub</button>
            <button class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
                <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
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
          padding: 12px 40px;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.8);
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
          color: #111827;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .nav-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #3713ec;
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 12px;
          min-width: 160px;
          max-width: 256px;
          height: 40px;
          transition: border-color 0.2s;
        }

        .search-box:focus-within {
          border-color: #3713ec;
          background: white;
        }

        .search-icon {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          color: #111827;
          min-width: 0;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .search-box kbd {
          font-size: 11px;
          color: #9ca3af;
          border: 1px solid #e5e7eb;
          background: transparent;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: sans-serif;
          flex-shrink: 0;
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
          color: #111827;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-secondary:hover {
          color: #3713ec;
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #111827;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #f3f4f6;
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }

          .search-box {
            max-width: 200px;
          }
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 12px 24px;
          }

          .right-section {
            gap: 12px;
          }

          .btn-secondary {
            display: none;
          }

          .search-box {
            min-width: 120px;
          }
        }

        @media (max-width: 640px) {
          .topbar {
            padding: 12px 16px;
          }

          .search-box {
            display: none;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-topbar')) {
  customElements.define('sw-topbar', TopBar);
}