import { encodeData, decodeData } from '/switch-framework/index.js';

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
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="hl-literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>')
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(?=\()/g, '<span class="hl-function">$1</span>$2');
}

function highlightBash(code) {
  return code
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="hl-string">$&</span>')
    .replace(/\b(npm|npx|cd|ls|mkdir|echo|export)\b/g, '<span class="hl-cmd">$1</span>');
}

function highlightJson(code) {
  return code
    .replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="hl-string">$&</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="hl-literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>')
    .replace(/"([^"]+)":/g, '<span class="hl-property">"$1"</span>:');
}

export class CodeBlock extends HTMLElement {
  static observedAttributes = ['data'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = null;
  }

  connectedCallback() {
    this.data = this.decodeData();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this.data = this.decodeData();
      this.render();
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
    const { code = '' } = this.data || {};
    try {
      await navigator.clipboard.writeText(code);
      const btn = this.shadowRoot.querySelector('.copy-btn');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<span class="copied">Copied!</span>';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
      }
    } catch (_) {}
  }

  render() {
    const { title = 'app.js', code = '', language = 'javascript' } = this.data || {};
    const highlighted = language === 'text' || language === 'plain' ? this.escapeHtml(code) : this.highlight(code, language);

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="code-window">
        <div class="code-header">
          <div class="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="code-title">${this.escapeHtml(title)}</span>
          <button class="copy-btn" type="button" aria-label="Copy to clipboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <pre class="code-content"><code data-lang="${this.escapeHtml(language)}">${highlighted}</code></pre>
      </div>
    `;

    this.shadowRoot.querySelector('.copy-btn')?.addEventListener('click', () => this.copyToClipboard());
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
        }

        .code-window {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 100%;
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #2d2d2d;
          padding: 10px 16px;
          border-bottom: 1px solid #3f3f3f;
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
          color: #9ca3af;
          font-size: 12px;
          font-family: monospace;
          flex: 1;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          background: #3f3f3f;
          border: none;
          border-radius: 6px;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 12px;
        }

        .copy-btn:hover {
          background: #4f4f4f;
          color: #e5e7eb;
        }

        .copy-btn .copied {
          color: #27c93f;
        }

        .code-content {
          margin: 0;
          padding: 20px;
          color: #d4d4d4;
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
        }

        .hl-cmd { color: #569cd6; }
        .hl-string { color: #ce9178; }
        .hl-number { color: #b5cea8; }
        .hl-literal { color: #569cd6; }
        .hl-function { color: #dcdcaa; }
        .hl-property { color: #9cdcfe; }
      </style>
    `;
  }
}

if (!customElements.get('sw-codeblock')) {
  customElements.define('sw-codeblock', CodeBlock);
}
