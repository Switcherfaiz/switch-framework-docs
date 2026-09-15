import { syncOverlayBack } from 'switch-framework';

const PORTAL_ID = 'sw-code-lang-portal';

function ensurePortalStyles() {
  if (document.getElementById('sw-code-lang-portal-style')) return;
  const style = document.createElement('style');
  style.id = 'sw-code-lang-portal-style';
  style.textContent = `
    #${PORTAL_ID} {
      position: fixed;
      inset: 0;
      z-index: 15000;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
    }
    #${PORTAL_ID}.is-hidden { display: none; }
    #${PORTAL_ID} .code-lang-panel {
      width: 100%;
      max-width: 480px;
      max-height: 70vh;
      overflow: auto;
      border-radius: 16px 16px 0 0;
      background: var(--surface_1, var(--page_background, #fff));
      padding: 12px 12px calc(20px + env(safe-area-inset-bottom));
      box-shadow: var(--shadow_lg, 0 -8px 32px rgba(0, 0, 0, 0.18));
      border: 1px solid var(--border_color, #e4e4e7);
    }
    #${PORTAL_ID} .code-lang-handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--muted_text, #a1a1aa);
      opacity: 0.5;
      margin: 4px auto 16px;
    }
    #${PORTAL_ID} .code-lang-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted_text, #71717a);
      margin: 0 8px 8px;
    }
    #${PORTAL_ID} .code-lang-row {
      display: block;
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      padding: 11px 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--main_text, #18181b);
      cursor: pointer;
      border-radius: 10px;
    }
    #${PORTAL_ID} .code-lang-row:hover,
    #${PORTAL_ID} .code-lang-row.is-active {
      background: var(--primary_light, rgba(79, 70, 229, 0.1));
      color: var(--primary, #4f46e5);
    }
    #${PORTAL_ID} .code-lang-row:last-child { border-bottom: none; }
  `;
  document.head.appendChild(style);
}

function getPortal() {
  ensurePortalStyles();
  let portal = document.getElementById(PORTAL_ID);
  if (!portal) {
    portal = document.createElement('div');
    portal.id = PORTAL_ID;
    portal.className = 'is-hidden';
    portal.setAttribute('role', 'dialog');
    portal.setAttribute('aria-modal', 'true');
    portal.setAttribute('aria-label', 'Select language');
    document.body.appendChild(portal);
  }
  return portal;
}

export function openCodeLangSheet({ options, activeLang, onPick }) {
  const portal = getPortal();
  const rows = (options || [])
    .map(
      (o) => `<button type="button" class="code-lang-row ${o.value === activeLang ? 'is-active' : ''}" data-lang="${o.value}">${o.label}</button>`,
    )
    .join('');

  portal.innerHTML = `
    <div class="code-lang-panel" id="code-lang-panel-inner">
      <div class="code-lang-handle" aria-hidden="true"></div>
      <div class="code-lang-title">Language</div>
      ${rows}
    </div>`;

  portal.classList.remove('is-hidden');

  const close = () => {
    syncOverlayBack(portal, false);
    portal.classList.add('is-hidden');
    portal.replaceChildren();
    portal.removeEventListener('click', onPortalClick);
    document.removeEventListener('keydown', onKey);
  };

  const onPortalClick = (e) => {
    const row = e.target?.closest?.('.code-lang-row');
    if (row) {
      onPick?.(row.getAttribute('data-lang') || 'text');
      close();
      return;
    }
    if (e.target === portal) close();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  portal.addEventListener('click', onPortalClick);
  document.addEventListener('keydown', onKey);
  portal._closeLangSheet = close;
  syncOverlayBack(portal, true, close);
}

export function closeCodeLangSheet() {
  const portal = document.getElementById(PORTAL_ID);
  if (portal?._closeLangSheet) portal._closeLangSheet();
  else if (portal) {
    syncOverlayBack(portal, false);
    portal.classList.add('is-hidden');
    portal.replaceChildren();
  }
}
