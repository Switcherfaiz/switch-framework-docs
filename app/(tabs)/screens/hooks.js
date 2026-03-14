import { SwitchComponent, encodeData } from '/switch-framework/index.js';

const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
  .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
  .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
  .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
  .feature-list { list-style: none; padding: 0; margin: 16px 0; }
  .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
`;

export class SwDocsHooksScreen extends SwitchComponent {
  static screenName = 'docs/hooks';
  static path = '/docs/hooks';
  static title = 'Hooks';
  static tag = 'sw-docs-hooks-screen';
  static layout = 'tabs';

  render() {
    const useStateCode = {
      title: 'useState',
      language: 'javascript',
      code: `const [value, unsub] = useState('my-state', (newValue) => {
  // Runs when state changes
  this._renderToShadow();
});
// Call unsub() in disconnected()`
    };

    const useEffectCode = {
      title: 'useEffect',
      language: 'javascript',
      code: `connected() {
  this.useEffect(() => this._renderToShadow(), ['activeRoute', 'routeParams']);
}`
    };

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Hooks</h2>
        <p class="section-desc">
          Switch Framework provides hooks for reactive updates. <code>useState</code> subscribes to state changes; <code>useEffect</code> subscribes to <code>globalStates</code> keys like <code>activeRoute</code>.
        </p>
        <h3 class="subsection" id="usestate">useState</h3>
        <p class="section-desc">
          Subscribe to a state key. When the state changes, your callback runs. Return an unsubscribe function – call it in <code>disconnected()</code> to avoid leaks.
        </p>
        <sw-codeblock data="${encodeData(useStateCode)}"></sw-codeblock>
        <h3 class="subsection" id="useeffect">useEffect</h3>
        <p class="section-desc">
          Subscribe to <code>globalStates</code> keys. Useful for re-rendering when the route or route params change. The callback runs when any watched key updates.
        </p>
        <sw-codeblock data="${encodeData(useEffectCode)}"></sw-codeblock>
        <h3 class="subsection" id="router-hooks">Router hooks</h3>
        <p class="section-desc">
          From <code>/switch-framework/router/index.js</code>: <code>useParams()</code>, <code>useSearchParams()</code>, <code>getActiveRoute()</code>, <code>useRouteChangesSubscriber()</code>.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${DOC_STYLES}</style>`;
  }
}
