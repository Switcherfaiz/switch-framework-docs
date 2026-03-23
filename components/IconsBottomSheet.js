import { SwitchComponent, updateState, getState, subscribeState } from 'switch-framework';
import { copyText } from '/utils/clipboard.js';

export class IconsBottomSheet extends SwitchComponent {
  static tag = 'sw-icons-bottom-sheet';

  onMount() {
    this._expanded = false;
    /** Live in tab layout: react whenever global `icon-sheet` changes (from switch-icons or elsewhere). */
    const unsub = subscribeState('icon-sheet', (state) => this.updateSheetDOM(state));
    this.addOnDestroy(() => unsub?.());
    this.bindEvents();
  }

  bindEvents() {
    this.listener('#icon-sheet-close', 'click', () => this.handleClose());
    this.listener('#icon-sheet-backdrop', 'click', () => this.close());
    this.listener('#icon-sheet-prev', 'click', () => this.navigate(-1));
    this.listener('#icon-sheet-next', 'click', () => this.navigate(1));
    this.listener('#icon-sheet-copy-span', 'click', () => this.copySpan());
    this.listener('#icon-sheet-copy-code', 'click', () => this.copyCode());
    this.listener('#icon-sheet-copy-svg', 'click', () => this.copySvg());
    this.listener('#icon-sheet-expand', 'click', () => this.toggleExpand());
    this.listener('#icon-sheet-collapse-fullscreen', 'click', () => this.collapseExpanded());
  }

  updateSheetDOM(state) {
    const wrapper = this.select('.icon-sheet-wrapper');
    if (!wrapper) return;

    const isOpen = !!state?.open;
    wrapper.classList.toggle('open', isOpen);
    this.style.pointerEvents = isOpen ? 'auto' : '';

    if (!isOpen) {
      this._expanded = false;
      wrapper.classList.remove('expanded');
      const expandIcon = this.select('#icon-sheet-expand .icon-sheet-control-icon');
      if (expandIcon) expandIcon.className = 'switch_icon_window_maximize icon-sheet-control-icon';
      return;
    }

    const { iconKey, filteredKeys = [], index = 0 } = state;
    this._sheetData = { filteredKeys, index };

    const currentKey = iconKey || filteredKeys[index] || '';
    const displayName = this.formatDisplayName(currentKey);
    const tags = this.formatTags(currentKey);
    const prevKey = index > 0 ? filteredKeys[index - 1] : null;
    const nextKey = index < filteredKeys.length - 1 ? filteredKeys[index + 1] : null;

    const previewEl = this.select('#icon-sheet-preview-glyph');
    const nameEl = this.select('#icon-sheet-name');
    const tagsEl = this.select('#icon-sheet-tags');
    if (previewEl) {
      previewEl.className = `${currentKey} icon-preview-glyph`;
    }
    if (nameEl) nameEl.textContent = displayName;
    if (tagsEl) tagsEl.textContent = tags;

    const prevBtn = this.select('#icon-sheet-prev');
    const nextBtn = this.select('#icon-sheet-next');
    if (prevBtn) {
      prevBtn.style.display = prevKey ? '' : 'none';
      prevBtn.disabled = !prevKey;
    }
    if (nextBtn) {
      nextBtn.style.display = nextKey ? '' : 'none';
      nextBtn.disabled = !nextKey;
    }

    const codeEl = this.select('#icon-sheet-code-content');
    if (codeEl) codeEl.textContent = currentKey ? `<span class="${currentKey}"></span>` : '';
  }

  toggleExpand() {
    this._expanded = !this._expanded;
    this._syncExpandUI();
  }

  collapseExpanded() {
    if (!this._expanded) return;
    this._expanded = false;
    this._syncExpandUI();
  }

  _syncExpandUI() {
    const wrapper = this.select('.icon-sheet-wrapper');
    const expandIcon = this.select('#icon-sheet-expand .icon-sheet-control-icon');
    if (wrapper) wrapper.classList.toggle('expanded', this._expanded);
    if (expandIcon) {
      expandIcon.className = (this._expanded ? 'switch_icon_window_minimize' : 'switch_icon_window_maximize') + ' icon-sheet-control-icon';
    }
  }

  handleClose() {
    if (this._expanded) {
      this.toggleExpand();
    } else {
      updateState('icon-sheet', (s) => ({ ...(s || {}), open: false }));
    }
  }

  close() {
    updateState('icon-sheet', (s) => ({ ...(s || {}), open: false }));
  }

  navigate(delta) {
    const data = this._sheetData || {};
    const { filteredKeys = [], index = 0 } = data;
    const newIndex = Math.max(0, Math.min(index + delta, filteredKeys.length - 1));
    const iconKey = filteredKeys[newIndex] || null;
    const state = getState('icon-sheet') || {};
    updateState('icon-sheet', { ...state, index: newIndex, iconKey });
    this.updateSheetDOM({ ...state, index: newIndex, iconKey });
  }

  async copySpan() {
    const state = getState('icon-sheet');
    if (!state?.iconKey) return;
    const html = `<span class="${state.iconKey}"></span>`;
    const ok = await copyText(html);
    if (ok) this.showCopyFeedback('#icon-sheet-copy-span');
  }

  /** Reads ::before unicode from a temp element; builds SVG using the icon font. */
  _getIconCodePoint(iconKey) {
    const span = document.createElement('span');
    span.className = iconKey;
    span.setAttribute('aria-hidden', 'true');
    span.style.cssText = 'position:absolute;left:-9999px;top:0;font-size:24px;';
    document.body.appendChild(span);
    try {
      const raw = getComputedStyle(span, '::before').getPropertyValue('content');
      return this._parseUnicodeFromCssContent(raw);
    } finally {
      document.body.removeChild(span);
    }
  }

  _parseUnicodeFromCssContent(content) {
    if (content == null || content === 'none' || content === 'normal') return null;
    const s = String(content).trim().replace(/^["']|["']$/g, '');
    if (s.length === 1 || [...s].length === 1) {
      const cp = s.codePointAt(0);
      if (cp && cp > 0x20) return cp;
    }
    let m = s.match(/^\\e([0-9a-fA-F]{3,6})$/i);
    if (m) return parseInt(m[1], 16);
    m = s.match(/\\([0-9a-fA-F]{2,6})/);
    if (m) return parseInt(m[1], 16);
    m = s.match(/\\u([0-9a-fA-F]{4})/i);
    if (m) return parseInt(m[1], 16);
    return null;
  }

  async copySvg() {
    const state = getState('icon-sheet');
    const key = state?.iconKey;
    if (!key) return;
    const codePoint = this._getIconCodePoint(key);
    const fontUrl = new URL('/assets/icons/fonts/switch-icons.woff', window.location.origin).href;
    let svg;
    if (codePoint != null && Number.isFinite(codePoint)) {
      const ch = String.fromCodePoint(codePoint);
      const esc = ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">` +
        `<defs><style type="text/css">@font-face{font-family:swi;src:url('${fontUrl}') format('woff');font-weight:normal;font-style:normal;}</style></defs>` +
        `<text x="12" y="17" font-family="swi,sans-serif" font-size="18" text-anchor="middle" fill="currentColor">${esc}</text>` +
        `</svg>`;
    } else {
      svg = `<!-- Fallback: use span with icon font loaded --><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><text x="12" y="17" font-size="10" text-anchor="middle" fill="currentColor">?</text></svg>`;
    }
    const ok = await copyText(svg);
    if (ok) this.showCopyFeedback('#icon-sheet-copy-svg');
  }

  async copyCode() {
    const state = getState('icon-sheet');
    if (!state?.iconKey) return;
    const code = `<span class="${state.iconKey}"></span>`;
    const ok = await copyText(code);
    if (ok) this.showCopyFeedback('#icon-sheet-copy-code');
  }

  showCopyFeedback(btnId) {
    const btn = this.select(btnId);
    if (!btn) return;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span class="switch_icon_clipboard_check"></span>';
    setTimeout(() => { btn.innerHTML = origHTML; }, 1500);
  }

  formatDisplayName(key) {
    if (!key) return '';
    return key.replace(/^switch_icon_/, '').replace(/_/g, '-');
  }

  formatTags(key) {
    if (!key) return '';
    const name = key.replace(/^switch_icon_/, '');
    return name.split('_').join(' • ');
  }

  render() {
    return `
      <div class="icon-sheet-wrapper" id="icon-sheet-root">
        <div class="icon-sheet-backdrop" id="icon-sheet-backdrop"></div>
        <button type="button" id="icon-sheet-collapse-fullscreen" class="icon-sheet-fab-collapse" aria-label="Back to compact view">
          <span class="switch_icon_window_minimize icon-sheet-fab-collapse-icon"></span>
          <span class="icon-sheet-fab-collapse-label">Compact</span>
        </button>
        <div class="icon-sheet-panel">
          <div class="icon-sheet-header">
            <div class="icon-sheet-preview">
              <span id="icon-sheet-preview-glyph" class="icon-preview-glyph"></span>
            </div>
            <div class="icon-sheet-info">
              <div class="icon-sheet-title-row">
                <button id="icon-sheet-prev" class="icon-sheet-nav-btn" type="button" aria-label="Previous" style="display:none">
                  <span class="switch_icon_chevron_left"></span>
                </button>
                <h3 id="icon-sheet-name" class="icon-sheet-name"></h3>
                <button id="icon-sheet-next" class="icon-sheet-nav-btn" type="button" aria-label="Next" style="display:none">
                  <span class="switch_icon_chevron_right"></span>
                </button>
              </div>
              <p id="icon-sheet-tags" class="icon-sheet-tags"></p>
              <span class="icon-sheet-category">General</span>
            </div>
            <div class="icon-sheet-controls">
              <button id="icon-sheet-expand" class="icon-sheet-btn icon-sheet-btn-icon" type="button" aria-label="Expand or compact view">
                <span class="switch_icon_window_maximize icon-sheet-control-icon"></span>
              </button>
              <button id="icon-sheet-close" class="icon-sheet-btn icon-sheet-btn-icon" type="button" aria-label="Close">
                <span class="switch_icon_xmark icon-sheet-control-icon"></span>
              </button>
            </div>
          </div>
          <div class="icon-sheet-code-block">
            <pre class="icon-sheet-code-pre"><code id="icon-sheet-code-content"></code></pre>
            <button id="icon-sheet-copy-code" class="icon-sheet-copy-code-btn" type="button" aria-label="Copy">
              <span class="switch_icon_clipboard"></span>
            </button>
          </div>
          <div class="icon-sheet-actions">
            <button id="icon-sheet-copy-svg" class="icon-sheet-btn icon-sheet-btn-primary" type="button">Copy SVG</button>
            <button id="icon-sheet-copy-span" class="icon-sheet-btn icon-sheet-btn-secondary" type="button">Copy span</button>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        /* ─── Overlay wrapper ─────────────────────────────────────────── */
        .icon-sheet-wrapper {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 12000;
          isolation: isolate;
        }

        .icon-sheet-wrapper.open {
          pointer-events: auto;
        }

        .icon-sheet-wrapper.expanded {
          z-index: 12000;
        }

        /* ─── Backdrop ────────────────────────────────────────────────── */
        /* Parent pointer-events:none does NOT disable children; without this, the
           invisible full-screen backdrop (z-index 12000) steals all clicks under the sheet. */
        .icon-sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
        }

        .icon-sheet-wrapper.open .icon-sheet-backdrop {
          opacity: 1;
          pointer-events: auto;
        }

        /* Mobile-only: exit expanded → compact (pill, above content) */
        .icon-sheet-fab-collapse {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          top: max(14px, env(safe-area-inset-top));
          z-index: 12002;
          display: none;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          color: var(--main_text);
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.02em;
          pointer-events: auto;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .icon-sheet-fab-collapse:active {
          transform: translateX(-50%) scale(0.97);
        }

        .icon-sheet-fab-collapse-icon {
          font-size: 16px;
          line-height: 1;
          opacity: 0.95;
        }

        .icon-sheet-fab-collapse-label {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .icon-sheet-wrapper.expanded .icon-sheet-fab-collapse {
            display: inline-flex;
          }
        }

        /* ─── Panel (shared base) ─────────────────────────────────────── */
        .icon-sheet-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, var(--surface_1) 0%, var(--surface_2) 120%);
          border-top: 1px solid var(--border_color);
          border-radius: 20px 20px 0 0;
          padding: 24px;
          padding-bottom: max(24px, env(safe-area-inset-bottom));
          max-height: min(70vh, calc(100dvh - env(safe-area-inset-top)));
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transform: translateY(100%);
          transition: transform 0.34s cubic-bezier(0.32, 0.72, 0, 1);
          box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
          pointer-events: none;
        }

        .icon-sheet-wrapper.open .icon-sheet-panel {
          transform: translateY(0);
          pointer-events: auto;
        }

        /* ─── Expanded (fullscreen, centered) — fixed layer above topbar ─ */
        .icon-sheet-wrapper.expanded .icon-sheet-panel {
          position: fixed;
          inset: 0;
          z-index: 12001;
          max-height: none;
          border-radius: 0;
          border-top: none;
          transform: none;
          overflow-y: auto;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 88px max(20px, env(safe-area-inset-right)) max(28px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
          background: var(--surface_1);
        }

        /* ─── Header ──────────────────────────────────────────────────── */
        .icon-sheet-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
          min-width: 0;
        }

        /* ─── Preview thumbnail ───────────────────────────────────────── */
        .icon-sheet-preview {
          flex-shrink: 0;
          width: 72px;
          height: 72px;
          background: var(--surface_2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-preview-glyph {
          font-size: 36px;
          color: var(--main_text);
          line-height: 1;
        }

        /* ─── Info block (name, tags, category) ──────────────────────── */
        .icon-sheet-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          /* vertically centre-align against the 72 px thumbnail */
          justify-content: center;
          min-height: 72px;
        }

        /* ─── Title row (prev · name · next) ─────────────────────────── */
        .icon-sheet-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          width: 100%;
        }

        .icon-sheet-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 0;
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ─── Nav buttons (prev / next) ──────────────────────────────── */
        .icon-sheet-nav-btn {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border: none;
          background: var(--surface_2);
          color: var(--main_text);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.15s;
        }

        .icon-sheet-nav-btn:hover:not(:disabled) {
          background: var(--surface_hover);
        }

        .icon-sheet-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .icon-sheet-nav-btn .switch_icon_chevron_left,
        .icon-sheet-nav-btn .switch_icon_chevron_right {
          font-size: 16px;
          line-height: 1;
        }

        /* ─── Tags & category ─────────────────────────────────────────── */
        .icon-sheet-tags {
          font-size: 13px;
          color: var(--sub_text);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .icon-sheet-category {
          display: inline-block;
          align-self: flex-start;
          padding: 3px 10px;
          background: var(--surface_2);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: var(--sub_text);
          letter-spacing: 0.02em;
        }

        /* ─── Controls (expand / close) ──────────────────────────────── */
        .icon-sheet-controls {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          /* align buttons to the top of the header */
          align-self: flex-start;
        }

        .icon-sheet-btn-icon {
          width: 36px;
          height: 36px;
          padding: 0;
          border: none;
          background: var(--surface_2);
          color: var(--muted_text);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }

        .icon-sheet-btn-icon .icon-sheet-control-icon {
          font-size: 18px;
          line-height: 1;
        }

        .icon-sheet-btn-icon:hover {
          background: var(--surface_hover);
          color: var(--main_text);
        }

        /* ─── Code block ──────────────────────────────────────────────── */
        .icon-sheet-code-block {
          display: flex;
          align-items: stretch;
          width: 100%;
          background: var(--surface_2);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border_color);
          box-sizing: border-box;
        }

        .icon-sheet-code-pre {
          flex: 1;
          margin: 0;
          padding: 12px 16px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          font-size: 13px;
          color: var(--main_text);
          overflow-x: auto;
          white-space: pre;
        }

        .icon-sheet-code-pre code {
          background: none;
          padding: 0;
        }

        .icon-sheet-copy-code-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          background: var(--surface_hover);
          border: none;
          border-left: 1px solid var(--border_color);
          color: var(--main_text);
          cursor: pointer;
          transition: background 0.15s;
        }

        .icon-sheet-copy-code-btn:hover {
          background: var(--surface_2);
        }

        .icon-sheet-copy-code-btn .switch_icon_clipboard,
        .icon-sheet-copy-code-btn .switch_icon_clipboard_check {
          font-size: 18px;
          line-height: 1;
        }

        .icon-sheet-copy-code-btn .switch_icon_clipboard_check {
          color: var(--primary);
        }

        /* ─── Action buttons ──────────────────────────────────────────── */
        .icon-sheet-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .icon-sheet-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: opacity 0.15s, background 0.15s;
          white-space: nowrap;
        }

        .icon-sheet-btn-primary {
          background: var(--primary);
          color: white;
        }

        .icon-sheet-btn-primary:hover {
          opacity: 0.88;
        }

        .icon-sheet-btn-secondary {
          background: var(--surface_2);
          color: var(--main_text);
        }

        .icon-sheet-btn-secondary:hover {
          background: var(--surface_hover);
        }

        /* ══════════════════════════════════════════════════════════════
           EXPANDED STATE overrides
           The panel fills the viewport; content is centred at a
           comfortable max-width so it never stretches edge-to-edge.
        ══════════════════════════════════════════════════════════════ */
        .icon-sheet-wrapper.expanded .icon-sheet-panel > * {
          width: 100%;
          max-width: 480px;
        }

        /* Controls pinned to top-right corner of the fullscreen panel */
        .icon-sheet-wrapper.expanded .icon-sheet-controls {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: max(16px, env(safe-area-inset-right));
          align-self: auto;
        }

        /* Header: stack vertically and centre everything */
        .icon-sheet-wrapper.expanded .icon-sheet-header {
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        /* Large preview in expanded */
        .icon-sheet-wrapper.expanded .icon-sheet-preview {
          width: 120px;
          height: 120px;
          border-radius: 20px;
        }

        .icon-sheet-wrapper.expanded .icon-preview-glyph {
          font-size: 60px;
        }

        /* Info block becomes centred */
        .icon-sheet-wrapper.expanded .icon-sheet-info {
          align-items: center;
          min-height: unset;
          gap: 8px;
        }

        .icon-sheet-wrapper.expanded .icon-sheet-title-row {
          justify-content: center;
        }

        .icon-sheet-wrapper.expanded .icon-sheet-name {
          font-size: 26px;
          text-align: center;
          white-space: normal;
          overflow: visible;
        }

        .icon-sheet-wrapper.expanded .icon-sheet-tags {
          text-align: center;
          white-space: normal;
          overflow: visible;
        }

        .icon-sheet-wrapper.expanded .icon-sheet-category {
          align-self: center;
        }

        /* Actions centred in expanded */
        .icon-sheet-wrapper.expanded .icon-sheet-actions {
          justify-content: center;
        }

        /* ══════════════════════════════════════════════════════════════
           MOBILE overrides  (≤ 768 px) — grid header so nothing overlaps
        ══════════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .icon-sheet-panel {
            padding: 18px 16px;
            padding-bottom: max(18px, env(safe-area-inset-bottom));
            gap: 16px;
            max-height: min(78vh, calc(100dvh - 24px - env(safe-area-inset-bottom)));
            border-radius: 22px 22px 0 0;
          }

          /* Row 1: preview + controls | Row 2: full-width info (no squashed icons) */
          .icon-sheet-header {
            display: grid;
            grid-template-columns: minmax(56px, auto) 1fr;
            grid-template-rows: auto auto;
            grid-template-areas:
              "preview controls"
              "info info";
            gap: 12px 14px;
            align-items: start;
          }

          .icon-sheet-preview {
            grid-area: preview;
            width: 56px;
            height: 56px;
            min-width: 56px;
            min-height: 56px;
            border-radius: 14px;
            align-self: center;
          }

          .icon-preview-glyph {
            font-size: 28px;
          }

          .icon-sheet-controls {
            grid-area: controls;
            justify-self: end;
            align-self: start;
            flex-shrink: 0;
            gap: 10px;
          }

          .icon-sheet-btn-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
            min-height: 42px;
            border-radius: 12px;
          }

          .icon-sheet-btn-icon .icon-sheet-control-icon {
            font-size: 19px;
          }

          .icon-sheet-info {
            grid-area: info;
            min-height: unset;
            width: 100%;
            min-width: 0;
            gap: 6px;
          }

          .icon-sheet-title-row {
            flex-wrap: nowrap;
            gap: 6px;
          }

          .icon-sheet-name {
            font-size: 16px;
          }

          .icon-sheet-tags {
            font-size: 12px;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .icon-sheet-nav-btn {
            width: 38px;
            height: 38px;
            min-width: 38px;
            min-height: 38px;
          }

          .icon-sheet-nav-btn .switch_icon_chevron_left,
          .icon-sheet-nav-btn .switch_icon_chevron_right {
            font-size: 18px;
          }

          .icon-sheet-code-block {
            border-radius: 12px;
          }

          .icon-sheet-actions {
            flex-direction: column;
            gap: 10px;
          }

          .icon-sheet-btn {
            width: 100%;
            text-align: center;
            padding: 12px 20px;
          }

          /* Expanded: FAB + offset controls; content breathes */
          .icon-sheet-wrapper.expanded .icon-sheet-panel {
            padding: max(88px, calc(env(safe-area-inset-top) + 52px)) 18px max(28px, env(safe-area-inset-bottom));
            gap: 22px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-preview {
            width: 96px;
            height: 96px;
            min-width: 96px;
          }

          .icon-sheet-wrapper.expanded .icon-preview-glyph {
            font-size: 48px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-name {
            font-size: 22px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-controls {
            position: absolute;
            top: max(56px, calc(env(safe-area-inset-top) + 44px));
            right: max(12px, env(safe-area-inset-right));
          }
        }
      </style>
    `;
  }
}