import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsStateScreen extends SwitchComponent {
  static screenName = 'docs/state';
  static path = '/docs/state';
  static title = 'State Management';
  static tag = 'sw-docs-state-screen';
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
      <sw-docs-feedback></sw-docs-feedback>
      <sw-docs-pagination></sw-docs-pagination>
    `);
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
