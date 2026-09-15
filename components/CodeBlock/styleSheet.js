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
        margin: 8px 0 20px;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        font-family: var(--font);
      }

      .code-card {
        width: 100%;
        border-radius: var(--codeblock-radius, 14px);
        overflow: hidden;
        background: var(--codeblock_bg, #18181b);
        border: 1px solid var(--codeblock-frame, var(--codeblock_border, #27272a));
        box-shadow: var(--codeblock-shadow, var(--shadow_sm));
      }

      .code-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 42px;
        padding: 0 10px 0 14px;
        background: var(--codeblock_header, #27272a);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .code-toolbar-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1;
      }

      .code-lang-btn {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        padding: 3px 8px;
        margin: 0;
        font-family: var(--font);
        font-size: 11px;
        font-weight: 650;
        letter-spacing: 0.02em;
        color: var(--codeblock_muted, #a1a1aa);
        cursor: pointer;
        text-align: left;
        border-radius: 999px;
        flex-shrink: 0;
        text-transform: lowercase;
      }
      .code-lang-btn:hover {
        color: var(--codeblock_text, #fafafa);
        border-color: rgba(255, 255, 255, 0.18);
      }

      .code-file-label {
        font-size: 12px;
        font-weight: 550;
        color: var(--codeblock_text, #fafafa);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .code-toolbar-actions {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        margin-left: auto;
      }

      .code-icon-btn,
      .code-copy-btn {
        border: none;
        background: transparent;
        padding: 6px 8px;
        margin: 0;
        cursor: pointer;
        color: var(--codeblock_muted, #a1a1aa);
        font-size: 16px;
        line-height: 1;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--font);
      }
      .code-icon-btn:hover,
      .code-copy-btn:hover {
        background: rgba(255, 255, 255, 0.07);
        color: var(--codeblock_text, #fafafa);
      }
      .code-icon-btn.is-active {
        color: var(--codeblock_accent, #a5b4fc);
        background: rgba(129, 140, 248, 0.16);
      }
      .code-copy-btn .copy-label {
        font-size: 12px;
        font-weight: 650;
      }
      .code-copy-btn.is-copied {
        color: #4ade80;
      }

      .code-scroll {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        max-height: var(--codeblock-max-scroll, min(520px, 70vh));
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #3f3f46 transparent;
      }
      .code-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
      .code-scroll::-webkit-scrollbar-thumb {
        background: #3f3f46;
        border-radius: 999px;
      }

      .code-gutter {
        user-select: none;
        text-align: right;
        padding: 14px 0 14px 12px;
        color: #52525b;
        font-family: var(--sw-code-font);
        font-size: 13px;
        line-height: 22px;
        border-right: 1px solid rgba(255, 255, 255, 0.06);
      }
      .code-gutter span {
        display: block;
        padding-right: 12px;
        min-width: 1.75em;
      }

      .code-editor-panel {
        min-width: 0;
        overflow: visible;
      }
      .code-pre,
      .code-pre code,
      .code-pre code.hljs,
      pre code.hljs {
        margin: 0;
        overflow: visible !important;
        overflow-x: visible !important;
        overflow-y: visible !important;
      }
      .code-pre code.hljs {
        padding: 14px 16px 14px 14px !important;
      }

      @media (max-width: 640px) {
        .code-copy-btn .copy-label { display: none; }
        .code-file-label { font-size: 11px; max-width: 42vw; }
        .code-toolbar { padding: 0 8px 0 10px; gap: 6px; }
        .code-gutter {
          padding: 10px 0 10px 8px;
          font-size: 11px;
          line-height: 20px;
        }
        .code-pre code.hljs {
          padding: 10px 12px 10px 10px !important;
          font-size: 12px;
          line-height: 20px;
        }
        .code-scroll {
          max-height: var(--codeblock-max-scroll, min(360px, 52vh));
        }
      }
    </style>`;
}
