import { readDoc } from './reader.js';
import { parse } from './parser.js';

export function docPageFromScreenName(screenName) {
  return String(screenName || '').replace(/^docs\/?/, '') || 'introduction';
}

export function renderDocShell(page, footer = '<sw-docs-pagination></sw-docs-pagination>', sectionClass = 'doc-section') {
  return `
    <div class="${sectionClass}">
      <div class="doc-page-toolbar">
        <sw-docs-page-menu page="${page}"></sw-docs-page-menu>
      </div>
      <div id="doc-mount" class="doc-mount is-loading">
        <sw-doc-loader></sw-doc-loader>
      </div>
      ${footer}
    </div>
  `;
}

export async function loadDocContent(host) {
  const mount = host.shadowRoot?.querySelector('#doc-mount');
  if (!mount) return;

  const page = docPageFromScreenName(host.constructor.screenName);

  mount.classList.add('is-loading');
  mount.innerHTML = '<sw-doc-loader></sw-doc-loader>';

  try {
    const md = await readDoc(`/docs/${page}.md`);
    mount.innerHTML = parse(md);
  } catch {
    mount.innerHTML = '<p class="doc-load-error">Failed to load documentation.</p>';
  } finally {
    mount.classList.remove('is-loading');
  }
}

/** @deprecated use loadDocContent */
export async function loadDoc(mount, page) {
  mount.classList.add('is-loading');
  mount.innerHTML = '<sw-doc-loader></sw-doc-loader>';
  try {
    const md = await readDoc(`/docs/${page}.md`);
    mount.innerHTML = parse(md);
  } finally {
    mount.classList.remove('is-loading');
  }
}
