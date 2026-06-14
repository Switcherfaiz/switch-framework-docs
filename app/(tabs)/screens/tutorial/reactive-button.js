import { SwitchComponent } from 'switch-framework';
import { loadDocContent, renderDocShell, docPageFromScreenName } from '/utils/doc-loader.js';
import { DOC_STYLES } from '/utils/doc-styles.js';

const EXTRA_STYLES = `
  sw-live-code-preview { display: block; width: 100%; margin: 8px 0 24px; }
`;

export class SwDocsTutorialReactiveButtonScreen extends SwitchComponent {
  static screenName = 'docs/tutorial/reactive-button';
  static path = '/docs/tutorial/reactive-button';
  static title = 'Tutorial: Reactive Button';
  static tag = 'sw-docs-tutorial-reactive-button-screen';
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
    return `<style>${DOC_STYLES}${EXTRA_STYLES}</style>`;
  }
}
