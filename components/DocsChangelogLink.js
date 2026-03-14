import { SwitchComponent } from '/switch-framework/index.js';
import { navigate } from '/switch-framework/router/index.js';

/**
 * Reusable inline changelog link. Use in changelogs and docs to link to specific pages.
 * @example
 * Added <sw-docs-changelog-link text="State Management" route="docs/state"></sw-docs-changelog-link>
 */
export class DocsChangelogLink extends SwitchComponent {
  static tag = 'sw-docs-changelog-link';

  connected() {
    const link = this.shadowRoot?.querySelector('.changelog-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = this.getAttribute('route') || '';
        if (route) navigate(route);
      });
    }
  }

  render() {
    const text = this.getAttribute('text') || this.textContent || 'Link';
    const route = this.getAttribute('route') || '';

    return `
      <span class="changelog-link" role="button" tabindex="0" data-route="${route}">${text}</span>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: inline;
        }

        .changelog-link {
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s, opacity 0.2s;
        }

        .changelog-link:hover {
          border-bottom-color: var(--primary);
          opacity: 0.9;
        }

        .changelog-link:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
      </style>
    `;
  }
}
