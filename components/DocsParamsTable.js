import { decodeData } from '/switch-framework/index.js';

export class DocsParamsTable extends HTMLElement {
  static observedAttributes = ['data'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
  }

  connectedCallback() {
    this._data = this.decodeData();
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this._data = this.decodeData();
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

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    const { headers = [], rows = [], htmlColumns = [] } = this._data || {};
    const htmlSet = new Set(htmlColumns);

    const thead = headers.length
      ? `<thead><tr>${headers.map((h) => `<th>${this.escapeHtml(h)}</th>`).join('')}</tr></thead>`
      : '';

    const tbody =
      rows.length
        ? `<tbody>${rows
            .map((row) => {
              const cells = Array.isArray(row) ? row : headers.map((_, i) => row[headers[i]] ?? row[i] ?? '');
              return `<tr>${cells.map((cell, i) => {
                const content = typeof cell === 'string' ? cell : String(cell ?? '');
                const html = htmlSet.has(i) ? content : this.escapeHtml(content);
                return `<td>${html}</td>`;
              }).join('')}</tr>`;
            })
            .join('')}</tbody>`
        : '';

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="table-wrap">
        <table class="params-table">
          ${thead}
          ${tbody}
        </table>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 28px 0;
        }

        .table-wrap {
          overflow-x: auto;
          border-radius: var(--radius_sm, 8px);
          border: 1px solid var(--border_color);
        }

        .params-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .params-table th,
        .params-table td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid var(--border_color);
        }

        .params-table th {
          background: var(--surface_2);
          font-weight: 600;
          color: var(--main_text);
        }

        .params-table td {
          color: var(--sub_text);
          vertical-align: top;
        }

        .params-table tr:last-child td {
          border-bottom: none;
        }

        .params-table code {
          background: var(--surface_3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, Consolas, monospace;
          font-size: 13px;
          color: var(--code_text);
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-params-table')) {
  customElements.define('sw-docs-params-table', DocsParamsTable);
}
