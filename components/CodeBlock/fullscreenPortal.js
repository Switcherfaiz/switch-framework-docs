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
      background: var(--codeblock_bg, #18181b);
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    #${PORTAL_ID}.is-hidden { display: none; }
    #${PORTAL_ID} * { box-sizing: border-box; }
    #${PORTAL_ID} .code-fs-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      background: var(--codeblock_header, #27272a);
      flex-shrink: 0;
    }
    #${PORTAL_ID} .code-fs-close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: 8px;
    }
    #${PORTAL_ID} .code-fs-lang {
      flex: 1;
      min-width: 0;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      padding: 5px 10px;
      margin: 0;
      font-family: inherit;
      font-size: 12px;
      font-weight: 650;
      color: var(--codeblock_muted, #a1a1aa);
      cursor: pointer;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 999px;
      max-width: 220px;
    }
    #${PORTAL_ID} .code-fs-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      flex-shrink: 0;
    }
    #${PORTAL_ID} .code-icon-btn {
      border: none;
      background: transparent;
      padding: 7px 8px;
      margin: 0;
      cursor: pointer;
      color: var(--codeblock_muted, #a1a1aa);
      font-size: 16px;
      line-height: 1;
      border-radius: 8px;
    }
    #${PORTAL_ID} .code-icon-btn:hover {
      background: rgba(255,255,255,0.07);
      color: #fafafa;
    }
    #${PORTAL_ID} .code-icon-btn.is-active { color: #fafafa; }
    #${PORTAL_ID} .code-fs-actions .code-icon-btn.is-active {
      color: #c4b5fd;
      background: rgba(129, 140, 248, 0.18);
    }
    #${PORTAL_ID} .code-fs-run {
      color: #c4b5fd !important;
      background: rgba(129, 140, 248, 0.18);
    }
    #${PORTAL_ID} .code-fs-body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
    }
    #${PORTAL_ID} .code-fs-pane {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    #${PORTAL_ID} .code-fs-pane.is-hidden { display: none; }
    #${PORTAL_ID} .code-pre { margin: 0; padding: 0; overflow: auto; flex: 1; min-height: 0; }
    #${PORTAL_ID} #code-fs-view-wrap.is-hidden { display: none; }
    #${PORTAL_ID} .code-pre code.hljs {
      display: block;
      min-height: calc(100vh - 56px);
      padding: 20px 24px;
      background: transparent !important;
      white-space: pre;
      tab-size: 2;
      -moz-tab-size: 2;
    }
    #${PORTAL_ID} .code-fs-edit {
      flex: 1;
      width: 100%;
      min-height: calc(100vh - 56px);
      padding: 20px 24px;
      border: none;
      background: #111113;
      color: #f4f4f5;
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
      min-height: calc(100vh - 56px);
      border: none;
      display: block;
      background: #fff;
    }
    #${PORTAL_ID} .code-fs-mode-toggle {
      display: flex;
      gap: 4px;
      margin-right: 4px;
      padding: 3px;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
    }
    #${PORTAL_ID} .code-fs-mode-btn {
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      font-weight: 650;
      padding: 5px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
    }
    #${PORTAL_ID} .code-fs-mode-btn.is-active {
      background: rgba(129, 140, 248, 0.22);
      color: #fff;
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
