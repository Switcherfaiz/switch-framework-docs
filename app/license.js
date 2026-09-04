import { SwitchComponent } from 'switch-framework';
import { SITE_PAGE_STYLES } from '/utils/doc-styles.js';

export class SwLicenseScreen extends SwitchComponent {
  static screenName = 'license';
  static path = '/license';
  static title = 'License';
  static tag = 'sw-license-screen';

  render() {
    return `
      <div class="site-wrap">
        <header class="site-header"><sw-topbar></sw-topbar></header>
        <main class="site-main">
          <div class="site-section">
            <p class="site-kicker">Legal</p>
            <h1 class="site-title">MIT License</h1>
            <p class="site-desc">Switch Framework is open source and MIT licensed. You are free to use, modify, and distribute it in your projects.</p>
            <pre class="license-text">MIT License

Copyright (c) 2026 Switch Framework

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
            <p class="site-desc">For the full source code and latest updates, visit our <a href="https://github.com/Switcherfaiz/switch-framework" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
          </div>
        </main>
        <sw-docs-footer></sw-docs-footer>
      </div>
    `;
  }

  styleSheet() {
    return `<style>${SITE_PAGE_STYLES}</style>`;
  }
}
