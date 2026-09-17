import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsServerDesktopElectronPackageScreen extends SwitchComponent {
  static screenName = 'docs/server/desktop-electron-package';
  static path = '/docs/server/desktop-electron-package';
  static title = 'switch-framework-electron';
  static tag = 'sw-docs-server-desktop-electron-package-screen';

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
