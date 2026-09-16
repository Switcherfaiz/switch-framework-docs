import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsServerDesktopMultiScreen extends SwitchComponent {
  static screenName = 'docs/server/desktop-multi-server';
  static path = '/docs/server/desktop-multi-server';
  static title = 'Multiple Child Servers';
  static tag = 'sw-docs-server-desktop-multi-screen';

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
