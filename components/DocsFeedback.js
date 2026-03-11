import { useState, updateState } from '/switch-framework/index.js';

export class DocsFeedback extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._unsub = null;
  }

  connectedCallback() {
    this.render();

    // Subscribe to docs-helpful-count – re-render when it changes
    const [count, unsubscribe] = useState('docs-helpful-count', (newCount) => {
      const el = this.shadowRoot?.querySelector('#helpful-count');
      if (el) el.textContent = newCount;
    });
    this._unsub = unsubscribe;

    this.shadowRoot.querySelector('#helpful-yes')?.addEventListener('click', () => {
      updateState('docs-helpful-count', (n) => (n || 0) + 1);
    });
  }

  disconnectedCallback() {
    if (this._unsub) this._unsub();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
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
          gap: 12px;
          margin-top: 24px;
          padding: 16px;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 12px;
        }

        .feedback-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--sub_text);
        }

        .feedback-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid var(--primary);
          border-radius: 8px;
          background: var(--primary_light);
          color: var(--primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .feedback-btn:hover {
          background: var(--primary);
          color: white;
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

if (!customElements.get('sw-docs-feedback')) {
  customElements.define('sw-docs-feedback', DocsFeedback);
}
