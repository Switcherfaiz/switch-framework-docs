import { SwitchComponent } from '/switch-framework/index.js';

export class SwDocsComponentsFlatListScreen extends SwitchComponent {
  static screenName = 'docs/components/flatlist';
  static path = '/docs/components/flatlist';
  static title = 'FlatList';
  static tag = 'sw-docs-components-flatlist-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">FlatList</h2>
        <p class="section-desc">
          <strong>FlatList</strong> is a built-in component for rendering scrollable lists with efficient rendering. Documentation coming soon.
        </p>
        <p class="section-desc">
          <sw-docs-changelog-link text="← Back to Component Setup" route="docs/components"></sw-docs-changelog-link>
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
      </style>
    `;
  }
}
