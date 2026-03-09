import { encodeData } from '/switch-framework/index.js';
import '../../../components/CodeBlock.js';

export const screen = {
  name: 'introduction',
  path: '/docs/introduction',
  title: 'Introduction',
  tag: 'sw-introduction-screen',
  layout: 'tabs'
};

export class SwIntroductionScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="content">
        <h1 class="section-title">Introduction</h1>
        <p class="section-desc">
          Switch Framework is a frontend framework designed to work together with <code>switch-framework-backend</code> to build:
        </p>
        <ul class="feature-list">
          <li>Web apps</li>
          <li>Electron desktop apps</li>
        </ul>
        <p class="section-desc">
          The goal is a runtime-first workflow where apps can run without a traditional build step (no bundler required for the basic setup), and the framework is served and executed at runtime.
        </p>
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

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 16px 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          font-size: 15px;
          color: #374151;
        }

        .feature-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #3713ec;
          font-weight: bold;
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

if (!customElements.get('sw-introduction-screen')) {
  customElements.define('sw-introduction-screen', SwIntroductionScreen);
}
