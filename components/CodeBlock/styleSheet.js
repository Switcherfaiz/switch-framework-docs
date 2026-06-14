import { CODE_FONT_CSS } from './codeFonts.js';

export function codeBlockStyleSheet() {
  return `
    <style>
      @import '/assets/icons/style.css';
      ${CODE_FONT_CSS}

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      :host {
        display: block;
        width: 100%;
        margin-bottom: 16px;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      .code-card {
        width: 100%;
        border-radius: 24px;
        padding: 14px 16px 16px;
        margin: 10px 0;
        overflow: hidden;
        background: var(--noterai-code-card-surface, #1e1e1e);
      }
      .code-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .code-lang-btn {
        border: none;
        background: transparent;
        padding: 0;
        margin: 0;
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        color: var(--noterai-code-toolbar-text, #fff);
        cursor: pointer;
        text-align: left;
        max-width: 40%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .code-file-label {
        font-size: 11px;
        color: var(--noterai-code-toolbar-icon, rgba(255,255,255,0.55));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }
      .code-toolbar-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        margin-left: auto;
      }
      .code-icon-btn {
        border: none;
        background: transparent;
        padding: 5px 6px;
        margin: 0;
        cursor: pointer;
        color: var(--noterai-code-toolbar-icon, rgba(255,255,255,0.55));
        font-size: 18px;
        line-height: 1;
      }
      .code-icon-btn.is-active { color: var(--noterai-code-toolbar-text, #fff); }
      .code-icon-btn:active { opacity: 0.72; }
      .code-editor-panel {
        border-radius: 10px;
        overflow: hidden;
      }
      .code-pre {
        margin: 0;
        padding: 0;
        overflow-x: auto;
      }
    </style>`;
}
