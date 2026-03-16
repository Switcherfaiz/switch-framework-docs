import { SwitchComponent, encodeData } from '/switch-framework/index.js';

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
  static layout = 'stack';

  render() {
    return `
      <div class="authors-wrap">
        <header class="authors-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="authors-main">
          <div class="doc-section">
            <h2 class="section-title">Authors</h2>
            <p class="section-desc">Contributors and maintainers of Switch Framework.</p>
            <div class="authors-list">
              ${AUTHORS.map((author) => `<sw-profiles data="${encodeData(author)}"></sw-profiles>`).join('')}
            </div>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; min-height: 100vh; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .authors-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .authors-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .authors-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 24px; }
        .authors-list { display: flex; flex-direction: column; }
      </style>
    `;
  }
}
