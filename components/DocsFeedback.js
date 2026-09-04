import { SwitchComponent, useState, updateState } from 'switch-framework';

export class DocsFeedback extends SwitchComponent {
  static tag = 'sw-docs-feedback';

  onMount() {
    useState('docs-helpful-count', (newCount) => {
      const el = this.shadowRoot?.querySelector('#helpful-count');
      if (el) el.textContent = newCount;
    });

    this.shadowRoot.querySelector('#helpful-yes')?.addEventListener('click', () => {
      updateState('docs-helpful-count', (n) => (n || 0) + 1);
    });
  }

  render() {
    return `
      <div class="feedback">
        <span class="feedback-label">Was this helpful?</span>
        <button id="helpful-yes" type="button" class="feedback-btn">
          <span class="switch_icon_thumb_up"></span>
          Yes
        </button>
        <span class="feedback-count"><span id="helpful-count">0</span> found it useful</span>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host { display: block; width: 100%; }

        .feedback {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
          padding: 12px 14px;
          background: transparent;
          border: 1px solid var(--border_color);
          border-radius: 14px;
        }

        .feedback-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: 1px solid var(--border_color);
          border-radius: 999px;
          background: var(--surface_1);
          color: var(--main_text);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .feedback-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .feedback-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--sub_text);
        }

        .feedback-btn .switch_icon_thumb_up {
          font-size: 16px;
        }

        .feedback-count {
          font-size: 13px;
          color: var(--muted_text);
        }
      </style>
    `;
  }
}
