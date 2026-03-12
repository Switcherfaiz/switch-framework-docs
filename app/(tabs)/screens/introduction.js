import { SwitchComponent } from '/switch-framework/index.js';

export class SwDocsIntroScreen extends SwitchComponent {
  static screenName = 'docs/introduction';
  static path = '/docs/introduction';
  static title = 'Introduction';
  static tag = 'sw-docs-intro-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h1 class="section-title" id="overview">Introduction</h1>
        <p class="section-desc">
          <strong>Switch Framework</strong> is a lightweight, runtime-first frontend framework that plays nicely with <code>switch-framework-backend</code>. Think of it as your friendly neighborhood router + component layer – no build step required, no webpack config to cry over. Just HTML, ES modules, and a sprinkle of structure.
        </p>
        <h3 class="subsection" id="whats-the-deal">What's the deal?</h3>
        <p class="section-desc">
          You get a declarative routing system (stack screens, tab navigation), Web Components for encapsulation, and optional state management. Everything runs directly in the browser – no bundler needed to get started. Prototype fast, ship faster. If you've ever wanted "React Router but simpler" or "Vue's structure without the framework," Switch is here for you.
        </p>
        <h3 class="subsection" id="key-features">Key Features</h3>
        <ul class="feature-list">
          <li><strong>Runtime-first</strong> – No bundler required. Use native ES modules. Your <code>index.html</code> loads scripts, and you're off to the races.</li>
          <li><strong>SwitchComponent</strong> – Base class for screens and components. Shadow DOM, <code>render()</code>, <code>styleSheet()</code>, <code>connected()</code>/<code>disconnected()</code>, and <code>useEffect</code> for reactive updates.</li>
          <li><strong>Reactive state</strong> – <code>createState</code> and <code>useState</code> for shared, event-driven state. No prop drilling.</li>
          <li><strong>StackLayout & TabLayout</strong> – Static config: <code>stackScreens</code>, <code>tabsLayout</code>, <code>screens</code>. Pass screen classes directly; the framework auto-registers them.</li>
          <li><strong>Backend integration</strong> – <code>switch-framework-backend</code> gives you auth, sessions, and API helpers. Full-stack made easy.</li>
          <li><strong>Theming</strong> – Dark/light mode with CSS variables. One line to init, and you're themed.</li>
        </ul>
        <h3 class="subsection" id="when-to-use">When should I use Switch?</h3>
        <p class="section-desc">
          Documentation sites, dashboards, internal tools, admin panels – anything that needs routing and a bit of structure without the overhead of a big framework. If you like vanilla JS and want "just enough" abstraction, Switch fits. If you're building the next Facebook, maybe reach for something heavier – but for most apps, Switch has your back.
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
        .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
        .feature-list { list-style: none; padding: 0; margin: 16px 0; display: flex; flex-direction: column; gap: 10px; }
        .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; }
        .feature-list li:before { content: '→'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
