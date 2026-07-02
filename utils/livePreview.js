/** Shared live-preview shell used by preview.html and CodeBlock run/preview. */

export const LIVE_PREVIEW_STYLESHEETS = [
  '/assets/styles/styles.css',
  '/assets/icons/style.css',
];

export const LIVE_PREVIEW_IMPORT_MAP = {
  imports: {
    'switch-framework': '/switch-framework/index.js',
    'switch-framework/router': '/switch-framework/router/index.js',
  },
};

export function buildComponentPreviewUrl(code) {
  const encodedCode = btoa(encodeURIComponent(String(code ?? '')));
  const base = window.location.origin;
  const runId = Date.now();
  return `${base}/preview.html?run=${runId}#${encodedCode}`;
}

export function buildLivePreviewHeadHtml() {
  const links = LIVE_PREVIEW_STYLESHEETS
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join('\n  ');
  const importMap = JSON.stringify(LIVE_PREVIEW_IMPORT_MAP, null, 2);
  return `${links}
  <script type="importmap">
  ${importMap}
  </script>`;
}

export async function loadGlobalIconSheetForPreview() {
  const { setGlobalComponentSheet } = await import('switch-framework');
  try {
    const res = await fetch('/assets/icons/style.css');
    if (!res.ok) return;
    let css = await res.text();
    css = css.replace(/url\((['"]?)fonts\//g, 'url($1/assets/icons/fonts/');
    await setGlobalComponentSheet(css);
  } catch (_) {}
}

export async function mountPreviewComponent(code, rootEl) {
  const root = rootEl || document.getElementById('preview-root');
  if (!code) {
    if (root) root.innerHTML = '<div class="preview-error">No code provided</div>';
    return;
  }

  try {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const mod = await import(url);
    URL.revokeObjectURL(url);

    const Export = mod.default || Object.values(mod).find((v) => typeof v === 'function' && v?.tag);

    if (Export?.tag) {
      if (!customElements.get(Export.tag)) customElements.define(Export.tag, Export);
      if (root) root.innerHTML = `<${Export.tag}></${Export.tag}>`;
    } else if (root) {
      root.innerHTML = '<div class="preview-error">No component found. Make sure your class extends SwitchComponent or FlatList and has a static tag property.</div>';
    }
  } catch (err) {
    if (root) root.innerHTML = `<div class="preview-error">${err.message}</div>`;
  }
}

export function readPreviewCodeFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return '';
  try {
    return decodeURIComponent(atob(hash));
  } catch (_) {
    return '';
  }
}
