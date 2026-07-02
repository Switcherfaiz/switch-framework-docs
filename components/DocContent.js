import { SwitchComponent, decodeData } from 'switch-framework';

function readData(el) {
  const raw = el.getAttribute('data');
  if (!raw) return null;
  try {
    return decodeData(raw);
  } catch {
    return null;
  }
}

function createDocTextComponent(tag, className, styleBlock) {
  return class extends SwitchComponent {
    static tag = tag;
    static observedAttributes = ['data'];

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data' && oldValue !== newValue) this.rerender();
    }

    getData() {
      return readData(this) || { html: '' };
    }

    render() {
      const { html = '', id = '' } = this.getData();
      return `<div class="${className}"${id ? ` id="${id}"` : ''}>${html}</div>`;
    }

    onMount() {
      const { id = '' } = this.getData();
      if (id) this.id = id;
    }

    styleSheet() {
      return `<style>${styleBlock}</style>`;
    }
  };
}

export const DocHeading = createDocTextComponent('sw-doc-heading', 'doc-heading', `
  :host { display: block; }
  .doc-heading {
    font-size: 32px;
    font-weight: 800;
    color: var(--main_text);
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
  }
`);

export const DocSubheading = createDocTextComponent('sw-doc-subheading', 'doc-subheading', `
  :host { display: block; }
  .doc-subheading {
    font-size: 32px;
    font-weight: 800;
    color: var(--main_text);
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
  }
`);

export const DocSectionHeading = createDocTextComponent('sw-doc-section-heading', 'doc-section-heading', `
  :host { display: block; }
  .doc-section-heading {
    font-size: 18px;
    font-weight: 700;
    color: var(--main_text);
    margin: 28px 0 12px;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
  }
`);

export const DocSubsectionHeading = createDocTextComponent('sw-doc-subsection-heading', 'doc-subsection-heading', `
  :host { display: block; }
  .doc-subsection-heading {
    font-size: 16px;
    font-weight: 700;
    color: var(--main_text);
    margin: 22px 0 10px;
    letter-spacing: -0.01em;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 12px;
  }
`);

export const DocParagraph = createDocTextComponent('sw-doc-paragraph', 'doc-paragraph', `
  :host { display: block; }
  .doc-paragraph {
    font-size: 15px;
    line-height: 1.7;
    color: var(--sub_text);
    margin: 0 0 20px;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
    color: var(--main_text);
  }
`);

export const DocCallout = createDocTextComponent('sw-doc-callout', 'doc-callout', `
  :host { display: block; }
  .doc-callout {
    background: var(--surface_2);
    border-left: 3px solid var(--primary);
    padding: 16px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--sub_text);
  }
  code {
    background: var(--surface_3);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
  }
`);

export const DocListItem = createDocTextComponent('sw-doc-list-item', 'doc-list-item', `
  :host { display: block; }
  .doc-list-item {
    font-size: 14px;
    line-height: 1.6;
    color: var(--sub_text);
    padding-left: 20px;
    position: relative;
    margin-bottom: 10px;
  }
  .doc-list-item::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 700;
  }
  code {
    background: var(--surface_2);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', monospace;
    font-size: 13px;
  }
`);

export class DocLoader extends SwitchComponent {
  static tag = 'sw-doc-loader';

  render() {
    return `
      <div class="doc-loader" role="status" aria-label="Loading documentation">
        <div class="spinner"></div>
        <span class="label">Loading…</span>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .doc-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px;
          width: 100%;
          max-width: 100%;
          text-align: center;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--border_color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        .label {
          color: var(--muted_text);
          font-size: 14px;
          font-weight: 500;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }
}
