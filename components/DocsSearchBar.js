import { SwitchComponent, updateState } from 'switch-framework';

/**
 * Search trigger for the top bar. Opens DocsSearch via search-open state.
 * Kept separate from TopBar so parent re-renders do not destroy the search modal.
 */
export class DocsSearchBar extends SwitchComponent {
  static tag = 'sw-docs-search-bar';

  onMount() {
    this.listener('#docs-search-bar-trigger', 'click', (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      updateState('search-open', true);
    });
  }

  render() {
    return `
      <button id="docs-search-bar-trigger" class="search-trigger" type="button" aria-label="Search documentation">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
          <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="search-trigger-text">Search...</span>
        <kbd class="search-trigger-kbd">Ctrl+K</kbd>
      </button>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          flex: 1;
          min-width: 0;
          max-width: 600px;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          background: var(--surface_2);
          border: 1px solid var(--border_color);
          border-radius: 10px;
          padding: 8px 12px;
          height: 38px;
          cursor: pointer;
          font-size: var(--text-md, 14px);
          font-family: var(--font);
          color: var(--muted_text);
          transition: border-color 0.2s;
          text-align: left;
          box-sizing: border-box;
        }

        .search-trigger:hover {
          border-color: var(--primary);
          color: var(--sub_text);
        }

        .search-trigger .search-icon {
          color: var(--muted_text);
          flex-shrink: 0;
        }

        .search-trigger .search-trigger-text {
          flex: 1;
        }

        .search-trigger kbd {
          font-size: var(--text-xs, 11px);
          color: var(--muted_text);
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          padding: 2px 6px;
          border-radius: 5px;
          font-family: var(--font-mono, inherit);
        }

        @media (max-width: 640px) {
          :host {
            flex: none;
            max-width: 48px;
          }
          .search-trigger {
            width: 48px;
            height: 48px;
            max-width: 48px;
            min-width: 48px;
            padding: 0;
            border: none;
            border-radius: 9999px;
            justify-content: center;
            background: transparent;
            color: var(--main_text);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            position: relative;
            z-index: 10;
          }
          .search-trigger:hover,
          .search-trigger:active {
            background: var(--surface_hover);
          }
          .search-trigger .search-icon {
            color: inherit;
          }
          .search-trigger .search-trigger-text,
          .search-trigger .search-trigger-kbd {
            display: none;
          }
        }
      </style>
    `;
  }
}
