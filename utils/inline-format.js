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



function nextSpecialIndex(src, i) {

  const rest = src.slice(i);

  const indices = [

    rest.indexOf('[['),

    rest.indexOf('**'),

    rest.indexOf('`'),

    rest.search(/<code[\s>]/i),

  ].filter((n) => n >= 0);

  return indices.length ? Math.min(...indices) : -1;

}



/** Inline markdown: `code`, **bold**, [[Label|route]], and <code> HTML in params tables. */

export function formatInline(text) {

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



    const codeTag = src.slice(i).match(/^<code>([\s\S]*?)<\/code>/i);

    if (codeTag) {

      out += `<code>${escapeHtml(codeTag[1])}</code>`;

      i += codeTag[0].length;

      continue;

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



    const nextSpecial = nextSpecialIndex(src, i);

    if (nextSpecial === -1) {

      out += escapeHtml(src.slice(i));

      break;

    }

    if (nextSpecial === 0) {

      out += escapeHtml(src[i]);

      i += 1;

      continue;

    }

    out += escapeHtml(src.slice(i, i + nextSpecial));

    i += nextSpecial;

  }



  return out;

}


