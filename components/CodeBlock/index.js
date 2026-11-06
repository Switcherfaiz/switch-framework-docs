import hljs from '/codehighlighter/codehighlighter.js';
import { SwitchComponent, registerComponent, useState } from 'switch-framework';
import { copyText } from '/utils/clipboard.js';
import { codeBlockStyleSheet } from './styleSheet.js';
import { ensureCodeAssetsInHead } from './codeFonts.js';
import { escapeHtml, highlight, langToHljs, languageLabel, lineCount, isRunnable } from './codeUtils.js';
import { openCodeFullscreen } from './CodeFullscreen.js';
import { openCodeLangSheet } from './CodeLangSheet.js';

/**
 * Props: { code, language, title?, preview? } — `preview: 'liveview'` runs the
 * code as a Switch component in /preview.html.
 */
export class CodeBlock extends SwitchComponent {
  static tag = 'sw-codeblock';

  block() {
    const { code, content, text, language, lang, title = '', preview = '' } = this.getProps();
    return {
      code: String(code ?? content ?? text ?? ''),
      language: this._pickedLang || String(language || lang || 'text').trim() || 'text',
      title,
      preview,
    };
  }

  onMount() {
    ensureCodeAssetsInHead();
    this.listener('#code-lang', 'click', () => openCodeLangSheet(this.block().language, (l) => this._setLang(l)));
    this.listener('#code-run', 'click', () => openCodeFullscreen({ ...this.block(), tab: 'preview' }));
    this.listener('#code-expand', 'click', () => openCodeFullscreen({ ...this.block(), tab: 'code' }));
    this.listener('#code-copy', 'click', () => this.copy());
  }

  async copy() {
    if (!(await copyText(this.block().code))) return;
    const btn = this.select('#code-copy');
    btn?.classList.add('is-copied');
    btn?.replaceChildren(...this.copyLabel('switch_icon_check', 'Copied'));
    setTimeout(() => {
      btn?.classList.remove('is-copied');
      btn?.replaceChildren(...this.copyLabel('switch_icon_copy', 'Copy'));
    }, 1400);
  }

  copyLabel(iconClass, text) {
    const icon = document.createElement('span');
    icon.className = iconClass;
    const label = document.createElement('span');
    label.className = 'copy-label';
    label.textContent = text;
    return [icon, label];
  }

  render() {
    const [pickedLang, setLang] = useState(null);
    this._pickedLang = pickedLang;
    this._setLang = setLang;
    const { code, language, title, preview } = this.block();

    const gutter = Array.from({ length: lineCount(code) }, (_, i) => `<span>${i + 1}</span>`).join('');

    return `
      <div class="code-card">
        <div class="code-toolbar">
          <div class="code-toolbar-meta">
            <button type="button" class="code-lang-btn" id="code-lang">${escapeHtml(languageLabel(language))}</button>
            ${title ? `<span class="code-file-label">${escapeHtml(title)}</span>` : ''}
          </div>
          <div class="code-toolbar-actions">
            ${isRunnable(language, code, preview) ? '<button type="button" class="code-icon-btn" id="code-run" aria-label="Run preview"><span class="switch_icon_play"></span></button>' : ''}
            <button type="button" class="code-copy-btn" id="code-copy" aria-label="Copy code">
              <span class="switch_icon_copy"></span><span class="copy-label">Copy</span>
            </button>
            <button type="button" class="code-icon-btn" id="code-expand" aria-label="Expand code"><span class="switch_icon_fullscreen"></span></button>
          </div>
        </div>
        <div class="code-scroll">
          <div class="code-gutter" aria-hidden="true">${gutter}</div>
          <div class="code-editor-panel">
            <pre class="code-pre"><code class="hljs language-${langToHljs(language)}">${highlight(hljs, code, language)}</code></pre>
          </div>
        </div>
      </div>
      <sw-code-fullscreen></sw-code-fullscreen>
      <sw-code-lang-sheet></sw-code-lang-sheet>
    `;
  }

  styleSheet() {
    return codeBlockStyleSheet();
  }
}

registerComponent(CodeBlock);

export default CodeBlock;
