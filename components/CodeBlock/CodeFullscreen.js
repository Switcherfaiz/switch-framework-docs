import hljs from '/codehighlighter/codehighlighter.js';
import { Modal, registerComponent, ensureState, getState, updateState } from 'switch-framework';
import { copyText } from '/utils/clipboard.js';
import { CODE_FONT_CSS } from './codeFonts.js';
import { openCodeLangSheet } from './CodeLangSheet.js';
import {
  escapeHtml,
  highlight,
  langToHljs,
  languageLabel,
  isLiveView,
  isRunnable,
  previewFrameAttr,
} from './codeUtils.js';

const KEY = 'code-fullscreen';
ensureState(KEY, { open: false });

/** Open the shared fullscreen viewer. `tab` is 'code' or 'preview'. */
export function openCodeFullscreen({ code = '', language = 'text', title = '', preview = '', tab = 'code' }) {
  updateState(KEY, { open: true, code, language, title, preview, tab, edit: false });
}

const patch = (next) => updateState(KEY, (s) => ({ ...s, ...next }));

export class CodeFullscreen extends Modal {
  static tag = 'sw-code-fullscreen';
  static visibleState = KEY;
  static presentationStyle = 'overFullScreen';

  onMount() {
    this.listener('#fs-close', 'click', () => this.dismiss());
    this.listener('#fs-lang', 'click', () => {
      patch(this.draft());
      openCodeLangSheet(getState(KEY).language, (language) => patch({ language }));
    });
    this.listener('[data-mode]', 'click', (e) => {
      patch({ ...this.draft(), tab: 'code', edit: e.target.closest('[data-mode]').dataset.mode === 'edit' });
    });
    this.listener('[data-tab]', 'click', (e) => {
      patch({ ...this.draft(), tab: e.target.closest('[data-tab]').dataset.tab });
    });
    this.listener('#fs-copy', 'click', () => this.copy());
  }

  onUpdate() {
    this.select('#fs-edit')?.focus();
  }

  /** Unsaved textarea edits, merged into state before any rerender. */
  draft() {
    const ta = this.select('#fs-edit');
    return ta ? { code: ta.value } : {};
  }

  async copy() {
    const code = this.draft().code ?? getState(KEY).code;
    if (!(await copyText(code))) return;
    const icon = this.select('#fs-copy span');
    if (!icon) return;
    icon.className = 'switch_icon_check';
    setTimeout(() => { icon.className = 'switch_icon_copy'; }, 1200);
  }

  render() {
    const s = getState(KEY) || {};
    if (!s.open) return '<div class="fs"></div>';

    const lang = s.language || 'text';
    const code = s.code || '';
    const liveView = isLiveView(lang, code, s.preview);
    const runnable = isRunnable(lang, code, s.preview);
    const tab = runnable && s.tab === 'preview' ? 'preview' : 'code';
    const edit = liveView && s.edit;

    let body;
    if (tab === 'preview') {
      body = `<iframe class="fs-frame" title="Code preview" sandbox="allow-scripts allow-same-origin" ${previewFrameAttr(lang, code, s.preview)}></iframe>`;
    } else if (edit) {
      body = `<textarea class="fs-edit" id="fs-edit" spellcheck="false" autocomplete="off" autocapitalize="off">${escapeHtml(code)}</textarea>`;
    } else {
      body = `<pre class="fs-pre"><code class="hljs language-${langToHljs(lang)}">${highlight(hljs, code, lang)}</code></pre>`;
    }

    return `
      <div class="fs">
        <div class="fs-head">
          <button type="button" class="icon-btn" id="fs-close" aria-label="Close"><span class="switch_icon_compress"></span></button>
          <button type="button" class="lang-btn" id="fs-lang">${escapeHtml(languageLabel(lang))}</button>
          ${s.title ? `<span class="file">${escapeHtml(s.title)}</span>` : ''}
          <div class="actions">
            ${liveView ? `
              <div class="mode">
                <button type="button" class="mode-btn ${!edit ? 'is-active' : ''}" data-mode="view">View</button>
                <button type="button" class="mode-btn ${edit ? 'is-active' : ''}" data-mode="edit">Edit</button>
              </div>` : ''}
            ${runnable ? `
              <button type="button" class="icon-btn run" data-tab="preview" aria-label="Run preview"><span class="switch_icon_play"></span></button>
              <button type="button" class="icon-btn ${tab === 'code' ? 'is-active' : ''}" data-tab="code" aria-label="Show code"><span class="switch_icon_code"></span></button>` : ''}
            <button type="button" class="icon-btn" id="fs-copy" aria-label="Copy code"><span class="switch_icon_copy"></span></button>
          </div>
        </div>
        <div class="fs-body">${body}</div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';
        @import '/codehighlighter/codehighlighter.css';
        ${CODE_FONT_CSS}

        .modal-root.presentation-overFullScreen .modal-container {
          padding: 0;
          max-width: none;
          height: 100%;
          align-items: stretch;
        }
        .fs {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--codeblock_bg, #18181b);
          font-family: var(--font, 'DM Sans', system-ui, sans-serif);
        }
        .fs-head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--codeblock_header, #27272a);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }
        .lang-btn {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 5px 10px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          color: var(--codeblock_muted, #a1a1aa);
          cursor: pointer;
          border-radius: 999px;
        }
        .file {
          min-width: 0;
          font-size: 12px;
          color: var(--codeblock_text, #fafafa);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .icon-btn {
          border: none;
          background: transparent;
          padding: 7px 8px;
          cursor: pointer;
          color: var(--codeblock_muted, #a1a1aa);
          font-size: 16px;
          line-height: 1;
          border-radius: 8px;
        }
        .icon-btn:hover { background: rgba(255, 255, 255, 0.07); color: #fafafa; }
        .icon-btn.is-active { color: #c4b5fd; background: rgba(129, 140, 248, 0.18); }
        .icon-btn.run { color: #c4b5fd; background: rgba(129, 140, 248, 0.18); }
        .mode {
          display: flex;
          gap: 4px;
          padding: 3px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }
        .mode-btn {
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          padding: 5px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .mode-btn.is-active { background: rgba(129, 140, 248, 0.22); color: #fff; }
        .fs-body {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: auto;
        }
        .fs-pre { margin: 0; flex: 1; }
        .fs-pre code.hljs { padding: 20px 24px; min-height: 100%; }
        .fs-edit {
          flex: 1;
          padding: 20px 24px;
          border: none;
          background: #111113;
          color: #f4f4f5;
          resize: none;
          outline: none;
          white-space: pre;
          tab-size: 2;
        }
        .fs-frame {
          flex: 1;
          width: 100%;
          border: none;
          background: #fff;
        }
      </style>
    `;
  }
}

registerComponent(CodeFullscreen);
