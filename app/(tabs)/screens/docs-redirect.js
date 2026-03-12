import { SwitchComponent } from '/switch-framework/index.js';
import { navigate } from '/switch-framework/router/index.js';

export class SwDocsRedirectScreen extends SwitchComponent {
  static screenName = 'docs';
  static path = '/docs';
  static title = 'Docs';
  static tag = 'sw-docs-redirect-screen';
  static layout = 'tabs';

  connected() {
    navigate('docs/introduction');
  }

  render() {
    return '<div class="doc-section"><p>Redirecting to docs...</p></div>';
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
        .doc-section { padding: 32px; }
      </style>
    `;
  }
}
