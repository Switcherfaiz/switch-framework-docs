import { decodeData } from 'switch-framework';
import { CODE_LANGUAGE_OPTIONS } from './codeLanguageOptions.js';
import { openCodeLangSheet, closeCodeLangSheet } from './langSheetPortal.js';
import { openFullscreenPortal, closeFullscreenPortal } from './fullscreenPortal.js';
import { copyText } from '/utils/clipboard.js';
import { formatHighlighted, langToHljs } from './highlightUtils.js';
import { ensureCodeAssetsInHead, whenCodeAssetsReady } from './codeFonts.js';

export const CODE_BLOCK_TAG = 'sw-codeblock';

const RUNNABLE = new Set(['html', 'css', 'javascript', 'jsx', 'tsx', 'typescript']);

export function getBlockPayload(host) {
  const raw = host.getAttribute('data');
  if (!raw) return null;
  try {
    const data = decodeData(raw);
    return {
      language: data?.language || data?.lang || 'text',
      content: data?.code || data?.content || data?.text || '',
      title: data?.title || '',
      preview: data?.preview || '',
    };
  } catch {
    return null;
  }
}

export function getCodeBlockText(block, host) {
  if (host?._editedCode != null) return String(host._editedCode);
  return String(block?.content ?? block?.code ?? block?.text ?? '');
}

export function getCodeBlockLanguage(block) {
  return String(block?.language || block?.lang || 'text').trim() || 'text';
}

export function isLiveViewBlock(block) {
  const preview = String(block?.preview || '').toLowerCase();
  const lang = getCodeBlockLanguage(block).toLowerCase();
  return preview === 'liveview' && ['javascript', 'js', 'jsx', 'typescript', 'tsx'].includes(lang);
}

export function getLanguageLabel(lang) {
  return CODE_LANGUAGE_OPTIONS.find((o) => o.value === lang)?.label || lang;
}

export function isRunnableLanguage(lang) {
  return RUNNABLE.has(String(lang || '').toLowerCase());
}

export { langToHljs, formatHighlighted } from './highlightUtils.js';

export function buildPreviewHtml(lang, code) {
  const l = String(lang || '').toLowerCase();
  if (l === 'html' || l === 'htm') return code;
  if (l === 'css') {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body><p>Preview</p></body></html>`;
  }
  if (['javascript', 'jsx', 'typescript', 'tsx'].includes(l)) {
    const safe = code.replace(/<\/script>/gi, '<\\/script>');
    return `<!DOCTYPE html><html><body><div id="app"></div><script>${safe}<\/script></body></html>`;
  }
  const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre>${escaped}</pre>`;
}

export function buildComponentPreviewUrl(code) {
  const encodedCode = btoa(encodeURIComponent(String(code ?? '')));
  const base = window.location.origin;
  const runId = Date.now();
  return `${base}/preview.html?run=${runId}#${encodedCode}`;
}

export function renderCodeBlockShell(block) {
  const lang = getCodeBlockLanguage(block);
  const label = getLanguageLabel(lang);
  const hljsLang = langToHljs(lang);
  const runnable = isRunnableLanguage(lang) || isLiveViewBlock(block);
  const title = block?.title ? String(block.title) : '';

  return `
    <div class="code-card">
      <div class="code-toolbar">
        <button type="button" class="code-lang-btn" id="code-lang-open">${label}</button>
        ${title ? `<span class="code-file-label">${title}</span>` : ''}
        <div class="code-toolbar-actions">
          ${runnable ? '<button type="button" class="code-icon-btn" id="code-run" aria-label="Run preview"><span class="switch_icon_play"></span></button>' : ''}
          <button type="button" class="code-icon-btn" id="code-copy" aria-label="Copy code"><span class="switch_icon_copy"></span></button>
          <button type="button" class="code-icon-btn" id="code-expand" aria-label="Expand code"><span class="switch_icon_fullscreen"></span></button>
        </div>
      </div>
      <div class="code-editor-panel">
        <pre class="code-pre"><code class="hljs language-${hljsLang}" id="code-inline" data-code-body></code></pre>
      </div>
    </div>`;
}

export function renderFullscreenShell(block, { label, hljsLang, runnable, liveView }) {
  return `
    <div class="code-fs-head">
      <button type="button" class="code-icon-btn code-fs-close" id="code-fs-close" aria-label="Done">
        <span class="switch_icon_compress"></span>
      </button>
      <button type="button" class="code-fs-lang" id="code-fs-lang-open">${label}</button>
      <div class="code-fs-actions">
        ${liveView ? `
        <div class="code-fs-mode-toggle">
          <button type="button" class="code-fs-mode-btn is-active" id="code-fs-mode-view" data-mode="view">View</button>
          <button type="button" class="code-fs-mode-btn" id="code-fs-mode-edit" data-mode="edit">Edit</button>
        </div>` : ''}
        ${runnable ? `
        <button type="button" class="code-icon-btn code-fs-run" id="code-fs-run" aria-label="Run preview">
          <span class="switch_icon_play"></span>
        </button>
        <button type="button" class="code-icon-btn" id="code-fs-tab-code" aria-label="Code">
          <span class="switch_icon_code"></span>
        </button>
        <button type="button" class="code-icon-btn" id="code-fs-tab-preview" aria-label="Preview">
          <span class="switch_icon_eye"></span>
        </button>` : ''}
        <button type="button" class="code-icon-btn" id="code-fs-copy" aria-label="Copy code">
          <span class="switch_icon_copy"></span>
        </button>
      </div>
    </div>
    <div class="code-fs-body">
      <div class="code-fs-pane" id="code-fs-pane-code">
        <pre class="code-pre code-fs-pre" id="code-fs-view-wrap"><code class="hljs language-${hljsLang}" id="code-full" data-code-body></code></pre>
        ${liveView ? '<textarea class="code-fs-edit is-hidden" id="code-fs-edit" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>' : ''}
      </div>
      <div class="code-fs-pane is-hidden" id="code-fs-pane-preview">
        <iframe title="Code preview" id="code-fs-preview-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>`;
}

export function createCodeBlockFunctionality(host, hljs) {
  let uiLanguage = 'text';
  let fullscreenTab = 'code';
  let fsEditMode = false;
  let fsPortal = null;
  let fsClickHandler = null;

  const getBlock = () => getBlockPayload(host);

  const getText = () => {
    const ta = fsPortal?.querySelector('#code-fs-edit');
    if (ta && fsEditMode) return ta.value;
    return getCodeBlockText(getBlock(), host);
  };

  const paintCode = (el, text, language) => {
    if (!el || !hljs) return;
    const hljsLang = langToHljs(language);
    el.className = `hljs language-${hljsLang}`;
    el.innerHTML = formatHighlighted(hljs, text, language);
  };

  const applyHighlight = () => {
    const block = getBlock();
    if (!block) return;
    const text = getText();
    uiLanguage = host._uiLanguage || getCodeBlockLanguage(block);
    paintCode(host.shadowRoot?.querySelector('#code-inline'), text, uiLanguage);
    if (fsPortal && fullscreenTab === 'code' && !fsEditMode) {
      paintCode(fsPortal.querySelector('#code-full'), text, uiLanguage);
    }
  };

  const syncEditTextarea = () => {
    const ta = fsPortal?.querySelector('#code-fs-edit');
    if (ta) ta.value = getCodeBlockText(getBlock(), host);
  };

  const persistEditText = () => {
    const ta = fsPortal?.querySelector('#code-fs-edit');
    if (ta && fsEditMode) host._editedCode = ta.value;
  };

  const setFsEditMode = (edit) => {
    fsEditMode = !!edit;
    if (!fsPortal) return;
    fsPortal.querySelector('#code-fs-mode-view')?.classList.toggle('is-active', !fsEditMode);
    fsPortal.querySelector('#code-fs-mode-edit')?.classList.toggle('is-active', fsEditMode);
    fsPortal.querySelector('#code-fs-view-wrap')?.classList.toggle('is-hidden', fsEditMode);
    fsPortal.querySelector('#code-fs-edit')?.classList.toggle('is-hidden', !fsEditMode);
    if (fsEditMode) {
      syncEditTextarea();
      fsPortal.querySelector('#code-fs-edit')?.focus();
    } else {
      persistEditText();
      applyHighlight();
    }
  };

  const loadFullscreenPreview = () => {
    const block = getBlock();
    if (!block || !fsPortal) return;
    const iframe = fsPortal.querySelector('#code-fs-preview-iframe');
    if (!iframe) return;
    persistEditText();
    const code = getText();
    if (isLiveViewBlock(block)) {
      iframe.removeAttribute('srcdoc');
      iframe.src = buildComponentPreviewUrl(code);
    } else {
      iframe.removeAttribute('src');
      iframe.srcdoc = buildPreviewHtml(uiLanguage, code);
    }
  };

  const setLanguage = (lang) => {
    uiLanguage = lang;
    host._uiLanguage = lang;
    const label = getLanguageLabel(lang);
    host.shadowRoot?.querySelector('.code-lang-btn')?.replaceChildren(document.createTextNode(label));
    fsPortal?.querySelector('#code-fs-lang-open')?.replaceChildren(document.createTextNode(label));
    const runBtn = host.shadowRoot?.querySelector('#code-run');
    const block = getBlock();
    const runnable = isRunnableLanguage(lang) || isLiveViewBlock(block);
    if (runBtn) runBtn.style.display = runnable ? '' : 'none';
    applyHighlight();
    closeCodeLangSheet();
    if (fullscreenTab === 'preview') loadFullscreenPreview();
  };

  const openLangPicker = () => {
    openCodeLangSheet({
      options: CODE_LANGUAGE_OPTIONS,
      activeLang: uiLanguage,
      onPick: (lang) => setLanguage(lang),
    });
  };

  const setFullscreenTab = (tab) => {
    fullscreenTab = tab === 'preview' ? 'preview' : 'code';
    if (!fsPortal) return;
    fsPortal.querySelector('#code-fs-pane-code')?.classList.toggle('is-hidden', fullscreenTab !== 'code');
    fsPortal.querySelector('#code-fs-pane-preview')?.classList.toggle('is-hidden', fullscreenTab !== 'preview');
    fsPortal.querySelector('#code-fs-tab-code')?.classList.toggle('is-active', fullscreenTab === 'code');
    fsPortal.querySelector('#code-fs-tab-preview')?.classList.toggle('is-active', fullscreenTab === 'preview');
    if (fullscreenTab === 'code') applyHighlight();
    else loadFullscreenPreview();
  };

  const bindFullscreenHandlers = () => {
    if (!fsPortal || fsClickHandler) return;

    fsClickHandler = async (e) => {
      if (e.target?.closest?.('#code-fs-lang-open')) {
        openLangPicker();
        return;
      }

      if (e.target?.closest?.('#code-fs-mode-view')) {
        setFsEditMode(false);
        return;
      }

      if (e.target?.closest?.('#code-fs-mode-edit')) {
        setFsEditMode(true);
        return;
      }

      if (e.target?.closest?.('#code-fs-run')) {
        persistEditText();
        setFullscreenTab('preview');
        return;
      }

      if (e.target?.closest?.('#code-fs-tab-code')) {
        setFullscreenTab('code');
        return;
      }

      if (e.target?.closest?.('#code-fs-tab-preview')) {
        persistEditText();
        setFullscreenTab('preview');
        return;
      }

      if (e.target?.closest?.('#code-fs-copy')) {
        persistEditText();
        const ok = await copyText(getText());
        if (ok) {
          const icon = fsPortal.querySelector('#code-fs-copy span');
          if (icon) {
            icon.className = 'switch_icon_check';
            setTimeout(() => { icon.className = 'switch_icon_copy'; }, 1200);
          }
        }
        return;
      }

      if (e.target?.closest?.('#code-fs-close')) {
        closeFullscreen();
      }
    };

    fsPortal.addEventListener('click', fsClickHandler);

    const ta = fsPortal.querySelector('#code-fs-edit');
    if (ta) {
      ta.addEventListener('input', () => {
        host._editedCode = ta.value;
      });
    }
  };

  const openFullscreen = async (tab = 'code') => {
    const block = getBlock();
    if (!block) return;
    ensureCodeAssetsInHead();
    await whenCodeAssetsReady();
    const lang = getCodeBlockLanguage(block);
    const label = getLanguageLabel(uiLanguage || lang);
    const hljsLang = langToHljs(uiLanguage || lang);
    const liveView = isLiveViewBlock(block);
    const runnable = isRunnableLanguage(lang) || liveView;

    closeCodeLangSheet();
    fsEditMode = false;
    fullscreenTab = tab === 'preview' ? 'preview' : 'code';

    fsPortal = openFullscreenPortal(
      renderFullscreenShell(block, { label, hljsLang, runnable, liveView }),
      host,
    );

    bindFullscreenHandlers();
    syncEditTextarea();
    applyHighlight();
    setFullscreenTab(fullscreenTab);
  };

  const closeFullscreen = () => {
    persistEditText();
    closeCodeLangSheet();
    if (fsPortal && fsClickHandler) {
      fsPortal.removeEventListener('click', fsClickHandler);
      fsClickHandler = null;
    }
    fsPortal = null;
    fsEditMode = false;
    closeFullscreenPortal();
  };

  const goFullscreenPreview = () => {
    openFullscreen('preview');
  };

  const bindHandlers = () => {
    const root = host.shadowRoot;
    if (!root || host._handlersBound) return;
    host._handlersBound = true;

    root.addEventListener('click', async (e) => {
      if (e.target?.closest?.('#code-lang-open')) {
        openLangPicker();
        return;
      }

      if (e.target?.closest?.('#code-run')) {
        goFullscreenPreview();
        return;
      }

      if (e.target?.closest?.('#code-copy')) {
        const ok = await copyText(getText());
        if (ok) {
          const icon = root.querySelector('#code-copy span');
          if (icon) {
            icon.className = 'switch_icon_check';
            setTimeout(() => { icon.className = 'switch_icon_copy'; }, 1200);
          }
        }
        return;
      }

      if (e.target?.closest?.('#code-expand')) {
        openFullscreen('code');
      }
    });
  };

  const patchCodeContent = () => {
    const block = getBlock();
    if (!block) return;
    host._editedCode = null;
    if (!host._uiLanguage) uiLanguage = getCodeBlockLanguage(block);
    applyHighlight();
    if (fsPortal && fullscreenTab === 'preview') loadFullscreenPreview();
  };

  return {
    applyHighlight,
    bindHandlers,
    patchCodeContent,
    closeFullscreen,
  };
}
