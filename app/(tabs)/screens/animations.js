import { SwitchComponent, encodeData } from '/switch-framework/index.js';

export class SwDocsAnimationsScreen extends SwitchComponent {
  static screenName = 'docs/animations';
  static path = '/docs/animations';
  static title = 'Animations';
  static tag = 'sw-docs-animations-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Animations</h2>
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
          code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal { animation: slideUp 0.25s ease; }
.overlay { animation: fadeIn 0.2s ease; }`
        })}"></sw-codeblock>
        <h3 class="subsection" id="transitions">Transitions for simple state changes</h3>
        <p class="section-desc">
          Use <code>transition</code> for smooth property changes (opacity, transform, background). Toggle a class or style to trigger the transition.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Transition example',
          language: 'css',
          code: `.panel {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel.active {
  opacity: 1;
  transform: scale(1);
}`
        })}"></sw-codeblock>
        <h3 class="subsection">State-driven reactivity with useState</h3>
        <p class="section-desc">
          Use <code>updateState</code> and <code>useState</code> to control when animations run. Create a method that does fine-grained DOM manipulation (visibility, classes), then pass it to <code>useState</code>.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Modal – updateModalVisibility method + useState',
          language: 'javascript',
          code: `updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });

// In your modal component – use useState, not subscribeState:
updateModalVisibility(state) {
  this.style.display = state?.open ? 'flex' : 'none';
  this.classList.toggle('active', !!state?.open);
}

connected() {
  const [, unsub] = useState('modal-edit-profile', this.updateModalVisibility.bind(this));
  this._unsub = unsub;
  this.updateModalVisibility(getState('modal-edit-profile') || {});
}` 
        })}"></sw-codeblock>
        <sw-codeblock data="${encodeData({
          title: 'Full modal component example',
          language: 'javascript',
          code: `import { SwitchComponent, useState, updateState, getState } from '/switch-framework/index.js';

export class EditProfileModal extends SwitchComponent {
  static tag = 'sw-edit-profile-modal';

  updateModalVisibility(state) {
    this.style.display = state?.open ? 'flex' : 'none';
    this.classList.toggle('active', !!state?.open);
    const nameEl = this.shadowRoot?.querySelector('#modal-name');
    if (nameEl) nameEl.textContent = state?.data?.name || '';
  }

  connected() {
    const [, unsub] = useState('modal-edit-profile', this.updateModalVisibility.bind(this));
    this._unsub = unsub;
    this.updateModalVisibility(getState('modal-edit-profile') || {});
    this.shadowRoot.querySelector('#close')?.addEventListener('click', () => {
      updateState('modal-edit-profile', { open: false });
    });
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  render() {
    return \`
      <div class="modal-overlay">
        <div class="modal">
          <h2>Edit Profile</h2>
          <span id="modal-name"></span>
          <button id="close">Close</button>
        </div>
      </div>
    \`;
  }
}

// Trigger from anywhere:
// updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });`
        })}"></sw-codeblock>
        <h3 class="subsection" id="toasts">Toasts & alerts from bottom</h3>
        <p class="section-desc">
          For toasts or alerts that slide up from the bottom, use a transparent overlay and the same <code>slideUp</code> keyframe. The overlay doesn't block clicks when transparent – or use <code>pointer-events: none</code> on the overlay and <code>pointer-events: auto</code> only on the toast container.
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Toast – bottom slide-up',
          language: 'css',
          code: `:host {
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
}`
        })}"></sw-codeblock>
        <p class="section-desc">
          <strong>Summary:</strong> Use standard CSS for animations. Use state to control when they run – <code>updateState</code> to open/close, <code>useState</code> with a method that does DOM manipulation (visibility, classes) to react.
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
        code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
      </style>
    `;
  }
}
