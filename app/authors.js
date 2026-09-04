import { SwitchComponent, encodeData } from 'switch-framework';
import { SITE_PAGE_STYLES } from '/utils/doc-styles.js';

const AUTHORS = [
  {
    name: 'Faiz Ahmad Ally',
    subtitle: 'Main author & contributor (Switcherfaiz)',
    image: '',
    githubUrl: 'https://github.com/Switcherfaiz'
  }
];

export class SwAuthorsScreen extends SwitchComponent {
  static screenName = 'authors';
  static path = '/authors';
  static title = 'Authors';
  static tag = 'sw-authors-screen';

  render() {
    return `
      <div class="site-wrap">
        <header class="site-header"><sw-topbar></sw-topbar></header>
        <main class="site-main">
          <div class="site-section">
            <p class="site-kicker">People</p>
            <h1 class="site-title">Authors</h1>
            <p class="site-desc">Contributors and maintainers of Switch Framework.</p>
            <div class="authors-list">
              ${AUTHORS.map((author) => `<sw-profiles data="${encodeData(author)}"></sw-profiles>`).join('')}
            </div>
          </div>
        </main>
        <sw-docs-footer></sw-docs-footer>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        ${SITE_PAGE_STYLES}
        .authors-list {
          margin-top: 12px;
          border: 1px solid var(--border_color);
          border-radius: 16px;
          background: var(--surface_1);
          padding: 8px 20px;
        }
      </style>
    `;
  }
}
