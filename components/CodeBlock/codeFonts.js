export const CODE_FONT_STACK = "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

export const CODE_FONT_CSS = `
  --sw-code-font: ${CODE_FONT_STACK};

  .hljs,
  .code-pre code.hljs,
  .code-fs-edit {
    font-family: var(--sw-code-font) !important;
    font-size: 13px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  .hljs {
    background: transparent !important;
    color: #e4e4e7;
  }

  pre,
  pre.code-pre,
  code,
  code.hljs,
  pre code.hljs {
    overflow: visible !important;
    overflow-x: visible !important;
    overflow-y: visible !important;
  }

  pre code.hljs {
    display: block;
    padding: 14px 16px;
    white-space: pre;
    tab-size: 2;
    -moz-tab-size: 2;
  }

  .hljs-comment,
  .hljs-quote { color: #71717a; font-style: italic; }
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-section,
  .hljs-link { color: #c4b5fd; }
  .hljs-string,
  .hljs-bullet,
  .hljs-regexp { color: #86efac; }
  .hljs-number,
  .hljs-symbol { color: #fbbf24; }
  .hljs-title,
  .hljs-title.function_,
  .hljs-name { color: #93c5fd; }
  .hljs-attr,
  .hljs-attribute,
  .hljs-variable,
  .hljs-template-variable { color: #fda4af; }
  .hljs-built_in,
  .hljs-class .hljs-title,
  .hljs-type { color: #67e8f9; }
  .hljs-params { color: #e4e4e7; }
  .hljs-property,
  .hljs-selector-class,
  .hljs-selector-id { color: #7dd3fc; }
  .hljs-meta,
  .hljs-meta .hljs-keyword { color: #a1a1aa; }
  .hljs-addition { color: #86efac; }
  .hljs-deletion { color: #fca5a5; }
`;

export function ensureCodeAssetsInHead() {
  if (!document.getElementById('sw-code-hl-css')) {
    const link = document.createElement('link');
    link.id = 'sw-code-hl-css';
    link.rel = 'stylesheet';
    link.href = '/codehighlighter/codehighlighter.css';
    document.head.appendChild(link);
  }
  if (!document.getElementById('sw-code-font-css')) {
    const link = document.createElement('link');
    link.id = 'sw-code-font-css';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
  if (!document.getElementById('sw-code-font-vars')) {
    const style = document.createElement('style');
    style.id = 'sw-code-font-vars';
    style.textContent = `:root { --sw-code-font: ${CODE_FONT_STACK}; }`;
    document.head.appendChild(style);
  }
}

export function ensureHljsStylesInShadow(shadowRoot) {
  if (!shadowRoot || shadowRoot.querySelector('#sw-code-hl-shadow')) return;
  const link = document.createElement('link');
  link.id = 'sw-code-hl-shadow';
  link.rel = 'stylesheet';
  link.href = '/codehighlighter/codehighlighter.css';
  shadowRoot.prepend(link);
}

export function whenCodeAssetsReady() {
  ensureCodeAssetsInHead();
  const links = ['sw-code-hl-css', 'sw-code-font-css'].map((id) => document.getElementById(id)).filter(Boolean);
  const pending = links.filter((link) => !link.sheet);
  if (!pending.length) return Promise.resolve();
  return Promise.all(pending.map((link) => new Promise((resolve) => {
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  })));
}
