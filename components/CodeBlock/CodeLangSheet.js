import { Modal, registerComponent, ensureState, getState, updateState } from 'switch-framework';
import { CODE_LANGUAGE_OPTIONS } from './codeLanguageOptions.js';

ensureState('code-lang-sheet', { open: false, lang: 'text' });
ensureState('code-lang-pick', null);

/** Open the shared language picker; `onPick(lang)` runs after the sheet closes. */
export function openCodeLangSheet(lang, onPick) {
  updateState('code-lang-pick', () => onPick);
  updateState('code-lang-sheet', { open: true, lang });
}

export class CodeLangSheet extends Modal {
  static tag = 'sw-code-lang-sheet';
  static visibleState = 'code-lang-sheet';
  static animationType = 'slide';
  static presentationStyle = 'pageSheet';

  onMount() {
    this.listener('[data-lang]', 'click', (e) => {
      const lang = e.target.closest('[data-lang]')?.dataset.lang || 'text';
      const onPick = getState('code-lang-pick');
      this.dismiss();
      if (typeof onPick === 'function') onPick(lang);
    });
  }

  render() {
    const { lang } = getState('code-lang-sheet') || {};
    const rows = CODE_LANGUAGE_OPTIONS.map((o) => `
      <button type="button" class="row ${o.value === lang ? 'is-active' : ''}" data-lang="${o.value}">${o.label}</button>
    `).join('');

    return `
      <div class="sheet" aria-label="Select language">
        <div class="handle" aria-hidden="true"></div>
        <div class="title">Language</div>
        ${rows}
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { z-index: 10001; }
        .modal-root.presentation-pageSheet .modal-container > .sheet {
          max-width: 480px;
          max-height: 70vh;
          margin: 0 auto;
          overflow: auto;
          padding: 12px 12px calc(20px + env(safe-area-inset-bottom));
          background: var(--surface_1, var(--page_background, #fff));
          border: 1px solid var(--border_color, #e4e4e7);
          box-shadow: var(--shadow_lg, 0 -8px 32px rgba(0, 0, 0, 0.18));
          font-family: var(--font, 'DM Sans', system-ui, sans-serif);
        }
        .handle {
          width: 36px;
          height: 4px;
          border-radius: 2px;
          background: var(--muted_text, #a1a1aa);
          opacity: 0.5;
          margin: 4px auto 16px;
        }
        .title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--muted_text, #71717a);
          margin: 0 8px 8px;
        }
        .row {
          display: block;
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
          padding: 11px 12px;
          font: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--main_text, #18181b);
          cursor: pointer;
          border-radius: 10px;
        }
        .row:hover,
        .row.is-active {
          background: var(--primary_light, rgba(79, 70, 229, 0.1));
          color: var(--primary, #4f46e5);
        }
      </style>
    `;
  }
}

registerComponent(CodeLangSheet);
