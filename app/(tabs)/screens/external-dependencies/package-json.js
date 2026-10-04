import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsExternalDependenciesPackageJsonScreen extends SwitchComponent {
  static screenName = 'docs/external-dependencies/package-json';
  static path = '/docs/external-dependencies/package-json';
  static title = 'Allowlisting in package.json';
  static tag = 'sw-docs-external-dependencies-package-json-screen';

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
