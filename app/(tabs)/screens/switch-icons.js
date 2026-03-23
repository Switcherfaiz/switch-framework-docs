import { SwitchComponent, encodeData, updateState, useState } from 'switch-framework';
import { icons } from '/data/icons-map.js';
import { iconsFilterHandlers } from '/data/icons-filter-handlers.js';

const ICON_KEYS = Object.keys(icons);
const BATCH_SIZE = 96;
const INITIAL_COUNT = BATCH_SIZE;

export class SwDocsSwitchIconsScreen extends SwitchComponent {
  static screenName = 'docs/switch-icons';
  static path = '/docs/switch-icons';
  static title = 'Switch Icons';
  static tag = 'sw-docs-switch-icons-screen';
  static layout = 'tabs';

  filterKeys(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return ICON_KEYS;
    const needle = q.replace(/\s+/g, '_');
    return ICON_KEYS.filter((key) => {
      const name = key.replace(/^switch_icon_/, '').replace(/_/g, ' ');
      return key.toLowerCase().includes(needle) || name.includes(q);
    });
  }

  updateGridDOM(state) {
    const grid = this.select('#icons-grid');
    const loadMoreWrap = this.select('#icons-load-more-wrap');
    if (!grid) return;

    const query = state?.query ?? '';
    const displayCount = state?.displayCount ?? INITIAL_COUNT;
    const filtered = this.filterKeys(query);
    const visible = filtered.slice(0, displayCount);
    const hasMore = filtered.length > displayCount;

    grid.innerHTML = visible.map((key) => `
      <div class="icon-tile" data-icon="${this.escapeAttr(key)}">
        <span class="${key} icon-glyph"></span>
        <span class="icon-tooltip">${this.escapeHtml(key.replace(/^switch_icon_/, '').replace(/_/g, '-'))}</span>
      </div>
    `).join('');

    if (loadMoreWrap) {
      loadMoreWrap.style.display = hasMore ? '' : 'none';
    }

    this._filteredKeys = filtered;
  }

  openSheet(iconKey, filteredKeys, index) {
    updateState('icon-sheet', (prev) => ({
      ...(prev || {}),
      open: true,
      iconKey,
      filteredKeys,
      index
    }));
  }

  handleIconsFilterUpdate(state) {
    this.updateGridDOM(state);
  }

  handleSearchInput(e) {
    updateState('icons-filter', (s) => ({ ...(s || {}), query: e.target?.value || '', displayCount: INITIAL_COUNT }));
  }

  handleLoadMore() {
    updateState('icons-filter', (s) => ({ ...(s || {}), displayCount: (s?.displayCount ?? INITIAL_COUNT) + BATCH_SIZE }));
  }

  handleIconTileClick(e) {
    const tile = e.target?.closest?.('.icon-tile');
    if (!tile) return;
    const iconKey = tile.getAttribute('data-icon');
    const filteredKeys = this._filteredKeys || ICON_KEYS;
    const index = filteredKeys.indexOf(iconKey);
    if (index >= 0) this.openSheet(iconKey, filteredKeys, index);
  }

  onMount() {
    this._filteredKeys = ICON_KEYS;
    iconsFilterHandlers.updateGrid = this.handleIconsFilterUpdate.bind(this);
    const [, unsub] = useState('icons-filter', (state) => iconsFilterHandlers.updateGrid?.(state));
    this.addOnDestroy(() => {
      iconsFilterHandlers.updateGrid = null;
      unsub?.();
    });
    this.listener('#icons-search-input', 'input', this.handleSearchInput.bind(this));
    this.listener('#icons-load-more', 'click', this.handleLoadMore.bind(this));
    this.listener('.icon-tile', 'click', (e) => this.handleIconTileClick(e));
  }

  render() {
    const visibleKeys = ICON_KEYS.slice(0, INITIAL_COUNT);
    const hasMore = ICON_KEYS.length > INITIAL_COUNT;
    this._filteredKeys = ICON_KEYS;

    return `
      <div class="icons-screen">
        <div class="icons-header">
          <h2 class="icons-title">Switch Icons</h2>
          <p class="icons-desc">
            Switch Framework includes an icon font from <code>/assets/icons/style.css</code>. Icons are used via CSS classes in the format <code>switch_icon_&lt;name&gt;</code>. Search and click an icon to view details and copy code.
          </p>
        </div>

        <h3 class="icons-subsection">Usage</h3>
        <p class="icons-desc">
          Import the icon stylesheet in your component's <code>styleSheet()</code>, then add a span with the icon class:
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Using Switch Icons',
          language: 'html',
          code: `@import '/assets/icons/style.css';

/* In your template: */
<span class="switch_icon_github"></span>
<span class="switch_icon_chevron_right"></span>`
        })}"></sw-codeblock>

        <h3 class="icons-subsection">All Icons</h3>
        <div class="icons-all-row">
          <p class="icons-desc icons-all-desc">
            Click an icon to open its detail panel. Use the search bar to filter.
          </p>
          <div class="icons-search-wrap">
            <span class="switch_icon_search icons-search-icon"></span>
            <input id="icons-search-input" type="text" placeholder="Search ${ICON_KEYS.length} icons..." class="icons-search-input" autocomplete="off" />
          </div>
        </div>

        <div id="icons-grid" class="icons-grid">
          ${visibleKeys.map((key) => `
            <div class="icon-tile" data-icon="${this.escapeAttr(key)}">
              <span class="${key} icon-glyph"></span>
              <span class="icon-tooltip">${this.escapeHtml(key.replace(/^switch_icon_/, '').replace(/_/g, '-'))}</span>
            </div>
          `).join('')}
        </div>

        <div id="icons-load-more-wrap" class="icons-load-more-wrap" style="${!hasMore ? 'display:none' : ''}">
          <button id="icons-load-more" type="button" class="icons-load-more-btn">Load more</button>
        </div>

        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s || '';
    return div.innerHTML;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
        }

        * { box-sizing: border-box; }

        .icons-screen {
          padding: 32px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .icons-header {
          margin-bottom: 32px;
        }

        .icons-all-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .icons-all-desc {
          flex: 1;
          min-width: 200px;
          margin: 0 !important;
        }

        .icons-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--main_text);
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .icons-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--sub_text);
          margin: 0 0 16px;
        }

        .icons-search-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 10px;
          padding: 12px 16px;
          width: 280px;
          flex-shrink: 0;
        }

        .icons-search-wrap:focus-within {
          border-color: var(--primary);
        }

        .icons-search-icon {
          font-size: 18px;
          color: var(--muted_text);
          flex-shrink: 0;
        }

        .icons-search-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 15px;
          font-family: inherit;
          color: var(--main_text);
          min-width: 0;
        }

        .icons-search-input::placeholder {
          color: var(--muted_text);
        }

        .icons-subsection {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 28px 0 12px;
        }

        code {
          background: var(--surface_2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
          font-size: 13px;
          color: var(--main_text);
        }

        .icons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
          gap: 12px;
          margin: 24px 0;
        }

        .icon-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          background: var(--surface_2);
          border-radius: 10px;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s;
          position: relative;
        }

        .icon-tile:hover {
          background: var(--surface_hover);
        }

        .icon-glyph {
          font-size: 28px;
          color: var(--main_text);
        }

        .icon-tooltip {
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background: var(--primary);
          color: white;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
          z-index: 10;
        }

        .icon-tile:hover .icon-tooltip {
          opacity: 1;
        }

        .icons-load-more-wrap {
          display: flex;
          justify-content: center;
          margin: 24px 0;
        }

        .icons-load-more-btn {
          padding: 12px 32px;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--main_text);
          cursor: pointer;
          font-family: inherit;
        }

        .icons-load-more-btn:hover {
          background: var(--surface_hover);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .icons-all-row {
            flex-direction: column;
            align-items: stretch;
          }
          .icons-search-wrap {
            width: 100%;
          }
        }
      </style>
    `;
  }
}
