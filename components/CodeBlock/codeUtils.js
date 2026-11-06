import { CODE_LANGUAGE_OPTIONS } from './codeLanguageOptions.js';
import { buildComponentPreviewUrl } from '/utils/livePreview.js';

const HLJS_ALIASES = {
  text: 'plaintext',
  plain: 'plaintext',
  js: 'javascript',
  mjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  md: 'markdown',
  sh: 'bash',
  shell: 'bash',
  htm: 'xml',
  svg: 'xml',
  cs: 'csharp',
  kt: 'kotlin',
};

const RUNNABLE = new Set(['html', 'htm', 'css', 'javascript', 'js', 'jsx', 'typescript', 'tsx']);
const SCRIPT_LANGS = new Set(['javascript', 'js', 'jsx', 'typescript', 'tsx']);

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function langToHljs(language) {
  const l = String(language || 'text').toLowerCase().trim();
  return HLJS_ALIASES[l] || l;
}

export function highlight(hljs, source, language) {
  const code = String(source ?? '').trim();
  if (!code || !hljs) return escapeHtml(code);
  try {
    return hljs.highlight(code, { language: langToHljs(language) }).value;
  } catch {
    return hljs.highlightAuto(code).value;
  }
}

export function lineCount(source) {
  return Math.max(1, String(source ?? '').trim().split('\n').length);
}

export function languageLabel(lang) {
  return CODE_LANGUAGE_OPTIONS.find((o) => o.value === lang)?.label || lang;
}

/** Switch components run in /preview.html; everything else runs in a srcdoc iframe. */
export function isLiveView(language, code, preview) {
  if (!SCRIPT_LANGS.has(String(language).toLowerCase())) return false;
  if (String(preview || '').toLowerCase() === 'liveview') return true;
  const src = String(code || '');
  return /\bextends\s+(SwitchComponent|FlatList|ScrollView)\b/.test(src) && /\bstatic\s+tag\s*=/.test(src);
}

export function isRunnable(language, code, preview) {
  return RUNNABLE.has(String(language).toLowerCase()) || isLiveView(language, code, preview);
}

function previewDocument(language, code) {
  const l = String(language).toLowerCase();
  if (l === 'html' || l === 'htm') return code;
  if (l === 'css') return `<!DOCTYPE html><html><head><style>${code}</style></head><body><p>Preview</p></body></html>`;
  if (SCRIPT_LANGS.has(l)) {
    const safe = code.replace(/<\/script>/gi, '<\\/script>');
    return `<!DOCTYPE html><html><body><div id="app"></div><script>${safe}<\/script></body></html>`;
  }
  return `<pre>${escapeHtml(code)}</pre>`;
}

/** iframe attribute for running `code`: `src="…"` for live view, `srcdoc="…"` otherwise. */
export function previewFrameAttr(language, code, preview) {
  if (isLiveView(language, code, preview)) return `src="${escapeHtml(buildComponentPreviewUrl(code))}"`;
  return `srcdoc="${escapeHtml(previewDocument(language, code))}"`;
}
