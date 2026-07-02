import { encodeData } from 'switch-framework';

function norm(line) {
  return String(line ?? '').replace(/\r$/, '');
}

function fenceLine(line) {
  return norm(line).trim();
}

function isFenceClose(line) {
  return /^```\s*$/.test(fenceLine(line));
}

function isFenceOpen(line) {
  return /^```/.test(fenceLine(line));
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function inlineText(text) {
  const src = String(text || '');
  let out = '';
  let i = 0;

  while (i < src.length) {
    if (src.startsWith('[[', i)) {
      const end = src.indexOf(']]', i + 2);
      if (end !== -1) {
        const inner = src.slice(i + 2, end);
        const pipe = inner.indexOf('|');
        if (pipe > 0) {
          const label = inner.slice(0, pipe).trim();
          const route = inner.slice(pipe + 1).trim();
          out += `<sw-docs-changelog-link text="${escapeAttr(label)}" route="${escapeAttr(route)}"></sw-docs-changelog-link>`;
          i = end + 2;
          continue;
        }
      }
    }

    if (src[i] === '`') {
      const end = src.indexOf('`', i + 1);
      if (end === -1) {
        out += escapeHtml(src.slice(i));
        break;
      }
      out += `<code>${escapeHtml(src.slice(i + 1, end))}</code>`;
      i = end + 1;
      continue;
    }

    if (src.startsWith('**', i)) {
      const end = src.indexOf('**', i + 2);
      if (end === -1) {
        out += escapeHtml(src.slice(i));
        break;
      }
      out += `<strong>${escapeHtml(src.slice(i + 2, end))}</strong>`;
      i = end + 2;
      continue;
    }

    const next = src.slice(i).search(/[`*]/);
    const end = next === -1 ? src.length : i + next;
    out += escapeHtml(src.slice(i, end));
    i = end;
  }

  return out;
}

function normalizeFenceCode(code) {
  return String(code ?? '')
    .replace(/\\`/g, '`')
    .replace(/\\\$/g, '$');
}

function parseFenceHeader(openLine) {
  let raw = fenceLine(openLine).slice(3).trim();
  let preview = '';

  const previewMatch = raw.match(/\s+preview:(\S+)$/);
  if (previewMatch) {
    preview = previewMatch[1];
    raw = raw.slice(0, previewMatch.index).trim();
  }

  const match = raw.match(/^(\S+)(?:\s+title:(.+))?$/);
  if (!match) return { lang: raw, title: '', preview };
  return { lang: match[1], title: (match[2] || '').trim(), preview };
}

function dataAttr(payload) {
  return encodeData(payload);
}

function headingId(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function textComponent(tag, html, id) {
  return `<${tag} data="${dataAttr({ html, id: id || headingId(html) })}"></${tag}>`;
}

const rules = [
  {
    test:   (line) => /^# /.test(norm(line)),
    token:  (line) => ({ type: 'h1', text: norm(line).slice(2).trim() }),
    render: ({ text }) => textComponent('sw-doc-heading', inlineText(text)),
  },
  {
    test:   (line) => /^## /.test(norm(line)),
    token:  (line) => ({ type: 'h2', text: norm(line).slice(3).trim() }),
    render: ({ text }) => textComponent('sw-doc-subheading', inlineText(text)),
  },
  {
    test:   (line) => /^### [^#]/.test(norm(line)),
    token:  (line) => ({ type: 'h3', text: norm(line).slice(4).trim() }),
    render: ({ text }) => textComponent('sw-doc-section-heading', inlineText(text)),
  },
  {
    test:   (line) => /^#### /.test(norm(line)),
    token:  (line) => ({ type: 'h4', text: norm(line).slice(5).trim() }),
    render: ({ text }) => textComponent('sw-doc-subsection-heading', inlineText(text)),
  },
  {
    test:      (line) => /^```params-table/.test(fenceLine(line)),
    multiline: true,
    close:     isFenceClose,
    token:     (_openLine, lines) => ({ type: 'params-table', json: lines.join('\n') }),
    render:    ({ json }) => {
      try {
        const data = JSON.parse(json);
        return `<sw-docs-params-table data="${dataAttr(data)}"></sw-docs-params-table>`;
      } catch {
        return '';
      }
    },
  },
  {
    test:      (line) => /^```live-preview/.test(fenceLine(line)),
    multiline: true,
    close:     isFenceClose,
    token:     (_openLine, lines) => ({ type: 'live-preview', json: lines.join('\n') }),
    render:    ({ json }) => {
      try {
        const data = JSON.parse(json);
        return `<sw-live-code-preview data="${dataAttr(data)}"></sw-live-code-preview>`;
      } catch {
        return '';
      }
    },
  },
  {
    test:      (line) => isFenceOpen(line) && !/^```params-table/.test(fenceLine(line)) && !/^```live-preview/.test(fenceLine(line)),
    multiline: true,
    close:     isFenceClose,
    token:     (openLine, lines) => {
      const { lang, title, preview } = parseFenceHeader(openLine);
      return { type: 'fence', lang, title, code: normalizeFenceCode(lines.join('\n')), preview };
    },
    render:    ({ lang, title, code, preview }) => {
      const payload = { title, language: lang, code };
      if (preview) payload.preview = preview;
      return `<sw-codeblock data="${dataAttr(payload)}"></sw-codeblock>`;
    },
  },
  {
    test:   (line) => /^> /.test(norm(line)),
    token:  (line) => ({ type: 'callout', text: norm(line).slice(2).trim() }),
    render: ({ text }) => textComponent('sw-doc-callout', inlineText(text)),
  },
  {
    test:   (line) => /^- /.test(norm(line)),
    token:  (line) => ({ type: 'li', text: norm(line).slice(2).trim() }),
    render: ({ text }) => textComponent('sw-doc-list-item', inlineText(text)),
  },
];

const DEFAULT_RULE = {
  token:  (line) => ({ type: 'text', text: norm(line) }),
  render: ({ text }) => text.trim() ? textComponent('sw-doc-paragraph', inlineText(text)) : '',
};

export const parse = (md) => {
  const lines = md.split('\n');
  const tokens = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const rule = rules.find(r => r.test(line)) ?? DEFAULT_RULE;

    if (rule.multiline) {
      const openLine = line;
      i += 1;
      const collected = [];
      while (i < lines.length && !rule.close(lines[i])) {
        collected.push(lines[i]);
        i += 1;
      }
      tokens.push({ ...rule.token(openLine, collected), rule });
      if (i < lines.length && rule.close(lines[i])) i += 1;
    } else {
      tokens.push({ ...rule.token(line), rule });
      i += 1;
    }
  }

  return tokens.map(tok => tok.rule.render(tok)).join('\n');
};

export { rules, DEFAULT_RULE };
