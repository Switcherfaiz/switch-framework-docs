import { encodeData } from '/switch-framework/index.js';
import '../../../components/CodeBlock.js';

export const screen = {
  name: 'installation',
  path: '/docs/installation',
  title: 'Installation',
  tag: 'sw-installation-screen',
  layout: 'tabs'
};

export class SwInstallationScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const installCode = {
      title: 'bash',
      language: 'bash',
      code: `npm i switch-framework switch-framework-backend`
    };

    const createCode = {
      title: 'bash',
      language: 'bash',
      code: `npx create-switch-framework-app my-app`
    };

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="content">
        <h1 class="section-title">Installation</h1>
        <p class="section-desc">Install the core packages:</p>
        <sw-codeblock data="${encodeData(installCode)}"></sw-codeblock>
        <p class="section-desc">Or create a new app:</p>
        <sw-codeblock data="${encodeData(createCode)}"></sw-codeblock>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          color: #111827;
        }

        .content {
          padding: 32px 48px;
          max-width: 800px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 16px;
        }

        .section-desc {
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 16px;
        }

        code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 13px;
          color: #3713ec;
        }

        @media (max-width: 768px) {
          .content {
            padding: 24px 20px;
          }

          .section-title {
            font-size: 24px;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-installation-screen')) {
  customElements.define('sw-installation-screen', SwInstallationScreen);
}
