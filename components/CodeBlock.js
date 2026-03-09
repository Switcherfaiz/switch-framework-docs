import { encodeData, decodeData } from '/switch-framework/index.js';

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

  render() {
    const { title = 'app.js', code = '', language = 'javascript' } = this.data || {};

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="code-window">
        <div class="code-header">
          <div class="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="code-title">${title}</span>
        </div>
        <pre class="code-content"><code data-lang="${language}">${this.escapeHtml(code)}</code></pre>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 500px;
        }

        .code-window {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          width: 100%;
          height: 100%;
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #2d2d2d;
          padding: 12px 16px;
          border-bottom: 1px solid #3f3f3f;
        }

        .dots {
          display: flex;
          gap: 6px;
        }

        .dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff5f56;
        }

        .dots span:nth-child(2) {
          background: #ffbd2e;
        }

        .dots span:nth-child(3) {
          background: #27c93f;
        }

        .code-title {
          color: #cccccc;
          font-size: 13px;
          font-family: monospace;
        }

        .code-content {
          margin: 0;
          padding: 24px;
          color: #d4d4d4;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          overflow-x: auto;
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-codeblock')) {
  customElements.define('sw-codeblock', CodeBlock);
}
