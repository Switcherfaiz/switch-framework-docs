import { encodeData } from 'switch-framework';
import { formatInline } from './inline-format.js';

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

const inlineText = formatInline;

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

function textComponent(tag, html, id, extra = {}) {
  return `<${tag} data="${dataAttr({ html, id: id || headingId(html), ...extra })}"></${tag}>`;
}

function parseCalloutBlock(openLine, restLines) {
  const rawLines = [openLine, ...restLines].map((line) => {
    const value = norm(line);
    return value.replace(/^>\s?/, '');
  });

  let variant = 'note';
  let bodyLines = rawLines;

  const header = String(rawLines[0] || '').trim();
  const alertMatch = header.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|DEPRECATED)\]\s*(.*)$/i);
  if (alertMatch) {
    const kind = alertMatch[1].toLowerCase();
    variant = kind === 'deprecated' ? 'warning' : kind;
    const sameLine = String(alertMatch[2] || '').trim();
    bodyLines = sameLine ? [sameLine, ...rawLines.slice(1)] : rawLines.slice(1);
  } else {
    const joined = rawLines.join(' ');
    if (/\bdeprecated\b/i.test(joined)) variant = 'warning';
    else if (/\bcaution\b|\bwarning\b/i.test(joined)) variant = 'warning';
    else if (/\bkey concept\b/i.test(joined)) variant = 'note';
    else if (/\brule of thumb\b|\bsimple idea\b|\btip\b/i.test(joined)) variant = 'tip';
    else if (/\bclassic api\b|\bimportant\b/i.test(joined)) variant = 'important';
  }

  const html = bodyLines
    .map((line) => inlineText(line))
    .filter((line) => String(line).trim())
    .join('<br>');

  return { variant, html };
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
    test:   (line) => /^---+$/.test(norm(line).trim()),
    token:  () => ({ type: 'hr' }),
    render: () => '<sw-doc-divider></sw-doc-divider>',
  },
  {
    test:          (line) => /^>/.test(norm(line)),
    multiline:     true,
    consumeClose:  false,
    close:         (line) => !/^>/.test(norm(line)),
    token:         (openLine, lines) => {
      const { variant, html } = parseCalloutBlock(openLine, lines);
      return { type: 'callout', variant, html };
    },
    render:        ({ variant, html }) => textComponent('sw-doc-callout', html, '', { variant }),
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
      if (rule.consumeClose !== false && i < lines.length && rule.close(lines[i])) i += 1;
    } else {
      tokens.push({ ...rule.token(line), rule });
      i += 1;
    }
  }

  return tokens.map(tok => tok.rule.render(tok)).join('\n');
};

export { rules, DEFAULT_RULE };
