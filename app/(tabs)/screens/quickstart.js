import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsQuickstartScreen extends SwitchComponent {
  static screenName = 'docs/quickstart';
  static path = '/docs/quickstart';
  static title = 'Quick Start';
  static tag = 'sw-docs-quickstart-screen';
  static layout = 'tabs';

  onMount() {
    this.loadContent();
  }

  async loadContent() {
    await loadDocContent(this);
  }

  render() {
    return renderDocShell(docPageFromScreenName(this.constructor.screenName));
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
