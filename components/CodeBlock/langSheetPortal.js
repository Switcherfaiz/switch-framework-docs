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
      font-family: var(--font, 'Montserrat', system-ui, sans-serif);
    }
    #${PORTAL_ID}.is-hidden { display: none; }
    #${PORTAL_ID} .code-lang-panel {
      width: 100%;
      max-width: 560px;
      max-height: 70vh;
      overflow: auto;
      border-radius: 20px 20px 0 0;
      background: var(--page_background, #f5f5f5);
      padding: 12px 16px calc(24px + env(safe-area-inset-bottom));
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.18);
    }
    #${PORTAL_ID} .code-lang-handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--noterai-faded, #8f8f8f);
      opacity: 0.5;
      margin: 4px auto 16px;
    }
    #${PORTAL_ID} .code-lang-title {
      font-size: 17px;
      font-weight: 600;
      color: var(--main_text, #000);
      margin: 0 4px 12px;
    }
    #${PORTAL_ID} .code-lang-row {
      display: block;
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      padding: 12px 8px;
      font-family: inherit;
      font-size: 15px;
      color: var(--main_text, #000);
      border-bottom: 1px solid var(--noterai-pill-border, rgba(0,0,0,0.08));
      cursor: pointer;
      border-radius: 10px;
    }
    #${PORTAL_ID} .code-lang-row:hover,
    #${PORTAL_ID} .code-lang-row.is-active {
      background: rgba(0, 145, 255, 0.1);
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
}

export function closeCodeLangSheet() {
  const portal = document.getElementById(PORTAL_ID);
  if (portal?._closeLangSheet) portal._closeLangSheet();
  else if (portal) {
    portal.classList.add('is-hidden');
    portal.replaceChildren();
  }
}
