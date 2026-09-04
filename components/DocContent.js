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

const INLINE_CODE = `
  code {
    background: var(--surface_2);
    padding: 1px 6px;
    border-radius: 5px;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.86em;
    color: var(--code_text);
  }
`;

export const DocHeading = createDocTextComponent('sw-doc-heading', 'doc-heading', `
  :host { display: block; font-family: var(--font); }
  .doc-heading {
    font-size: var(--text-2xl, 32px);
    font-weight: 750;
    line-height: var(--leading-tight, 1.25);
    color: var(--main_text);
    margin: 0 0 12px;
    letter-spacing: -0.03em;
  }
  ${INLINE_CODE}
`);

export const DocSubheading = createDocTextComponent('sw-doc-subheading', 'doc-subheading', `
  :host { display: block; font-family: var(--font); }
  .doc-subheading {
    font-size: var(--text-xl, 22px);
    font-weight: 700;
    line-height: var(--leading-tight, 1.25);
    color: var(--main_text);
    margin: 36px 0 10px;
    letter-spacing: -0.02em;
    padding-top: 8px;
    border-top: 1px solid var(--border_light);
  }
  ${INLINE_CODE}
`);

export const DocSectionHeading = createDocTextComponent('sw-doc-section-heading', 'doc-section-heading', `
  :host { display: block; font-family: var(--font); }
  .doc-section-heading {
    font-size: var(--text-lg, 18px);
    font-weight: 650;
    line-height: 1.35;
    color: var(--main_text);
    margin: 32px 0 10px;
    letter-spacing: -0.015em;
  }
  ${INLINE_CODE}
`);

export const DocSubsectionHeading = createDocTextComponent('sw-doc-subsection-heading', 'doc-subsection-heading', `
  :host { display: block; font-family: var(--font); }
  .doc-subsection-heading {
    font-size: var(--text-md, 15px);
    font-weight: 650;
    line-height: 1.4;
    color: var(--main_text);
    margin: 22px 0 8px;
    letter-spacing: -0.01em;
  }
  ${INLINE_CODE}
`);

export const DocParagraph = createDocTextComponent('sw-doc-paragraph', 'doc-paragraph', `
  :host { display: block; font-family: var(--font); }
  .doc-paragraph {
    font-size: var(--text-body, 16px);
    line-height: var(--leading-body, 1.75);
    color: var(--sub_text);
    margin: 0 0 16px;
  }
  ${INLINE_CODE}
`);

export const DocCallout = createDocTextComponent('sw-doc-callout', 'doc-callout', `
  :host { display: block; font-family: var(--font); }
  .doc-callout {
    background: var(--surface_1);
    border: 1px solid var(--border_light);
    border-left: 3px solid var(--primary);
    padding: 14px 18px;
    margin: 20px 0;
    border-radius: 0 var(--radius_sm, 8px) var(--radius_sm, 8px) 0;
    font-size: var(--text-md, 15px);
    line-height: 1.65;
    color: var(--sub_text);
  }
  ${INLINE_CODE}
`);

export const DocListItem = createDocTextComponent('sw-doc-list-item', 'doc-list-item', `
  :host { display: block; font-family: var(--font); }
  .doc-list-item {
    font-size: var(--text-body, 16px);
    line-height: 1.7;
    color: var(--sub_text);
    padding-left: 20px;
    position: relative;
    margin-bottom: 8px;
  }
  .doc-list-item::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 0.7em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
  }
  ${INLINE_CODE}
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
