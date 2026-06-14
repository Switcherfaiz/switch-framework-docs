import hljs from '/codehighlighter/codehighlighter.js';
import { SwitchComponent } from 'switch-framework';
import { codeBlockStyleSheet } from './styleSheet.js';
import { ensureCodeAssetsInHead, ensureHljsStylesInShadow } from './codeFonts.js';
import {
  createCodeBlockFunctionality,
  renderCodeBlockShell,
  getBlockPayload,
} from './functionality.js';
import { closeCodeLangSheet } from './langSheetPortal.js';
import { closeFullscreenPortal } from './fullscreenPortal.js';

export class CodeBlock extends SwitchComponent {
  static tag = 'sw-codeblock';
  static observedAttributes = ['data'];

  constructor() {
    super();
    this._uiLanguage = null;
    this._handlersBound = false;
    this._mounted = false;
    Object.assign(this, createCodeBlockFunctionality(this, hljs));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || name !== 'data') return;
    if (!this._mounted) return;
    this.patchCodeContent?.();
  }

  render() {
    const block = getBlockPayload(this);
    if (!block) return '';
    return renderCodeBlockShell(block);
  }

  onMount() {
    ensureCodeAssetsInHead();
    ensureHljsStylesInShadow(this.shadowRoot);
    this._mounted = true;
    this.bindHandlers?.();
    this.applyHighlight?.();
  }

  onDestroy() {
    closeCodeLangSheet();
    this.closeFullscreen?.();
    closeFullscreenPortal();
    this._handlersBound = false;
    this._mounted = false;
  }

  styleSheet() {
    return codeBlockStyleSheet();
  }
}

export default CodeBlock;
