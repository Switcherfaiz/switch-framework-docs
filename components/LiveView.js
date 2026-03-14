import { SwitchComponent, createState, updateState, getState, subscribeState, decodeData } from '/switch-framework/index.js';

/**
 * LiveView – Renders a live preview that updates when state changes.
 * Use with CodeBlock for interactive tutorials. Accepts `data` (encoded) with:
 * - initialState: { count: 0 } – initial state for the preview
 * - data-state-key: attribute for unique state key per instance
 */
export class LiveView extends SwitchComponent {
  static tag = 'sw-live-view';
  static observedAttributes = ['data', 'data-state-key'];

  constructor() {
    super();
    this._stateKey = 'liveview-tutorial';
    this._unsub = null;
  }

  connected() {
    this._stateKey = this.getAttribute('data-state-key') || 'liveview-tutorial';
    try {
      const raw = this.getAttribute('data');
      const d = raw ? decodeData(raw) : null;
      const initial = d?.initialState ?? { count: 0 };
      if (typeof createState === 'function' && typeof getState === 'function') {
        if (getState(this._stateKey) === undefined) {
          createState(initial, this._stateKey);
        }
      }
    } catch (_) {}
    this._unsub = subscribeState(this._stateKey, () => this._renderToShadow());
    this.shadowRoot.addEventListener('click', (e) => this._handlePreviewClick(e));
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  _handlePreviewClick(e) {
    const btn = e.target?.closest?.('[data-liveview-increment]');
    if (btn && typeof updateState === 'function' && typeof getState === 'function') {
      const current = getState(this._stateKey) || {};
      updateState(this._stateKey, { ...current, count: (current.count || 0) + 1 });
    }
  }

  render() {
    const state = (typeof getState === 'function' ? getState(this._stateKey) : null) || { count: 0 };
    const count = state?.count ?? 0;

    return `
      <div class="liveview-wrap">
        <div class="liveview-label">Live Preview</div>
        <div class="liveview-preview">
          <button type="button" class="liveview-btn" data-liveview-increment>
            Count: ${count}
          </button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; }
        .liveview-wrap {
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: var(--radius_md, 12px);
          padding: 20px;
          margin-top: 12px;
        }
        .liveview-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted_text);
          margin-bottom: 12px;
        }
        .liveview-preview {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .liveview-btn {
          padding: 10px 20px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
        }
        .liveview-btn:hover {
          background: var(--primary_hover);
        }
        .liveview-btn:active {
          transform: scale(0.98);
        }
      </style>
    `;
  }
}
