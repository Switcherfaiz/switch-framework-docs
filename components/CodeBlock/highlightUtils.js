export function langToHljs(language) {
  const l = String(language || 'text').toLowerCase().trim();
  const map = {
    text: 'plaintext',
    plain: 'plaintext',
    js: 'javascript',
    mjs: 'javascript',
    ts: 'typescript',
    py: 'python',
    md: 'markdown',
    sh: 'bash',
    bash: 'bash',
    shell: 'bash',
    htm: 'xml',
    svg: 'xml',
    cs: 'csharp',
    kt: 'kotlin',
    jsx: 'javascript',
    tsx: 'typescript',
  };
  return map[l] || l;
}

export function formatHighlighted(hljs, source, language) {
  const trimmed = String(source ?? '').trim();
  if (!trimmed) return '';
  const lang = langToHljs(language);
  if (lang && lang !== 'plaintext') {
    try {
      return hljs.highlight(trimmed, { language: lang }).value;
    } catch {
      return hljs.highlightAuto(trimmed).value;
    }
  }
  try {
    return hljs.highlight(trimmed, { language: 'plaintext' }).value;
  } catch {
    return hljs.highlightAuto(trimmed).value;
  }
}
