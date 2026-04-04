import { SwitchComponent, encodeData } from 'switch-framework';
import { basicListCode, gridListCode, infiniteScrollCode } from '/codes/index.js';

const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 920px; margin: 0 auto; }
  .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
  .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
  .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
  .feature-list { list-style: none; padding: 0; margin: 16px 0; }
  .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  .method-list { list-style: none; padding: 0; margin: 16px 0; }
  .method-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 12px; }
  .method-list li::before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
  sw-live-code-preview { display: block; width: 100%; margin: 8px 0 24px; }
  sw-codeblock { display: block; margin: 16px 0; }
  .info-box { background: var(--surface_2); border-left: 3px solid var(--primary); padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  .info-box p { margin: 0; font-size: 14px; line-height: 1.6; }
  .state-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px; }
  .ref-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px; }
`;

export class SwDocsComponentsFlatListScreen extends SwitchComponent {
  static screenName = 'docs/components/flatlist';
  static path = '/docs/components/flatlist';
  static title = 'FlatList';
  static tag = 'sw-docs-componentsflatlist-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">FlatList</h2>
        <p class="section-desc">
          <strong>FlatList</strong> is a performant list component inspired by React Native's FlatList. It provides efficient rendering of scrollable lists with built-in support for infinite scrolling, grid layouts, pull-to-refresh, and state-driven updates.
        </p>

        <div class="info-box">
          <p><strong>Key Concept:</strong> FlatList extends <code>SwitchComponent</code> and uses <strong>states</strong> (re-rendering) and <strong>refs</strong> (DOM manipulation without re-render) for optimal performance.</p>
        </div>

        <h3 class="subsection" id="basic-usage">Basic Usage</h3>
        <p class="section-desc">
          Extend <code>FlatList</code> and override <code>renderItem()</code> to render each item. Initialize states in a <code>static {}</code> block using <code>createState()</code>, then use <code>static { this.useState('key'); }</code> to subscribe to changes for automatic re-rendering.
        </p>
        <sw-live-code-preview data="${encodeData({
          title: basicListCode.title,
          language: basicListCode.language,
          code: basicListCode.code,
          preview: 'liveview'
        })}"></sw-live-code-preview>

        <h3 class="subsection" id="grid-layout">Grid Layout</h3>
        <p class="section-desc">
          Set <code>static numColumns = N</code> to create a grid. The layout automatically adjusts using flexbox with percentage-based widths.
        </p>
        <sw-live-code-preview data="${encodeData({
          title: gridListCode.title,
          language: gridListCode.language,
          code: gridListCode.code,
          preview: 'liveview'
        })}"></sw-live-code-preview>

        <h3 class="subsection" id="infinite-scroll">Infinite Scrolling</h3>
        <p class="section-desc">
          Override <code>onEndReached()</code> to load more data when the user scrolls near the bottom. Use <code>static onEndReachedThreshold</code> to control when the callback fires (0.5 = 50% from bottom).
        </p>
        <sw-live-code-preview data="${encodeData({
          title: infiniteScrollCode.title,
          language: infiniteScrollCode.language,
          code: infiniteScrollCode.code,
          preview: 'liveview'
        })}"></sw-live-code-preview>

        <h3 class="subsection" id="render-methods">User Overridable Methods</h3>
        <ul class="method-list">
          <li><code>renderItem({ item, index, separators })</code> - Render a single item. Required.</li>
          <li><code>keyExtractor(item, index)</code> - Return unique key string for item.</li>
          <li><code>renderLoader()</code> - Render bottom loading indicator.</li>
          <li><code>renderEmpty()</code> - Render when data array is empty.</li>
          <li><code>renderHeader()</code> - Render header component at top.</li>
          <li><code>renderFooter()</code> - Render footer component at bottom.</li>
          <li><code>renderSeparator()</code> - Render separator between items.</li>
          <li><code>renderError()</code> - Render error state.</li>
          <li><code>onEndReached()</code> - Called when scrolling near bottom.</li>
          <li><code>onRefresh()</code> - Called for pull-to-refresh.</li>
          <li><code>onScroll(event)</code> - Called on every scroll event.</li>
          <li><code>getItemLayout(data, index)</code> - Return { length, offset, index } for optimization.</li>
        </ul>

        <h3 class="subsection" id="static-config">Static Configuration</h3>
        <ul class="feature-list">
          <li><code>static numColumns = 1</code> - Number of columns for grid layout.</li>
          <li><code>static horizontal = false</code> - Horizontal scrolling instead of vertical.</li>
          <li><code>static onEndReachedThreshold = 0.5</code> - How close to bottom before triggering onEndReached (0-1).</li>
          <li><code>static initialNumToRender = 10</code> - Initial items to render (for future virtualization).</li>
          <li><code>static windowSize = 21</code> - Viewport window size for virtualization.</li>
        </ul>

        <h3 class="subsection" id="public-api">Public API Methods</h3>
        <ul class="method-list">
          <li><code>scrollToIndex({ index, animated, viewOffset })</code> - Scroll to specific item index.</li>
          <li><code>scrollToEnd({ animated })</code> - Scroll to bottom/end of list.</li>
          <li><code>scrollToOffset({ offset, animated })</code> - Scroll to specific offset position.</li>
          <li><code>recordInteraction()</code> - Record interaction for highlighting.</li>
          <li><code>flashScrollIndicators()</code> - Flash scrollbars briefly.</li>
        </ul>

        <h3 class="subsection" id="lifecycle">Lifecycle</h3>
        <ul class="feature-list">
          <li><code>onMount()</code> - Call <code>super.onMount()</code> first, then add listeners via <code>this.listener()</code>.</li>
          <li><code>onDestroy()</code> - Cleanup registered automatically. Use <code>this.addOnDestroy(fn)</code> for custom cleanup.</li>
        </ul>

        <p class="section-desc">
          <sw-docs-changelog-link text="← Back to Component Setup" route="docs/components"></sw-docs-changelog-link>
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}