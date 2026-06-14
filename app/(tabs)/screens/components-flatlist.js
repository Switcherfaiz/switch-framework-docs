import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

const EXTRA_STYLES = `
  .doc-section { max-width: 920px; }
  .section-desc { font-size: 15px; margin: 0 0 20px; }
`;

export class SwDocsComponentsFlatListScreen extends SwitchComponent {
  static screenName = 'docs/components/flatlist';
  static path = '/docs/components/flatlist';
  static title = 'FlatList';
  static tag = 'sw-docs-componentsflatlist-screen';
  static layout = 'tabs';

  onMount() {
    this.loadContent();
  }

  async loadContent() {
    await loadDocContent(this);
  }

  render() {
    const page = docPageFromScreenName(this.constructor.screenName);
    return renderDocShell(page, `
      <p class="section-desc">
        <sw-docs-changelog-link text="← Back to Component Setup" route="docs/components"></sw-docs-changelog-link>
      </p>
      <sw-docs-pagination></sw-docs-pagination>
    `);
  }

  styleSheet() {
    return `<style>${DOC_STYLES}${EXTRA_STYLES}</style>`;
  }
}
