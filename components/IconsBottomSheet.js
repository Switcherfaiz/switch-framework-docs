import { SwitchComponent, updateState, getState, useState } from 'switch-framework';
import { copyText } from '/utils/clipboard.js';
import { iconSheetHandlers } from '/data/icon-sheet-handlers.js';

export class IconsBottomSheet extends SwitchComponent {
  static tag = 'sw-icons-bottom-sheet';

  handleIconSheetUpdate(state) {
    this.updateSheetDOM(state);
  }

  onMount() {
    this._expanded = false;
    iconSheetHandlers.updateDOM = this.handleIconSheetUpdate.bind(this);
    const [, unsub] = useState('icon-sheet', (state) => iconSheetHandlers.updateDOM?.(state));
    this.addOnDestroy(() => {
      iconSheetHandlers.updateDOM = null;
      unsub?.();
    });
    this.bindEvents();
  }

  bindEvents() {
    this.listener('#icon-sheet-close', 'click', () => this.handleClose());
    this.listener('#icon-sheet-backdrop', 'click', () => this.close());
    this.listener('#icon-sheet-prev', 'click', () => this.navigate(-1));
    this.listener('#icon-sheet-next', 'click', () => this.navigate(1));
    this.listener('#icon-sheet-copy-html', 'click', () => this.copyHtml());
    this.listener('#icon-sheet-copy-code', 'click', () => this.copyCode());
    this.listener('#icon-sheet-see-action', 'click', () => this.seeInAction());
    this.listener('#icon-sheet-expand', 'click', () => this.toggleExpand());
  }

  updateSheetDOM(state) {
    const wrapper = this.select('.icon-sheet-wrapper');
    if (!wrapper) return;

    const isOpen = !!state?.open;
    wrapper.classList.toggle('open', isOpen);

    if (!isOpen) {
      this._expanded = false;
      wrapper.classList.remove('expanded');
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
    const wrapper = this.select('.icon-sheet-wrapper');
    const expandIcon = this.select('#icon-sheet-expand .icon-sheet-control-icon');
    if (wrapper) wrapper.classList.toggle('expanded', this._expanded);
    if (expandIcon) expandIcon.className = (this._expanded ? 'switch_icon_window_minimize' : 'switch_icon_window_maximize') + ' icon-sheet-control-icon';
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

  async copyHtml() {
    const state = getState('icon-sheet');
    if (!state?.iconKey) return;
    const html = `<span class="${state.iconKey}"></span>`;
    const ok = await copyText(html);
    if (ok) this.showCopyFeedback('#icon-sheet-copy-html');
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

  seeInAction() {
    this.copyHtml();
    this.close();
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
              <button id="icon-sheet-expand" class="icon-sheet-btn icon-sheet-btn-icon" type="button" aria-label="Expand">
                <span class="switch_icon_expand icon-sheet-control-icon"></span>
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
            <button id="icon-sheet-see-action" class="icon-sheet-btn icon-sheet-btn-primary" type="button">See in action</button>
            <button id="icon-sheet-copy-html" class="icon-sheet-btn icon-sheet-btn-secondary" type="button">Copy HTML</button>
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
          z-index: 100;
        }

        .icon-sheet-wrapper.open {
          pointer-events: auto;
        }

        /* ─── Backdrop ────────────────────────────────────────────────── */
        .icon-sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .icon-sheet-wrapper.open .icon-sheet-backdrop {
          opacity: 1;
        }

        /* ─── Panel (shared base) ─────────────────────────────────────── */
        .icon-sheet-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--surface_1);
          border-top: 1px solid var(--border_color);
          border-radius: 16px 16px 0 0;
          padding: 24px;
          max-height: 70vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
        }

        .icon-sheet-wrapper.open .icon-sheet-panel {
          transform: translateY(0);
        }

        /* ─── Expanded (fullscreen, centered) ────────────────────────── */
        .icon-sheet-wrapper.expanded .icon-sheet-panel {
          position: fixed;
          inset: 0;
          max-height: none;
          border-radius: 0;
          border-top: none;
          transform: none;
          overflow-y: auto;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 80px 32px 40px; /* top padding reserves space for abs controls */
        }

        /* ─── Header ──────────────────────────────────────────────────── */
        .icon-sheet-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
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
        }

        .icon-sheet-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 0;
          /* truncate long names on small screens */
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
          top: 20px;
          right: 20px;
          /* pull it out of the centred flow */
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
           MOBILE overrides  (≤ 768 px)
        ══════════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          .icon-sheet-panel {
            padding: 20px 16px;
            gap: 16px;
            /* slightly more generous on small screens */
            max-height: 75vh;
          }

          /* Smaller thumbnail on mobile */
          .icon-sheet-preview {
            width: 60px;
            height: 60px;
            border-radius: 10px;
          }

          .icon-preview-glyph {
            font-size: 30px;
          }

          /* Info block mirrors the 60 px thumbnail height */
          .icon-sheet-info {
            min-height: 60px;
            gap: 4px;
          }

          .icon-sheet-name {
            font-size: 16px;
          }

          .icon-sheet-tags {
            font-size: 12px;
          }

          /* Slightly larger tap target for nav buttons on touch */
          .icon-sheet-nav-btn {
            width: 36px;
            height: 36px;
          }

          .icon-sheet-nav-btn .switch_icon_chevron_left,
          .icon-sheet-nav-btn .switch_icon_chevron_right {
            font-size: 18px;
          }

          /* Actions stack full-width on very narrow screens */
          .icon-sheet-actions {
            flex-direction: column;
            gap: 10px;
          }

          .icon-sheet-btn {
            width: 100%;
            text-align: center;
          }

          /* Expanded on mobile: tighter padding */
          .icon-sheet-wrapper.expanded .icon-sheet-panel {
            padding: 72px 20px 32px;
            gap: 24px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-preview {
            width: 96px;
            height: 96px;
          }

          .icon-sheet-wrapper.expanded .icon-preview-glyph {
            font-size: 48px;
          }

          .icon-sheet-wrapper.expanded .icon-sheet-name {
            font-size: 22px;
          }
        }
      </style>
    `;
  }
}