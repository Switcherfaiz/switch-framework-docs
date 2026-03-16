import { SwitchComponent } from '/switch-framework/index.js';
import { navigate } from '/switch-framework/router/index.js';

export class SwLicenseScreen extends SwitchComponent {
  static screenName = 'license';
  static path = '/license';
  static title = 'License';
  static tag = 'sw-license-screen';
  static layout = 'stack';

  connected() {
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target?.closest?.('a[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) navigate(route);
    });
  }

  render() {
    return `
      <div class="license-wrap">
        <header class="license-header">
          <sw-topbar></sw-topbar>
        </header>
        <main class="license-main">
          <div class="doc-section">
            <h2 class="section-title" id="overview">MIT License</h2>
            <p class="section-desc">
              Switch Framework is open source and MIT licensed. You are free to use, modify, and distribute it in your projects.
            </p>
            <pre class="license-text">MIT License

Copyright (c) 2024 Switch Framework

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
            <p class="section-desc">
              For the full source code and latest updates, visit our <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
            </p>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; min-height: 100vh; font-family: 'Montserrat', sans-serif; }
        * { box-sizing: border-box; }
        .license-wrap { display: flex; flex-direction: column; min-height: 100vh; }
        .license-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
        .license-main { flex: 1; overflow-y: auto; padding: 32px 24px; }
        .doc-section { max-width: 900px; margin: 0 auto; }
        .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
        .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
        .license-text { font-family: 'Monaco', 'Consolas', monospace; font-size: 13px; line-height: 1.6; color: var(--sub_text); background: var(--surface_2); padding: 24px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; }
        .section-desc a { color: var(--primary); text-decoration: none; }
        .section-desc a:hover { text-decoration: underline; }
      </style>
    `;
  }
}
