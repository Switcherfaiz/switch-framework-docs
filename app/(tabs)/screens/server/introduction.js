import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsServerIntroScreen extends SwitchComponent {
  static screenName = 'docs/server/introduction';
  static path = '/docs/server/introduction';
  static title = 'Server Introduction';
  static tag = 'sw-docs-server-intro-screen';
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
