import { SwitchComponent, decodeData } from 'switch-framework';
import { formatInline } from '/utils/inline-format.js';

export class DocsParamsTable extends SwitchComponent {
  static tag = 'sw-docs-params-table';
  static observedAttributes = ['data'];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) {
      this._renderToShadow();
    }
  }

  getData() {
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

  formatCell(content, allowHtml) {
    const text = String(content ?? '');
    if (allowHtml || text.includes('[[') || /<[a-z][\s\S]*>/i.test(text)) {
      return formatInline(text);
    }
    return this.escapeHtml(text);
  }

  render() {
    const _data = this.getData();
    const { headers = [], rows = [], htmlColumns = [] } = _data || {};
    const htmlSet = new Set(htmlColumns);

    const thead = headers.length
      ? `<thead><tr>${headers.map((h, i) => {
          const allow = htmlSet.has(i) || String(h).includes('[[') || /<[a-z]/i.test(String(h));
          return `<th>${this.formatCell(h, allow)}</th>`;
        }).join('')}</tr></thead>`
      : '';

    const tbody =
      rows.length
        ? `<tbody>${rows
            .map((row) => {
              const cells = Array.isArray(row) ? row : headers.map((_, i) => row[headers[i]] ?? row[i] ?? '');
              return `<tr>${cells.map((cell, i) => {
                const allow = htmlSet.has(i);
                return `<td>${this.formatCell(cell, allow)}</td>`;
              }).join('')}</tr>`;
            })
            .join('')}</tbody>`
        : '';

    return `
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
          border-radius: 12px;
          border: 1px solid var(--border_color);
          background: var(--surface_1);
        }

        .params-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm, 13px);
        }

        .params-table th,
        .params-table td {
          padding: 10px 14px;
          text-align: left;
          border-bottom: 1px solid var(--border_color);
          vertical-align: top;
          line-height: 1.55;
        }

        .params-table th {
          font-weight: 650;
          color: var(--main_text);
          background: var(--surface_2);
        }

        .params-table tr:last-child td {
          border-bottom: none;
        }

        .params-table td {
          color: var(--sub_text);
        }

        .params-table code {
          background: var(--surface_2);
          padding: 1px 5px;
          border-radius: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 0.9em;
          color: var(--code_text);
        }
      </style>
    `;
  }
}
