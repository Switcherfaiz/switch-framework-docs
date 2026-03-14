import { SwitchComponent, encodeData, decodeData } from '/switch-framework/index.js';

/**
 * LiveCodePreview – Split-pane layout like React sandbox: code on left, live preview on right.
 * Top bar: file tab (e.g. App.js), action buttons (Download, Reload, Clear, Fork).
 * Use for tutorial examples.
 */
export class LiveCodePreview extends SwitchComponent {
  static tag = 'sw-live-code-preview';
  static observedAttributes = ['data'];

  render() {
    const raw = this.getAttribute('data');
    let config = { fileName: 'App.js', code: '', language: 'javascript', preview: 'liveview' };
    try {
      if (raw) config = { ...config, ...decodeData(raw) };
    } catch (_) {}

    const encoded = encodeData({ title: config.fileName, language: config.language || 'javascript', code: config.code });

    return `
      <div class="live-preview-wrap">
        <div class="live-preview-header">
          <span class="live-preview-tab">${(config.fileName || 'App.js').replace(/</g, '&lt;')}</span>
          <div class="live-preview-actions">
            <button type="button" class="live-preview-btn" title="Download">Download</button>
            <button type="button" class="live-preview-btn" title="Reload">Reload</button>
            <button type="button" class="live-preview-btn" title="Clear">Clear</button>
            <button type="button" class="live-preview-btn" title="Fork">Fork</button>
          </div>
        </div>
        <div class="live-preview-split">
          <div class="live-preview-code">
            <sw-codeblock data="${encoded}"></sw-codeblock>
          </div>
          <div class="live-preview-output">
            <div class="live-preview-label">Preview</div>
            <div class="live-preview-content">
              ${config.preview === 'liveview' ? '<sw-live-view data-state-key="liveview-tutorial"></sw-live-view>' : '<div class="live-preview-placeholder">Output</div>'}
            </div>
          </div>
        </div>
        <div class="live-preview-footer">
          <button type="button" class="live-preview-show-more">Show more <span class="chevron">▼</span></button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; }
        .live-preview-wrap {
          background: var(--codeblock_bg, #1e293b);
          border: 1px solid var(--codeblock_border, #334155);
          border-radius: var(--radius_md, 12px);
          overflow: hidden;
          margin: 24px 0;
        }
        .live-preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: var(--codeblock_header, #334155);
          border-bottom: 1px solid var(--codeblock_border, #334155);
        }
        .live-preview-tab {
          font-size: 13px;
          font-weight: 600;
          color: var(--codeblock_text, #f8fafc);
          padding-bottom: 2px;
          border-bottom: 2px solid var(--primary);
        }
        .live-preview-actions {
          display: flex;
          gap: 12px;
        }
        .live-preview-btn {
          background: transparent;
          border: none;
          color: var(--codeblock_muted, #94a3b8);
          font-size: 12px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .live-preview-btn:hover {
          color: var(--codeblock_text, #f8fafc);
        }
        .live-preview-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 280px;
        }
        @media (max-width: 768px) {
          .live-preview-split { grid-template-columns: 1fr; }
        }
        .live-preview-code {
          border-right: 1px solid var(--codeblock_border, #334155);
          overflow: auto;
        }
        .live-preview-code sw-codeblock {
          border: none;
          border-radius: 0;
        }
        .live-preview-code .code-header { border-radius: 0; }
        .live-preview-output {
          background: var(--codeblock_bg, #0a0c14);
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .live-preview-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--codeblock_muted, #94a3b8);
          margin-bottom: 12px;
        }
        .live-preview-content {
          flex: 1;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .live-preview-placeholder {
          color: var(--codeblock_muted, #94a3b8);
          font-size: 14px;
        }
        .live-preview-footer {
          padding: 8px 16px;
          background: var(--codeblock_header, #334155);
          border-top: 1px solid var(--codeblock_border, #334155);
        }
        .live-preview-show-more {
          background: transparent;
          border: none;
          color: var(--codeblock_muted, #94a3b8);
          font-size: 12px;
          cursor: pointer;
          padding: 4px 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .live-preview-show-more:hover {
          color: var(--codeblock_text, #f8fafc);
        }
        .live-preview-show-more .chevron {
          font-size: 10px;
          opacity: 0.8;
        }
      </style>
    `;
  }
}
