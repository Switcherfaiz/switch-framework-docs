## Animations

Animations in Switch Framework are built with standard CSS: `@keyframes`, `transition`, and `animation`. No special library needed. You control visibility and animation state by toggling classes or inline styles – and our **state functions** (`updateState`, `subscribeState`) make those values reactive.

### Screen transitions (opt-in)

Tabs and stacks **do not animate** when a screen is shown or hidden. Omit the fields, or set them to `'none'`, and the next screen just appears.

To opt in, set statics on the **leaf screen** (not the layout):

```javascript title:Optional screen enter / leave
export class PinScreen extends SwitchComponent {
  static screenName = 'pin/:id';
  static path = '/pin/:id';
  static title = 'Pin';
  static tag = 'my-pin-screen';
  static inAnimation = 'fade';
  static outAnimation = 'fade-bottom-out';
}
```

`static navigatingAnimation` is the fallback for both directions. A more specific `inAnimation` / `outAnimation` wins. `'none'` on any of the three disables that side.

```javascript title:Same preset both ways, or hard off
static navigatingAnimation = 'slide-left';
static navigatingAnimation = 'none';
```

**Built-in names:** `fade`, `fade-bottom`, `fade-bottom-out`, `fade-top`, `slide-left`, `slide-right`.

Any other token is a **class name** the router adds on the screen host. On enter it adds `sw-in`, `inAnimation`, and your token; on leave it adds `sw-out`, `outAnimation`, and the token. Style them in that screen’s `styleSheet()`:

```css title:Custom enter / leave on :host
:host.inAnimation {
  animation: myIn 0.28s ease both;
}
:host.outAnimation {
  animation: myOut 0.2s ease both;
}
:host.sw-in.wipe { animation: myWipeIn 0.3s ease both; }
:host.sw-out.wipe { animation: myWipeOut 0.2s ease both; }
```

```javascript title:Use the custom token
static inAnimation = 'wipe';
static outAnimation = 'wipe';
```

Keep-alive screens stay mounted, so a bare `:host { animation: ... }` only runs on first create. The `inAnimation` / `outAnimation` classes are what retrigger on later visits.

### Basic @keyframes

Define keyframe animations in your component's stylesheet. Use `animation` or `animation-name` to apply them.

```css title:CSS keyframes example
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal { animation: slideUp 0.25s ease; }
.overlay { animation: fadeIn 0.2s ease; }
```

### Transitions for simple state changes

Use `transition` for smooth property changes (opacity, transform, background). Toggle a class or style to trigger the transition.

```css title:Transition example
.panel {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel.active {
  opacity: 1;
  transform: scale(1);
}
```

### State-driven reactivity with useState

Use `updateState` and `useState` to control when animations run. Create a method that does fine-grained DOM manipulation (visibility, classes), then pass it to `useState`.

```javascript title:Modal – updateModalVisibility method + useState
updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });

// In your modal component – use useState, not subscribeState:
updateModalVisibility(state) {
  this.style.display = state?.open ? 'flex' : 'none';
  this.classList.toggle('active', !!state?.open);
}

connected() {
  const [, unsub] = useState('modal-edit-profile', this.updateModalVisibility.bind(this));
  this._unsub = unsub;
  this.updateModalVisibility(getState('modal-edit-profile') || {});
}
```

```javascript title:Full modal component example
import { SwitchComponent, useState, updateState, getState } from 'switch-framework';

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
    return `
      <div class="modal-overlay">
        <div class="modal">
          <h2>Edit Profile</h2>
          <span id="modal-name"></span>
          <button id="close">Close</button>
        </div>
      </div>
    `;
  }
}

// Trigger from anywhere:
// updateState('modal-edit-profile', { open: true, data: { name: 'Jane' } });
```

### Toasts & alerts from bottom

For toasts or alerts that slide up from the bottom, use a transparent overlay and the same `slideUp` keyframe. The overlay doesn't block clicks when transparent – or use `pointer-events: none` on the overlay and `pointer-events: auto` only on the toast container.

```css title:Toast – bottom slide-up
:host {
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
}
```

**Summary:** Use standard CSS for animations. Use state to control when they run – `updateState` to open/close, `useState` with a method that does DOM manipulation (visibility, classes) to react.
