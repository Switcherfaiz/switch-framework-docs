import { SwitchComponent, navigate, goBack, getActiveRoute } from 'switch-framework';

export class SwUserNotFoundScreen extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-user-not-found-screen';

  onMount() {
    this._bindEvents();
  }

  _bindEvents() {
    this.listener('#home', 'click', () => navigate('index'));
    this.listener('#docs', 'click', () => navigate('docs/introduction'));
    this.listener('#back', 'click', () => goBack());
  }

  render() {
    const attemptedRoute = getActiveRoute() || '';
    const safePath = this._escapeHtml(attemptedRoute);

    return `
      <div class="wrap">
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
      </div>
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

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100%;
          font-family: var(--font);
          color: var(--main_text);
        }
        * { box-sizing: border-box; font-family: inherit; }
        .wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 72px 32px 80px;
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
}
