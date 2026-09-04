import { SwitchComponent, encodeData } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { copyText } from '/utils/clipboard.js';

const INSTALL_CMD = 'npx create-switch-framework-app my-app';

export class SwIndexScreen extends SwitchComponent {
  static screenName = 'index';
  static path = '/';
  static title = 'Welcome';
  static tag = 'sw-index-screen';

  onMount() {
    this.bindEvents();
  }

  bindEvents() {
    const goDocs = () => navigate('docs/introduction');
    this.select('#get_started')?.addEventListener('click', goDocs);
    this.select('#cta_get_started')?.addEventListener('click', goDocs);
    this.select('#cta_read_docs')?.addEventListener('click', goDocs);
    this.select('#talk_to_us')?.addEventListener('click', () => {
      window.open('https://github.com/Switcherfaiz/switch-framework', '_blank');
    });
    this.select('#badge_link')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('changelogs');
    });

    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) navigate(route);
    });

    const copyBtn = this.select('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const ok = await copyText(INSTALL_CMD);
        if (ok) {
          const orig = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span class="copied-mark">Copied</span>';
          setTimeout(() => { copyBtn.innerHTML = orig; }, 1400);
        }
      });
    }
  }

  counterCode() {
    return `import { SwitchComponent, getState, updateState, createState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  static { createState('counter', 0); }
  static { this.useState('counter'); }

  onMount() {
    this.listener('#inc', 'click', () => {
      updateState('counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('counter') ?? 0;
    return \`<button id="inc">Count: \${count}</button>\`;
  }

  styleSheet() {
    return \`<style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 120px;
        font-family: var(--font);
      }
      #inc {
        padding: 12px 28px;
        font-size: 16px;
        border: none;
        border-radius: 999px;
        cursor: pointer;
        background: #4f46e5;
        color: white;
        font-weight: 650;
        font-family: inherit;
      }
    </style>\`;
  }
}`;
  }

  render() {
    const codeData = {
      title: 'components/Counter.js',
      language: 'javascript',
      preview: 'liveview',
      code: this.counterCode()
    };

    const startCards = [
      { title: 'Introduction', desc: 'What Switch is, and when to use it.', route: 'docs/introduction', kicker: 'Start' },
      { title: 'Install', desc: 'CLI or manual setup for web and desktop.', route: 'docs/installation/web', kicker: 'Setup' },
      { title: 'Tutorial', desc: 'Build a reactive button in a few minutes.', route: 'docs/tutorial/reactive-button', kicker: 'Guide' },
      { title: 'Routing', desc: 'Stack screens, tabs, and dynamic routes.', route: 'docs/router', kicker: 'Core' },
      { title: 'State', desc: 'createState, useState, and shared keys.', route: 'docs/state', kicker: 'Core' },
      { title: 'Components', desc: 'SwitchComponent, shadow DOM, and APIs.', route: 'docs/components', kicker: 'API' }
    ];

    const features = [
      { icon: 'code', title: 'No build step', desc: 'Run directly in the browser. Native ES modules, no bundler, no transpilation. Ideal for prototypes, internal tools, and docs sites.', route: 'docs/introduction' },
      { icon: 'bolt', title: 'Lightweight', desc: 'Small runtime. No virtual DOM, no diffing. Components render to shadow DOM. Fast load, fast interaction.', route: 'docs/goals' },
      { icon: 'communities', title: 'Familiar patterns', desc: 'Stack and tab navigation like mobile apps. State management that feels like React useState. Web Components under the hood.', route: 'docs/router' },
      { icon: 'data', title: 'Flexible', desc: 'Mix reactive state with vanilla DOM. Use as much or as little of the framework as you need. No lock-in — just JavaScript and HTML.', route: 'docs/state' },
      { icon: 'a11y', title: 'Accessible', desc: 'Built with WAI-ARIA patterns. Screen reader support and keyboard navigation right out of the box.', route: 'docs/components' },
      { icon: 'palette', title: 'Themable', desc: 'CSS variables and dark/light mode. Easily customize the look and feel of your app.', route: 'docs/theming' }
    ];

    return `
      <div class="wrap">
        <header class="topbar-fixed">
          <sw-topbar></sw-topbar>
        </header>

        <main class="main">
          <section class="hero">
            <div class="hero-grid" aria-hidden="true"></div>
            <div class="hero-copy">
              <button id="badge_link" class="badge" type="button">
                <span class="badge-pill">New</span>
                Runtime-first web components
                <span class="badge-arrow">→</span>
              </button>
              <h1>Build faster with <em>Switch Framework</em></h1>
              <p class="lede">A lightweight web framework for fast, reactive apps with Web Components — no build step, familiar routing patterns, and state management built in.</p>
              <div class="actions">
                <button id="get_started" class="btn-primary" type="button">Open docs</button>
                <button id="talk_to_us" class="btn-ghost" type="button">GitHub</button>
              </div>
              <div class="command">
                <span class="prompt">❯</span>
                <code>${INSTALL_CMD}</code>
                <button class="copy-btn" type="button" aria-label="Copy install command">Copy</button>
              </div>
              <p class="hint">Or install globally: <code>npm install -g create-switch-framework-app</code></p>
            </div>
            <div class="hero-visual">
              <div class="window">
                <div class="window-bar">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                  <span class="window-title">components/Counter.js</span>
                </div>
                <div class="window-body">
                  <sw-codeblock data="${encodeData(codeData)}"></sw-codeblock>
                </div>
              </div>
            </div>
          </section>

          <section class="band">
            <div class="band-head">
              <p class="kicker">Documentation</p>
              <h2>Start here</h2>
              <p>Everything in these docs is about Switch Framework — routing, state, components, CLI, and the backend companion.</p>
            </div>
            <div class="card-grid">
              ${startCards.map((card) => `
                <a class="doc-card" href="#" data-route="${card.route}">
                  <span class="card-kicker">${card.kicker}</span>
                  <strong>${card.title}</strong>
                  <span>${card.desc}</span>
                </a>
              `).join('')}
            </div>
          </section>

          <section class="band">
            <div class="band-head">
              <p class="kicker">Why Switch?</p>
              <h2>The pieces you actually need</h2>
            </div>
            <div class="feature-grid">
              ${features.map((item) => `
                <a class="feature" href="#" data-route="${item.route}">
                  <span class="feature-icon">${this.getIcon(item.icon)}</span>
                  <strong>${item.title}</strong>
                  <span>${item.desc}</span>
                </a>
              `).join('')}
            </div>
          </section>

          <section class="cta-band">
            <div class="cta">
              <h2>Ready to start building?</h2>
              <p>Scaffold a new app with one command, then follow the docs for layouts, routing, and state.</p>
              <div class="actions">
                <button id="cta_get_started" class="btn-primary" type="button">Open docs</button>
                <button id="cta_read_docs" class="btn-ghost light" type="button">Read introduction</button>
              </div>
            </div>
          </section>
        </main>

        <sw-docs-footer></sw-docs-footer>
      </div>
    `;
  }

  getIcon(name) {
    const icons = {
      code: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 7L4 12l5 5M15 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
      communities: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      data: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 3H5v18h3M16 3h3v18h-3M12 7v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      a11y: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2" stroke="currentColor" stroke-width="1.8"/><path d="M4 9h16M8 9l2 13M16 9l-2 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
      palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 0 18h1.2A2.4 2.4 0 0 0 15.6 18.6a2 2 0 0 1 2-2h.9A3.5 3.5 0 0 0 22 13.1C22 7.5 17.5 3 12 3z" stroke="currentColor" stroke-width="1.8"/><circle cx="7.5" cy="10" r="1" fill="currentColor"/><circle cx="10.5" cy="7.2" r="1" fill="currentColor"/><circle cx="14.5" cy="7.8" r="1" fill="currentColor"/></svg>'
    };
    return icons[name] || '';
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          font-family: var(--font);
          background: var(--page_background);
          color: var(--main_text);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .wrap { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar-fixed { position: sticky; top: 0; z-index: 100; }
        .main { flex: 1; }

        .hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: 48px;
          align-items: center;
          max-width: 1120px;
          margin: 0 auto;
          padding: 72px 32px 80px;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border_color) 1px, transparent 1px),
            linear-gradient(90deg, var(--border_color) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse at 50% 30%, black 18%, transparent 72%);
          pointer-events: none;
          opacity: 0.7;
        }
        .hero-copy, .hero-visual { position: relative; z-index: 1; }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          color: var(--sub_text);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          margin-bottom: 22px;
        }
        .badge-pill {
          background: var(--primary);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 7px;
          border-radius: 999px;
        }
        .badge-arrow { color: var(--muted_text); }
        h1 {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          letter-spacing: -0.045em;
          line-height: 1.05;
          margin-bottom: 18px;
        }
        h1 em {
          font-style: normal;
          color: var(--primary);
        }
        .lede {
          font-size: 17px;
          line-height: 1.7;
          color: var(--sub_text);
          max-width: 540px;
          margin-bottom: 28px;
        }
        .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px; }
        .btn-primary, .btn-ghost {
          height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 650;
          font-family: inherit;
          cursor: pointer;
        }
        .btn-primary {
          border: none;
          background: var(--main_text);
          color: var(--page_background);
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-ghost {
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          color: var(--main_text);
        }
        .btn-ghost.light {
          background: transparent;
          color: #fff;
          border-color: rgba(255,255,255,0.28);
        }
        .command {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          max-width: 100%;
          padding: 8px 8px 8px 14px;
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          border-radius: 12px;
        }
        .prompt { color: var(--primary); font-family: var(--font-mono); }
        .command code, .hint code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--main_text);
        }
        .copy-btn {
          border: none;
          background: var(--surface_2);
          color: var(--sub_text);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 650;
          font-family: inherit;
          cursor: pointer;
        }
        .copied-mark { color: #16a34a; font-weight: 700; font-size: 12px; }
        .hint { margin-top: 10px; font-size: 13px; color: var(--muted_text); }
        .hint code {
          background: var(--surface_2);
          padding: 1px 6px;
          border-radius: 6px;
          font-size: 12px;
        }

        .window {
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow_lg);
        }
        .window-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--surface_2);
          border-bottom: 1px solid var(--border_color);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #febc2e; }
        .dot.green { background: #28c840; }
        .window-title {
          margin-left: 8px;
          font-size: 12px;
          color: var(--muted_text);
          font-family: var(--font-mono);
        }
        .window-body { padding: 0; background: var(--codeblock_bg, #18181b); }
        .window-body sw-codeblock {
          --codeblock-radius: 0;
          --codeblock-frame: transparent;
          --codeblock-shadow: none;
          margin: 0;
        }

        .band {
          max-width: 1120px;
          margin: 0 auto;
          padding: 24px 32px 72px;
        }
        .band-head { max-width: 640px; margin-bottom: 28px; }
        .kicker {
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .band-head h2, .cta h2 {
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: -0.035em;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .band-head p { color: var(--sub_text); line-height: 1.65; }

        .card-grid, .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .doc-card, .feature {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px;
          border: 1px solid var(--border_color);
          background: var(--surface_1);
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          min-height: 148px;
          transition: border-color 0.15s, transform 0.15s;
        }
        .doc-card:hover, .feature:hover {
          border-color: color-mix(in srgb, var(--primary) 45%, var(--border_color));
          transform: translateY(-2px);
        }
        .card-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--primary);
        }
        .doc-card strong, .feature strong {
          font-size: 16px;
          letter-spacing: -0.02em;
        }
        .doc-card span, .feature span { color: var(--sub_text); font-size: 14px; line-height: 1.55; }
        .feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary_light);
          color: var(--primary);
        }

        .cta-band { padding: 0 32px 80px; }
        .cta {
          max-width: 1120px;
          margin: 0 auto;
          padding: 48px 40px;
          border-radius: 24px;
          background: var(--main_text);
          color: var(--page_background);
        }
        .cta p { color: color-mix(in srgb, var(--page_background) 78%, transparent); max-width: 560px; margin-bottom: 22px; line-height: 1.6; }
        .cta .btn-primary {
          background: var(--page_background);
          color: var(--main_text);
        }

        @media (max-width: 960px) {
          .hero { grid-template-columns: 1fr; padding: 48px 20px 56px; gap: 32px; }
          .card-grid, .feature-grid { grid-template-columns: 1fr 1fr; }
          .band, .cta-band { padding-left: 20px; padding-right: 20px; }
        }
        @media (max-width: 640px) {
          .card-grid, .feature-grid { grid-template-columns: 1fr; }
          .command { width: 100%; }
          .command code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .cta { padding: 32px 22px; }
        }
      </style>
    `;
  }
}
