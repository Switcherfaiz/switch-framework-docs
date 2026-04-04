import { SwitchComponent, decodeData, getState, updateState } from 'switch-framework';
import { copyText } from '/utils/clipboard.js';

const CHECK_ICON = '<span class="switch_icon_check copy-check-icon"></span>';

const LANG_HIGHLIGHTERS = {
  javascript: (code) => highlightJs(code),
  js: (code) => highlightJs(code),
  bash: (code) => highlightBash(code),
  shell: (code) => highlightBash(code),
  json: (code) => highlightJson(code),
  text: (code) => code
};

function highlightJs(code) {
  return code
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '<span class="hl-string">$&</span>')
    .replace(/\/\/.*$/gm, '<span class="hl-comment">$&</span>')
    .replace(/\/\*[\s\S]*?\*\//g, '<span class="hl-comment">$&</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="hl-literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>')
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(?=\()/g, '<span class="hl-function">$1</span>$2');
}

function highlightBash(code) {
  return code
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="hl-string">$&</span>')
    .replace(/#.*$/gm, '<span class="hl-comment">$&</span>')
    .replace(/\b(npm|npx|cd|ls|mkdir|echo|export)\b/g, '<span class="hl-cmd">$1</span>');
}

function highlightJson(code) {
  return code
    .replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="hl-string">$&</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="hl-literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>')
    .replace(/"([^"]+)":/g, '<span class="hl-property">"$1"</span>:');
}

export class LiveCodePreview extends SwitchComponent {
  static tag = 'sw-live-code-preview';
  static observedAttributes = ['data'];
  static { this.useState('live-edit-mode'); }

  onMount() {
    this.bindEvents();
    // Re-bind events after re-renders (e.g. live-edit-mode toggle)
    this.useEffect(() => {
      queueMicrotask(() => this.bindEvents());
    }, ['live-edit-mode']);

    this._hasRun = false;
    this._setupAutoRun();
    if (!this._logHandlerBound) {
      this._logHandlerBound = true;
      this._logHandler = (e) => {
        if (e?.data?.type === 'live-preview-log') this.appendLog(e.data.payload);
      };
      window.addEventListener('message', this._logHandler);
      this.addOnDestroy(() => {
        window.removeEventListener('message', this._logHandler);
        this._logHandlerBound = false;
      });
    }
  }

  bindEvents() {
    const copyBtn = this.shadowRoot?.querySelector('.copy-btn');
    if (copyBtn) copyBtn.onclick = () => this.copyToClipboard();

    const runBtn = this.shadowRoot?.querySelector('.run-btn');
    if (runBtn) runBtn.onclick = () => this.runPreview();

    const inspectBtn = this.shadowRoot?.querySelector('.inspect-btn');
    if (inspectBtn) {
      inspectBtn.onclick = () => {
        const wrap = this.shadowRoot?.querySelector('.preview-logs-wrap');
        wrap?.classList.toggle('open');
      };
    }

    const fsBtn = this.shadowRoot?.querySelector('.fullscreen-btn');
    if (fsBtn) {
      fsBtn.onclick = async () => {
        const panel = this.shadowRoot?.querySelector('.preview-panel');
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else await panel?.requestFullscreen?.();
        } catch (_) {}
      };
    }

    const textarea = this.shadowRoot?.querySelector('.code-textarea');
    if (textarea) textarea.oninput = () => this.syncCodeFromEdit();

    this.shadowRoot?.querySelectorAll('.mode-btn')?.forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute('data-mode');
        const ta = this.shadowRoot?.querySelector('.code-textarea');
        if (ta) this._editedCode = ta.value;
        else if (mode === 'edit') this._editedCode = this._editedCode ?? this.decodeData()?.code;
        updateState('live-edit-mode', mode);
      };
    });
  }

  getCurrentCode() {
    const ta = this.shadowRoot?.querySelector('.code-textarea');
    return ta ? ta.value : (this.decodeData()?.code || '');
  }

  syncCodeFromEdit() {
    this._editedCode = this.shadowRoot?.querySelector('.code-textarea')?.value;
  }

  runPreview() {
    this._hasRun = true;
    this._runPreview(this.getCurrentCode());
  }

  _setupAutoRun() {
    const data = this.decodeData();
    const { preview = 'liveview', language = 'javascript' } = data || {};
    if (preview !== 'liveview' || language !== 'javascript') return;
    if (this._hasRun) return;

    const container = this.shadowRoot?.querySelector('.preview-panel');
    if (!container) return;

    if (this._autoRunObserver) {
      try { this._autoRunObserver.disconnect(); } catch (_) {}
      this._autoRunObserver = null;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this._hasRun = true;
      this._runPreview();
      return;
    }

    this._autoRunObserver = new IntersectionObserver((entries) => {
      const entry = entries?.[0];
      if (!entry?.isIntersecting) return;
      if (this._hasRun) return;
      this._hasRun = true;
      this._runPreview();
      try { this._autoRunObserver.disconnect(); } catch (_) {}
      this._autoRunObserver = null;
    }, { root: null, threshold: 0.15 });

    this._autoRunObserver.observe(container);
    this.addOnDestroy(() => {
      if (this._autoRunObserver) {
        try { this._autoRunObserver.disconnect(); } catch (_) {}
        this._autoRunObserver = null;
      }
    });
  }

  appendLog(msg) {
    const el = this.shadowRoot?.querySelector('.preview-logs');
    if (!el) return;
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = msg;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this._editedCode = null;
      this._hasRun = false;
      this.rerender();
      queueMicrotask(() => {
        this.bindEvents();
        this._setupAutoRun();
      });
    }
  }

  decodeData() {
    const raw = this.getAttribute('data');
    if (!raw) return null;
    try {
      return decodeData(raw);
    } catch {
      return null;
    }
  }

  highlight(code, language) {
    const lang = (language || 'javascript').toLowerCase();
    const fn = LANG_HIGHLIGHTERS[lang];
    if (!fn) return this.escapeHtml(code);
    return fn(this.escapeHtml(code));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async copyToClipboard() {
    const data = this.decodeData();
    const code = this.getCurrentCode() || data?.code || '';
    const btn = this.shadowRoot.querySelector('.copy-btn');
    if (!btn) return;
    const ok = await copyText(code);
    if (ok) {
      const orig = btn.innerHTML;
      btn.innerHTML = CHECK_ICON;
      btn.classList.add('copied');
      btn.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('copied');
        btn.setAttribute('aria-label', 'Copy to clipboard');
      }, 1500);
    } else {
      btn.classList.add('copy-error');
      setTimeout(() => btn.classList.remove('copy-error'), 1000);
    }
  }

  async _runPreview(overrideCode) {
    const data = this.decodeData();
    const { code = '', preview = 'liveview', language = 'javascript' } = data || {};
    const container = this.shadowRoot?.querySelector('.preview-container');
    if (!container || preview !== 'liveview' || language !== 'javascript') return;

    const codeToRun = overrideCode ?? this._editedCode ?? code;
    const logsEl = this.shadowRoot?.querySelector('.preview-logs');
    if (logsEl) logsEl.innerHTML = '';

    // Encode code and set iframe src to preview.html with code in hash
    const encodedCode = btoa(encodeURIComponent(codeToRun));
    const base = window.location.origin;
    const iframe = this.shadowRoot?.querySelector('.preview-iframe');
    if (iframe) {
      const runId = Date.now();
      iframe.src = `${base}/preview.html?run=${runId}#${encodedCode}`;
    }
  }

  render() {
    this.data = this.decodeData();
    const { title = 'app.js', fileName, code = '', language = 'javascript', preview = 'liveview' } = this.data || {};
    const displayTitle = title || fileName || 'app.js';
    const isLiveEditable = preview === 'liveview' && language === 'javascript';
    const editMode = isLiveEditable && (getState('live-edit-mode') === 'edit');
    const currentCode = this._editedCode ?? code;
    const codeDisplay = editMode
      ? `<textarea class="code-textarea" spellcheck="false" data-lang="${this.escapeHtml(language)}">${this.escapeHtml(currentCode)}</textarea>`
      : `<pre class="code-content"><code data-lang="${this.escapeHtml(language)}">${language === 'text' || language === 'plain' ? this.escapeHtml(currentCode) : this.highlight(currentCode, language)}</code></pre>`;

    return `
      <div class="live-preview-wrap">
        <div class="code-panel">
          <div class="code-window">
            <div class="code-header">
              <div class="dots">
                <span></span><span></span><span></span>
              </div>
              <span class="code-title">${this.escapeHtml(displayTitle)}</span>
              ${isLiveEditable ? `
              <div class="code-mode-toggle">
                <button type="button" class="mode-btn ${!editMode ? 'active' : ''}" data-mode="view">View</button>
                <button type="button" class="mode-btn ${editMode ? 'active' : ''}" data-mode="edit">Edit</button>
              </div>
              ` : ''}
              <button class="copy-btn" type="button" aria-label="Copy to clipboard">
                <span class="copy-icon-svg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </span>
              </button>
            </div>
            ${codeDisplay}
          </div>
        </div>
        ${preview === 'liveview' ? `
        <div class="preview-panel">
          <div class="preview-header">
            <span>Live Preview</span>
            <div class="preview-actions">
              <button class="run-btn" type="button" aria-label="Run">
                <span class="btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7L8 5Z" fill="currentColor"/>
                  </svg>
                </span>
              </button>
              <button class="inspect-btn" type="button" aria-label="Inspect">
                <span class="btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5h16v14H4V5Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 9h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M8 13h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
              </button>
              <button class="fullscreen-btn" type="button" aria-label="Fullscreen">
                <span class="btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 3h4a2 2 0 0 1 2 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M9 21H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 21h4a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div class="preview-container">
            <iframe class="preview-iframe" title="Live preview" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>
          </div>
          <div class="preview-logs-wrap">
            <div class="preview-logs-header">Console (F12 → select iframe to see in DevTools)</div>
            <div class="preview-logs"></div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        * { box-sizing: border-box; }
        :host { display: block; width: 100%; }
        .live-preview-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 24px 0;
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .live-preview-wrap { grid-template-columns: 1fr; }
          .code-panel, .preview-panel {
            min-height: 320px;
            max-height: none;
          }
        }
        .code-panel, .preview-panel {
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: min(420px, 70vh);
          max-height: min(520px, 75vh);
        }
        .code-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          background: var(--codeblock_bg, #1e293b);
          border-radius: var(--radius_md, 12px);
          overflow: hidden;
          border: 1px solid var(--codeblock_border, #334155);
        }
        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--codeblock_header, #334155);
          padding: 10px 16px;
          border-bottom: 1px solid var(--codeblock_border, #334155);
          gap: 12px;
        }
        .dots { display: flex; gap: 6px; }
        .dots span {
          width: 10px; height: 10px; border-radius: 50%;
        }
        .dots span:nth-child(1) { background: #ff5f56; }
        .dots span:nth-child(2) { background: #ffbd2e; }
        .dots span:nth-child(3) { background: #27c93f; }
        .code-title {
          color: var(--codeblock_muted, #94a3b8);
          font-size: 12px;
          font-family: monospace;
          flex: 1;
        }
        .copy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          background: var(--codeblock_border, #334155);
          border: 1px solid var(--codeblock_border, #334155);
          border-radius: var(--radius_sm, 8px);
          color: var(--codeblock_muted, #94a3b8);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 12px;
        }
        .copy-btn:hover {
          background: #475569;
          color: var(--codeblock_text, #f8fafc);
        }
        .copy-btn.copied { color: #27c93f; }
        .code-mode-toggle {
          display: flex;
          gap: 2px;
          background: var(--codeblock_border, #334155);
          padding: 2px;
          border-radius: 6px;
        }
        .mode-btn {
          padding: 4px 10px;
          font-size: 11px;
          border: none;
          background: transparent;
          color: var(--codeblock_muted, #94a3b8);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .mode-btn:hover { color: var(--codeblock_text, #f8fafc); }
        .mode-btn.active {
          background: var(--codeblock_bg, #1e293b);
          color: var(--codeblock_text, #f8fafc);
        }
        .code-content {
          margin: 0;
          padding: 20px;
          flex: 1;
          min-height: 0;
          color: var(--codeblock_text, #f8fafc);
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre;
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar_thumb, #475569) var(--scrollbar_track, #1e293b);
        }
        .code-content::-webkit-scrollbar { width: 8px; height: 8px; }
        .code-content::-webkit-scrollbar-thumb {
          background: var(--scrollbar_thumb, #475569);
          border-radius: 999px;
        }
        .code-content code { white-space: pre; display: block; }
        .hl-comment { color: var(--codeblock_comment, #64748b); }
        .hl-cmd { color: var(--codeblock_accent, #818cf8); }
        .hl-string { color: var(--codeblock_string, #fbbf24); }
        .hl-number { color: #86efac; }
        .hl-literal { color: var(--codeblock_accent, #818cf8); }
        .hl-function { color: var(--codeblock_accent, #818cf8); }
        .hl-property { color: #7dd3fc; }
        .preview-panel {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          background: var(--codeblock_bg, #1e293b);
          border-radius: var(--radius_md, 12px);
          border: 1px solid var(--codeblock_border, #334155);
          overflow: hidden;
        }
        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--codeblock_header, #334155);
          padding: 10px 16px;
          font-size: 12px;
          color: var(--codeblock_muted, #94a3b8);
          font-family: monospace;
        }
        .preview-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .run-btn {
          padding: 6px 10px;
          background: var(--primary, #6366f1);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .run-btn:hover { opacity: 0.9; }
        .inspect-btn {
          padding: 6px 10px;
          background: var(--codeblock_border, #334155);
          color: var(--codeblock_text, #f8fafc);
          border: 1px solid var(--codeblock_border, #334155);
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .inspect-btn:hover { opacity: 0.9; }
        .fullscreen-btn {
          padding: 6px 10px;
          background: var(--codeblock_border, #334155);
          color: var(--codeblock_text, #f8fafc);
          border: 1px solid var(--codeblock_border, #334155);
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .fullscreen-btn:hover { opacity: 0.9; }
        .code-textarea {
          width: 100%;
          flex: 1;
          min-height: 0;
          margin: 0;
          padding: 20px;
          background: transparent;
          border: none;
          color: var(--codeblock_text, #f8fafc);
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 14px;
          line-height: 1.65;
          resize: none;
          outline: none;
          overflow: auto;
        }
        .preview-container {
          flex: 1;
          min-height: 140px;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .preview-iframe {
          width: 100%;
          flex: 1;
          min-height: 140px;
          border: none;
          display: block;
        }
        .preview-logs-wrap {
          border-top: 1px solid var(--codeblock_border, #334155);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.2s ease;
        }
        .preview-logs-wrap.open {
          max-height: 180px;
        }
        .preview-logs-header {
          padding: 6px 16px;
          font-size: 11px;
          color: var(--codeblock_muted, #94a3b8);
          background: rgba(0,0,0,0.2);
        }
        .preview-logs {
          padding: 8px 16px;
          font-size: 12px;
          font-family: monospace;
          color: var(--codeblock_muted, #94a3b8);
          max-height: 80px;
          overflow-y: auto;
        }
        .log-line {
          margin-bottom: 2px;
          word-break: break-all;
        }
      </style>
    `;
  }
}
