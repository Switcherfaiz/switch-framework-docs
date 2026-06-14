import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsAnimationsScreen extends SwitchComponent {
  static screenName = 'docs/animations';
  static path = '/docs/animations';
  static title = 'Animations';
  static tag = 'sw-docs-animations-screen';
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
