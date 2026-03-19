import { SwitchComponent, decodeData } from '/switch-framework/index.js';
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

export class CodeBlock extends SwitchComponent {
  static tag = 'sw-codeblock';
  static observedAttributes = ['data'];

  onMount() {
    this.shadowRoot.querySelector('.copy-btn')?.addEventListener('click', () => this.copyToClipboard());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this.rerender();
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
    const { code = '' } = data || {};
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

  render() {
    this.data = this.decodeData();
    const { title = 'app.js', code = '', language = 'javascript' } = this.data || {};
    const highlighted = language === 'text' || language === 'plain' ? this.escapeHtml(code) : this.highlight(code, language);

    return `
      <div class="code-window">
        <div class="code-header">
          <div class="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="code-title">${this.escapeHtml(title)}</span>
          <button class="copy-btn" type="button" aria-label="Copy to clipboard">
            <span class="copy-icon-svg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>
          </button>
        </div>
        <pre class="code-content"><code data-lang="${this.escapeHtml(language)}">${highlighted}</code></pre>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';
        *
        {
          box-sizing: border-box;
        }
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
        }

        .code-window {
          background: var(--codeblock_bg, #1e293b);
          border-radius: var(--radius_md, 12px);
          overflow: hidden;
          box-shadow: var(--shadow_md);
          border: 1px solid var(--codeblock_border, #334155);
          width: 100%;
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

        .dots {
          display: flex;
          gap: 6px;
        }

        .dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
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

        .copy-btn.copied {
          color: #27c93f;
        }

        .copy-btn .copy-check-icon {
          font-size: 18px;
          color: #27c93f;
        }

        .code-content {
          margin: 0;
          padding: 20px;
          color: var(--codeblock_text, #f8fafc);
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre;
          overflow-x: auto;
          word-break: normal;
        }

        .code-content code {
          white-space: pre;
          display: block;
          text-align: left !important;
        }

        .hl-comment { color: var(--codeblock_comment, #64748b); }
        .hl-cmd { color: var(--codeblock_accent, #818cf8); }
        .hl-string { color: var(--codeblock_string, #fbbf24); }
        .hl-number { color: #86efac; }
        .hl-literal { color: var(--codeblock_accent, #818cf8); }
        .hl-function { color: var(--codeblock_accent, #818cf8); }
        .hl-property { color: #7dd3fc; }
      </style>
    `;
  }
}
