import { CODE_FONT_CSS, ensureCodeAssetsInHead } from './codeFonts.js';

const PORTAL_ID = 'sw-code-fs-portal';
const STYLE_ID = 'sw-code-fs-portal-style';

function ensurePortalStyles() {
  if (document.getElementById(STYLE_ID)) return;
  ensureCodeAssetsInHead();
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    ${CODE_FONT_CSS}

    #${PORTAL_ID} {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      background: var(--noterai-code-card-surface, #1e1e1e);
      font-family: 'Montserrat', system-ui, sans-serif;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    #${PORTAL_ID}.is-hidden { display: none; }
    #${PORTAL_ID} * { box-sizing: border-box; }
    #${PORTAL_ID} .code-fs-head {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 4px 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    #${PORTAL_ID} .code-fs-close {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #${PORTAL_ID} .code-fs-lang {
      flex: 1;
      min-width: 0;
      border: none;
      background: transparent;
      padding: 0 8px;
      margin: 0;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      color: var(--noterai-code-toolbar-text, #fff);
      cursor: pointer;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${PORTAL_ID} .code-fs-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-right: 8px;
      flex-shrink: 0;
    }
    #${PORTAL_ID} .code-icon-btn {
      border: none;
      background: transparent;
      padding: 5px 6px;
      margin: 0;
      cursor: pointer;
      color: var(--noterai-code-toolbar-icon, rgba(255,255,255,0.55));
      font-size: 18px;
      line-height: 1;
    }
    #${PORTAL_ID} .code-icon-btn.is-active { color: var(--noterai-code-toolbar-text, #fff); }
    #${PORTAL_ID} .code-fs-actions .code-icon-btn.is-active {
      color: #a5b4fc;
      background: rgba(99,102,241,0.28);
      border-radius: 8px;
    }
    #${PORTAL_ID} .code-fs-run {
      color: #a5b4fc !important;
      background: rgba(99,102,241,0.28);
      border-radius: 9px;
    }
    #${PORTAL_ID} .code-fs-body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 12px;
    }
    #${PORTAL_ID} .code-fs-pane {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: auto;
      border-radius: 10px;
    }
    #${PORTAL_ID} .code-fs-pane.is-hidden { display: none; }
    #${PORTAL_ID} .code-pre { margin: 0; padding: 0; overflow: auto; flex: 1; min-height: 0; }
    #${PORTAL_ID} #code-fs-view-wrap.is-hidden { display: none; }
    #${PORTAL_ID} .code-pre code.hljs {
      display: block;
      min-height: calc(100vh - 88px);
      padding: 12px 14px;
      background: transparent !important;
      white-space: pre;
      tab-size: 2;
      -moz-tab-size: 2;
    }
    #${PORTAL_ID} .code-fs-edit {
      flex: 1;
      width: 100%;
      min-height: calc(100vh - 88px);
      padding: 12px 14px;
      border: none;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.25);
      color: #f8f8f2;
      resize: none;
      outline: none;
      white-space: pre;
      tab-size: 2;
      -moz-tab-size: 2;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    #${PORTAL_ID} .code-fs-edit.is-hidden { display: none; }
    #${PORTAL_ID} #code-fs-preview-iframe {
      flex: 1;
      width: 100%;
      min-height: calc(100vh - 88px);
      border: none;
      display: block;
      background: #fff;
      border-radius: 10px;
    }
    #${PORTAL_ID} .code-fs-mode-toggle {
      display: flex;
      gap: 4px;
      margin-right: 4px;
    }
    #${PORTAL_ID} .code-fs-mode-btn {
      border: 1px solid rgba(255,255,255,0.15);
      background: transparent;
      color: rgba(255,255,255,0.65);
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
    }
    #${PORTAL_ID} .code-fs-mode-btn.is-active {
      background: rgba(99,102,241,0.28);
      color: #fff;
      border-color: rgba(99,102,241,0.5);
    }
  `;
  document.head.appendChild(style);
}

export function getFullscreenPortal() {
  ensurePortalStyles();
  let portal = document.getElementById(PORTAL_ID);
  if (!portal) {
    portal = document.createElement('div');
    portal.id = PORTAL_ID;
    portal.className = 'is-hidden';
    document.body.appendChild(portal);
  }
  return portal;
}

export function closeFullscreenPortal() {
  const portal = document.getElementById(PORTAL_ID);
  if (portal) {
    portal.classList.add('is-hidden');
    portal.replaceChildren();
    portal._owner = null;
  }
}

export function openFullscreenPortal(html, owner) {
  const existing = document.getElementById(PORTAL_ID);
  if (existing?._owner && existing._owner !== owner) {
    existing._owner.closeFullscreen?.();
  }
  const portal = getFullscreenPortal();
  portal.innerHTML = html;
  portal.classList.remove('is-hidden');
  portal._owner = owner;
  return portal;
}
