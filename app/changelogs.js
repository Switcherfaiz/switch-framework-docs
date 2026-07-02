import { SwitchComponent, registerComponents } from 'switch-framework';
import { loadDocContent, renderDocShell } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';
import { DocsChangelogLink } from '/components/DocsChangelogLink.js';
import { DocsPageMenu } from '/components/DocsPageMenu.js';
import {
  DocHeading,
  DocSubheading,
  DocSectionHeading,
  DocSubsectionHeading,
  DocParagraph,
  DocCallout,
  DocListItem,
  DocLoader,
} from '/components/DocContent.js';

registerComponents([
  DocsChangelogLink,
  DocsPageMenu,
  DocHeading,
  DocSubheading,
  DocSectionHeading,
  DocSubsectionHeading,
  DocParagraph,
  DocCallout,
  DocListItem,
  DocLoader,
]);

const EXTRA_STYLES = `
  .changelogs-wrap {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .changelogs-header {
    position: sticky;
    top: 0;
    z-index: 100;
    flex-shrink: 0;
  }
  .changelogs-main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
  }
  .changelogs-section {
    max-width: 900px;
    margin: 0 auto;
  }
  @media (max-width: 768px) {
    .changelogs-main { padding: 20px 16px; }
  }
`;

export class SwChangelogsScreen extends SwitchComponent {
  static screenName = 'changelogs';
  static path = '/changelogs';
  static title = 'Changelogs';
  static tag = 'sw-changelogs-screen';
  static layout = 'stack';

  onMount() {
    this.loadContent();
  }

  async loadContent() {
    await loadDocContent(this);
  }

  render() {
    return `
      <div class="changelogs-wrap">
        <header class="changelogs-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="changelogs-main">
          ${renderDocShell('changelogs', '', 'doc-section changelogs-section')}
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}${EXTRA_STYLES}</style>`;
  }
}
