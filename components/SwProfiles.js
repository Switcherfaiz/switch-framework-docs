import { SwitchComponent } from '/switch-framework/index.js';
import { decodeData } from '/switch-framework/router/index.js';

export class SwProfiles extends SwitchComponent {
  static tag = 'sw-profiles';

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'data' && oldVal !== newVal) {
      this._renderToShadow();
    }
  }

  getData() {
    return decodeData(this.getAttribute('data')) || {};
  }

  render() {
    const { name = '', subtitle = '', image = '', githubUrl = '' } = this.getData();
    const avatarStyle = image ? `background-image: url(${image}); background-size: cover;` : '';

    return `
      <div class="profile-card">
        <div class="profile-avatar" style="${avatarStyle}"></div>
        <div class="profile-info">
          <h4 class="profile-name">${this.escapeHtml(name)}</h4>
          <p class="profile-subtitle">${this.escapeHtml(subtitle)}</p>
          ${githubUrl ? `
            <a href="${this.escapeAttr(githubUrl)}" target="_blank" rel="noopener noreferrer" class="profile-github" aria-label="GitHub profile">
              <span class="switch_icon_github"></span>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = String(s ?? '');
    return div.innerHTML;
  }

  escapeAttr(s) {
    return String(s ?? '').replace(/"/g, '&quot;');
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 1px solid var(--border_color);
        }

        .profile-card:last-child {
          border-bottom: none;
        }

        .profile-avatar {
          width: 88px;
          height: 88px;
          min-width: 88px;
          min-height: 88px;
          border-radius: 50%;
          background: var(--surface_2);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
          background-size: 48px 48px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .profile-info {
          flex: 1;
          min-width: 0;
        }

        .profile-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 0 0 4px;
        }

        .profile-subtitle {
          font-size: 14px;
          line-height: 1.5;
          color: var(--sub_text);
          margin: 0 0 8px;
        }

        .profile-github {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: var(--muted_text);
          transition: color 0.2s;
        }

        .profile-github:hover {
          color: var(--primary);
        }

        .profile-github .switch_icon_github {
          font-size: 22px;
        }
      </style>
    `;
  }
}
