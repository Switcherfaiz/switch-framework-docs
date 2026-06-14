import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsServerDesktopScreen extends SwitchComponent {
  static screenName = 'docs/server/desktop';
  static path = '/docs/server/desktop';
  static title = 'Desktop Server';
  static tag = 'sw-docs-server-desktop-screen';
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
