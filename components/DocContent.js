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
    font-size: var(--text-2xl, 34px);
    font-weight: 700;
    line-height: var(--leading-tight, 1.2);
    color: var(--main_text);
    margin: 0 0 14px;
    letter-spacing: -0.035em;
  }
  ${INLINE_CODE}
`);

export const DocSubheading = createDocTextComponent('sw-doc-subheading', 'doc-subheading', `
  :host { display: block; font-family: var(--font); }
  .doc-subheading {
    font-size: var(--text-xl, 22px);
    font-weight: 650;
    line-height: var(--leading-tight, 1.25);
    color: var(--main_text);
    margin: 40px 0 12px;
    letter-spacing: -0.025em;
    padding-top: 8px;
    scroll-margin-top: 88px;
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
    margin: 0 0 18px;
  }
  .doc-paragraph :is(strong, b) { color: var(--main_text); font-weight: 650; }
  ${INLINE_CODE}
`);

const CALLOUT_ICONS = {
  note: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v6M12 8v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  tip: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M8 14c-1.8-1.5-3-3.6-3-6a7 7 0 0 1 14 0c0 2.4-1.2 4.5-3 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v5M12 17.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  important: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.2 6.6L21 12l-6.8 2.4L12 21l-2.2-6.6L3 12l6.8-2.4L12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  caution: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5M12 16.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};

const CALLOUT_LABELS = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  important: 'Important',
  caution: 'Caution'
};

export class DocCallout extends SwitchComponent {
  static tag = 'sw-doc-callout';
  static observedAttributes = ['data'];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && oldValue !== newValue) this.rerender();
  }

  getData() {
    return readData(this) || { html: '', variant: 'note' };
  }

  render() {
    const { html = '', variant: rawVariant = 'note' } = this.getData();
    const variant = CALLOUT_LABELS[rawVariant] ? rawVariant : 'note';
    return `
      <aside class="doc-callout ${variant}" role="note">
        <span class="callout-icon" aria-hidden="true">${CALLOUT_ICONS[variant]}</span>
        <div class="callout-body">
          <div class="callout-label">${CALLOUT_LABELS[variant]}</div>
          <div class="callout-text">${html}</div>
        </div>
      </aside>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: var(--font); margin: 20px 0; }
        .doc-callout {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          border: 1px solid var(--callout_note_border);
          background: var(--callout_note_bg);
          color: var(--callout_note_text);
          border-radius: 12px;
        }
        .callout-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .callout-icon svg { width: 20px; height: 20px; display: block; }
        .callout-body { min-width: 0; flex: 1; }
        .callout-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .callout-text {
          font-size: var(--text-md, 14.5px);
          line-height: 1.65;
          color: inherit;
        }
        .callout-text :is(strong, b) { font-weight: 650; }
        .doc-callout.tip { background: var(--callout_tip_bg); border-color: var(--callout_tip_border); color: var(--callout_tip_text); }
        .doc-callout.warning { background: var(--callout_warning_bg); border-color: var(--callout_warning_border); color: var(--callout_warning_text); }
        .doc-callout.important { background: var(--callout_important_bg); border-color: var(--callout_important_border); color: var(--callout_important_text); }
        .doc-callout.caution { background: var(--callout_caution_bg); border-color: var(--callout_caution_border); color: var(--callout_caution_text); }
        ${INLINE_CODE}
        .doc-callout code {
          background: color-mix(in srgb, currentColor 12%, transparent);
          color: inherit;
        }
      </style>
    `;
  }
}

export class DocDivider extends SwitchComponent {
  static tag = 'sw-doc-divider';

  render() {
    return `<hr class="doc-divider" />`;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; }
        .doc-divider {
          border: none;
          height: 1px;
          background: var(--border_color);
          margin: 28px 0;
        }
      </style>
    `;
  }
}

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
