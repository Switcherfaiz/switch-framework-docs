import { SwitchComponent, encodeData } from 'switch-framework';

export class SwDocsQuickstartScreen extends SwitchComponent {
  static screenName = 'docs/quickstart';
  static path = '/docs/quickstart';
  static title = 'Quick Start';
  static tag = 'sw-docs-quickstart-screen';
  static layout = 'tabs';

  render() {
    const quickstartCode = {
      title: 'app/_layout.js',
      language: 'javascript',
      code: `import { StackLayout } from 'switch-framework';
import SwIndexScreen from './index.js';
import SwUserNotFoundScreen from './+not-found.js';
import SwTabsLayout from './(tabs)/_layout.js';

export class SwStackLayout extends StackLayout {
  static tag = 'sw-stack-layout';
  static stackScreens = [SwIndexScreen, SwUserNotFoundScreen];
  static tabsLayout = SwTabsLayout;
  static splash = 'sw-starter-splash';
  static initialRoute = 'index';

  static async init({ globalStates, renderSplashscreen }) {
    renderSplashscreen('sw-starter-splash');
    await new Promise(r => setTimeout(r, 2000));
    return { splash: 'sw-starter-splash', initialRoute: 'index' };
  }
}

export default SwStackLayout.getAppLayout();`
    };
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Quick Start</h2>
        <p class="section-desc">
          Here's the mental model: you have a <strong>layout</strong> (stack + optional tabs), <strong>screens</strong> (routes mapped to custom elements), and an <strong>init</strong> phase where you load data and show a splash. Once you get this, you've got 80% of the framework.
        </p>
        <h3 class="subsection" id="folder-structure">Folder structure</h3>
        <sw-codeblock data="${encodeData({
          title: 'Project structure',
          language: 'text',
          code: `my-app/
├── index.html          # Entry HTML with <sw-app-initial>
├── index.js            # startApp(layout)
├── app/
│   ├── _layout.js      # StackLayout with static config
│   ├── index.js        # Home screen
│   └── (tabs)/
│       ├── _layout.js  # TabLayout + tab screens
│       └── screens/    # Doc screens
└── components/`
        })}"></sw-codeblock>
        <h3 class="subsection" id="default-files">Default files</h3>
        <p class="section-desc"><strong>index.js</strong> – Bootstrap the app:</p>
        <sw-codeblock data="${encodeData({
          title: 'index.js',
          language: 'javascript',
          code: `import { startApp } from 'switch-framework';
import layout from './app/_layout.js';

startApp(layout);`
        })}"></sw-codeblock>
        <p class="section-desc"><strong>app/_layout.js</strong> – Stack layout with static config:</p>
        <sw-codeblock data="${encodeData(quickstartCode)}"></sw-codeblock>
        <h3 class="subsection" id="layout-parameters">Layout parameters</h3>
        <p class="section-desc"><strong>StackLayout</strong> uses static config. Pass screen <em>classes</em> (not instances) to <code>stackScreens</code> and <code>tabsLayout</code>. The framework auto-registers them via <code>getScreenConfig()</code> and <code>getLayoutConfig()</code>.</p>
        <p class="section-desc"><strong>StackLayout statics:</strong> <code>stackScreens</code> (array of screen classes), <code>tabsLayout</code> (TabLayout class), <code>splash</code>, <code>initialRoute</code>, <code>init</code></p>
        <p class="section-desc"><strong>TabLayout statics:</strong> <code>screens</code> (array of screen classes), <code>tabs</code>, <code>initialTab</code>, <code>options</code>. Screens must have <code>layout: 'tabs'</code> and a <code>screenName</code> matching a tab's <code>match</code> array.</p>
        <p class="section-desc"><strong>init</strong> – async function run before app mounts. Receives <code>{ globalStates, renderSplashscreen }</code>. Return <code>{ splash, initialRoute }</code>. Call <code>renderSplashscreen('sw-starter-splash')</code> to show splash; the framework registers <code>tabsLayout</code> automatically.</p>
        <h3 class="subsection" id="tab-layout-element">Tab layout element</h3>
        <p class="section-desc">Your tabs layout custom element (e.g. <code>sw-tabs-layout</code>) must implement <code>getContentContainer()</code> returning the element where tab screens render. Use class <code>tabcontainer</code> for that element. The framework injects screen content into it.</p>
        <sw-codeblock data="${encodeData({
          title: '(tabs)/_layout.js',
          language: 'javascript',
          code: `getContentContainer() {
  return this.shadowRoot.querySelector('.tabcontainer');
}

render() {
  return \`
    <div class="layout">
      <nav class="tabbar"><!-- tab bar --></nav>
      <div class="tabcontainer"></div>
    </div>
  \`;
}`
        })}"></sw-codeblock>
        <h3 class="subsection" id="splash-init">Splash screen & init</h3>
        <p class="section-desc"><code>init</code> runs before the app mounts. Call <code>renderSplashscreen('sw-starter-splash')</code> to show a splash. Do async work (e.g. auth), then <code>globalStates.setState({ tabsLayout })</code>. Return <code>{ splash, initialRoute }</code>.</p>
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
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
