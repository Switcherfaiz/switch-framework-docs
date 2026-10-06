import { SwitchComponent } from 'switch-framework';
import { navigate, goBack, getActivePath } from 'switch-framework-router';

export default class extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-user-not-found-screen';

  onMount() {
    this._bindEvents();
  }

  _bindEvents() {
    this.listener('#home', 'click', () => navigate('index'));
    this.listener('#back', 'click', () => goBack());
    this.listener('#docs', 'click', () => navigate('docs/introduction'));
  }

  render() {
    const path = getActivePath();
    const safePath = this._escapeHtml(path);
    return `
      <div class="wrap">
        <sw-topbar></sw-topbar>
        <main class="main">
          <p class="kicker">Error</p>
          <div class="code">404</div>
          <h1>This screen does not exist</h1>
          <p class="lede">No screen is registered for:</p>
          <div class="path">${safePath}</div>
          <div class="row">
            <button class="btn" id="home" type="button">Go home</button>
            <button class="btn secondary" id="docs" type="button">Open docs</button>
            <button class="btn secondary" id="back" type="button">Go back</button>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100dvh;
          font-family: var(--font);
          background: var(--page_background);
          color: var(--main_text);
        }
        * { box-sizing: border-box; font-family: inherit; }
        .wrap { min-height: 100dvh; display: flex; flex-direction: column; }
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 640px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .kicker {
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .code {
          font-weight: 700;
          font-size: 56px;
          letter-spacing: -0.05em;
          line-height: 1;
          color: var(--main_text);
        }
        h1 {
          margin: 12px 0 8px;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.03em;
        }
        .lede { margin: 0; color: var(--sub_text); }
        .path {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 12px;
          background: var(--surface_1);
          border: 1px solid var(--border_color);
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--main_text);
          word-break: break-word;
        }
        .row { margin-top: 22px; display: flex; gap: 10px; flex-wrap: wrap; }
        .btn {
          border: none;
          background: var(--main_text);
          color: var(--page_background);
          font-weight: 650;
          border-radius: 999px;
          padding: 10px 16px;
          cursor: pointer;
        }
        .btn.secondary {
          background: var(--surface_1);
          color: var(--main_text);
          border: 1px solid var(--border_color);
        }
      </style>
    `;
  }

  _escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
