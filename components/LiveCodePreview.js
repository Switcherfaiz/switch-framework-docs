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
    this._runPreview();
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
    this.shadowRoot.querySelector('.copy-btn')?.addEventListener('click', () => this.copyToClipboard());
    this.shadowRoot.querySelector('.run-btn')?.addEventListener('click', () => this.runPreview());
    const textarea = this.shadowRoot.querySelector('.code-textarea');
    if (textarea) textarea.addEventListener('input', () => this.syncCodeFromEdit());
    this.shadowRoot.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        const ta = this.shadowRoot?.querySelector('.code-textarea');
        if (ta) this._editedCode = ta.value;
        else if (mode === 'edit') this._editedCode = this._editedCode ?? this.decodeData()?.code;
        updateState('live-edit-mode', mode);
      });
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
    this._runPreview(this.getCurrentCode());
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
      this.rerender();
      this._runPreview();
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

    const base = window.location.origin;
    const importMap = JSON.stringify({
      imports: {
        'switch-framework': `${base}/switch-framework/index.js`,
        'switch-framework/router': `${base}/switch-framework/router/index.js`
      }
    });

    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<script type="importmap">${importMap}</script>
<style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;}</style>
</head><body>
<div id="preview-root"></div>
<script type="module">
(function(){
  const _log = console.log;
  console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    try { window.parent?.postMessage?.({ type: 'live-preview-log', payload: msg }, '*'); } catch(e){}
    _log.apply(console, args);
  };
})();
try {
  const { createState } = await import('switch-framework');
  createState('counter', 0);
  const code = ${JSON.stringify(codeToRun)};
  const blob = new Blob([code], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const mod = await import(url);
  URL.revokeObjectURL(url);
  const Export = mod.Counter || mod.default || Object.values(mod).find(v => typeof v === 'function');
  if (Export?.tag) {
    if (!customElements.get(Export.tag)) customElements.define(Export.tag, Export);
    document.getElementById('preview-root').innerHTML = '<' + Export.tag + '></' + Export.tag + '>';
  }
} catch (err) {
  document.getElementById('preview-root').innerHTML = '<pre style="color:#ef4444;font-size:12px;white-space:pre-wrap;">' + err.message + '</pre>';
}
</script>
</body></html>`;

    const iframe = this.shadowRoot?.querySelector('.preview-iframe');
    if (iframe) {
      iframe.srcdoc = html;
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
            <button class="run-btn" type="button" aria-label="Run">Run</button>
          </div>
          <div class="preview-container">
            <iframe class="preview-iframe" title="Live preview" sandbox="allow-scripts allow-same-origin"></iframe>
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
        .run-btn {
          padding: 6px 14px;
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
          max-height: 100px;
          overflow: hidden;
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
