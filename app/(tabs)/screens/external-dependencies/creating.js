import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsExternalDependenciesCreatingScreen extends SwitchComponent {
  static screenName = 'docs/external-dependencies/creating';
  static path = '/docs/external-dependencies/creating';
  static title = 'Creating a Switch package';
  static tag = 'sw-docs-external-dependencies-creating-screen';

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
