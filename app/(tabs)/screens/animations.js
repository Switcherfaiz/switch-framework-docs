import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'animations',
  path: '/docs/animations',
  title: 'Animations',
  tag: 'sw-docs-animations-screen',
  layout: 'tabs'
};

export class SwDocsAnimationsScreen extends HTMLElement {
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
      <div class="doc-section">
        <h2 class="section-title">Animations</h2>
        <p class="section-desc">
          Animations in Switch Framework are built with standard CSS: <code>@keyframes</code>, <code>transition</code>, and <code>animation</code>. No special library needed. You control visibility and animation state by toggling classes or inline styles – and our <strong>state functions</strong> (<code>updateState</code>, <code>subscribeState</code>) make those values reactive.
        </p>
        
        <h3 class="subsection">Basic @keyframes</h3>
        <p class="section-desc">
          Define keyframe animations in your component's stylesheet. Use <code>animation</code> or <code>animation-name</code> to apply them.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'CSS keyframes example',
          language: 'css',
          code: \`@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal {
  animation: slideUp 0.25s ease;
}

.overlay {
  animation: fadeIn 0.2s ease;
}\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">Transitions for simple state changes</h3>
        <p class="section-desc">
          Use <code>transition</code> for smooth property changes (opacity, transform, background). Toggle a class or style to trigger the transition.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Transition example',
          language: 'css',
          code: \`.panel {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel.active {
  opacity: 1;
  transform: scale(1);
}\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">State-driven reactivity</h3>
        <p class="section-desc">
          Use <code>updateState</code> and <code>subscribeState</code> to control when animations run. A modal might subscribe to <code>modal-edit-profile</code> – when <code>open: true</code>, the component sets <code>display: flex</code> and applies an animation class. When <code>open: false</code>, it hides.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Modal – state controls visibility',
          language: 'javascript',
          code: \`// Open from any screen:
updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });

// In the modal component:
subscribeState('modal-edit-profile', () => this.render());
const state = getState('modal-edit-profile');
this.style.display = state?.open ? 'flex' : 'none';
// Apply .active class for animation
this.classList.toggle('active', !!state?.open);\`
        })}"></sw-codeblock>
        
        <h3 class="subsection">Toasts & alerts from bottom</h3>
        <p class="section-desc">
          For toasts or alerts that slide up from the bottom, use a transparent overlay and the same <code>slideUp</code> keyframe. The overlay doesn't block clicks when transparent – or use <code>pointer-events: none</code> on the overlay and <code>pointer-events: auto</code> only on the toast container.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Toast – bottom slide-up',
          language: 'css',
          code: \`:host {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: transparent;
}

.toast-container {
  padding: 14px 20px;
  background: var(--main_text);
  color: #fff;
  border-radius: 24px;
  animation: slideUp 0.3s ease;
}\`
        })}"></sw-codeblock>
        
        <p class="section-desc">
          <strong>Summary:</strong> Use standard CSS for animations. Use state to control when they run – <code>updateState</code> to open/close, <code>subscribeState</code> to react and toggle classes or styles.
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
          font-family: 'Montserrat', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .doc-section {
          padding: 32px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--main_text);
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .section-desc {
          font-size: 15px;
          line-height: 1.7;
          color: var(--sub_text);
          margin: 0 0 20px;
        }

        .subsection {
          font-size: 18px;
          font-weight: 700;
          color: var(--main_text);
          margin: 28px 0 12px;
        }

        code {
          background: var(--surface_2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', monospace;
          font-size: 13px;
          color: var(--main_text);
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-docs-animations-screen')) {
  customElements.define('sw-docs-animations-screen', SwDocsAnimationsScreen);
}
