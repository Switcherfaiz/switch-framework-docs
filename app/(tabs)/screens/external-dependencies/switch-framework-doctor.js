import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

export class SwDocsSwitchFrameworkDoctorScreen extends SwitchComponent {
  static screenName = 'docs/external-dependencies/switch-framework-doctor';
  static path = '/docs/external-dependencies/switch-framework-doctor';
  static title = 'Switch Framework Doctor';
  static tag = 'sw-docs-switch-framework-doctor-screen';

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
