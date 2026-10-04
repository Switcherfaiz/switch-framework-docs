import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsExternalDependenciesScreen extends SwitchComponent {
  static screenName = 'docs/external-dependencies';
  static path = '/docs/external-dependencies';
  static title = 'Importing packages';
  static tag = 'sw-docs-external-dependencies-screen';

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
