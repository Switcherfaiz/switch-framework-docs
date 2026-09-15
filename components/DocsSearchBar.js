import { SwitchComponent, updateState } from 'switch-framework';

/**
 * Opens DocsSearch (Modal) via search-open state.
 * Styled like the search modal panel header.
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
      <button id="docs-search-bar-trigger" class="search-trigger" type="button" aria-label="Search documentation" aria-haspopup="dialog">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
          <path d="M20 20L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="search-trigger-text">Search documentation…</span>
        <kbd class="search-trigger-kbd">Ctrl K</kbd>
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
          max-width: 420px;
        }

        .search-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: var(--surface_1);
          border: 1px solid var(--border_color);
          border-radius: 12px;
          padding: 0 12px;
          height: 38px;
          cursor: pointer;
          font-size: 14px;
          font-family: var(--font);
          color: var(--muted_text);
          transition: border-color 0.15s, box-shadow 0.15s, color 0.15s;
          text-align: left;
          box-sizing: border-box;
          box-shadow: var(--shadow_sm, 0 1px 2px rgba(0,0,0,0.04));
        }

        .search-trigger:hover {
          border-color: color-mix(in srgb, var(--primary) 40%, var(--border_color));
          color: var(--sub_text);
          box-shadow: var(--shadow_md, 0 4px 12px rgba(0,0,0,0.06));
        }

        .search-trigger:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--primary) 55%, transparent);
          outline-offset: 2px;
        }

        .search-trigger .search-icon {
          color: var(--muted_text);
          flex-shrink: 0;
        }

        .search-trigger .search-trigger-text {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .search-trigger kbd {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--muted_text);
          border: 1px solid var(--border_color);
          background: var(--surface_2);
          padding: 2px 6px;
          border-radius: 6px;
          font-family: var(--font-mono, inherit);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          :host {
            max-width: 280px;
          }
          .search-trigger-text {
            font-size: 13px;
          }
          .search-trigger kbd {
            display: none;
          }
        }

        @media (max-width: 640px) {
          :host {
            flex: none;
            max-width: none;
          }
          .search-trigger {
            width: 38px;
            height: 38px;
            min-width: 38px;
            padding: 0;
            justify-content: center;
            border-radius: 10px;
            box-shadow: none;
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
