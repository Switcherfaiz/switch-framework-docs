## Modal

**Modal** is the Switch Framework overlay — same role as React Native's `Modal`. Nest the tag anywhere (navbar, screen, child). The framework lifts it into the app `.popups` layer so it always paints on top.

### React Native-style usage

```javascript
import { Modal, updateState, onState, useShared } from 'switch-framework';

export class SearchModal extends Modal {
  static tag = 'sw-search-modal';
  static visibleState = 'search-open';
  static animationType = 'fade';
  static presentationStyle = 'centered';

  onMount() {
    onState('search-open', (open) => {
      if (open) this.select('input')?.focus();
    });
    this.listener('#close', 'click', () => this.dismiss());
  }

  render() {
    const [query] = useShared('search-query', '');
    return `<div class="panel"><input value="${query}" /><button id="close" type="button">Close</button></div>`;
  }
}
```

Put the tag next to the control that opens it — no need to mount it yourself in `.popups`:

```html
<sw-docs-search-bar></sw-docs-search-bar>
<sw-docs-search></sw-docs-search>
```

Open / close:

```javascript
updateState('search-open', true);
updateState('search-open', false);
```

Or with a ref:

```javascript
const modalRef = useRef(this, 'modal');
modalRef.present();
modalRef.dismiss();
```

### Props (state key or literal)

```params-table
{"headers":["Prop","Example","Notes"],"htmlColumns":[0,1,2],"rows":[["<code>visible</code>","<code>'search-open'</code> or <code>true</code>","State key subscribes; literal is first paint only"],["<code>animationType</code>","<code>'fade'</code> | <code>'slide'</code> | <code>'none'</code>",""],["<code>presentationStyle</code>","<code>'overFullScreen'</code> | <code>'pageSheet'</code> | <code>'formSheet'</code> | <code>'centered'</code>",""],["<code>transparent</code>","<code>true</code>","Backdrop opacity"],["<code>interceptBack</code>","<code>true</code> (default) or <code>'search-trap-back'</code>","When open, Back / Escape dismisses the modal instead of navigating. Set <code>false</code> to let the router handle back."]]}
```

Static keys work the same way: `static visibleState = 'search-open'`.

Override **`onRequestClose()`** to change what Back / Escape / backdrop do (confirm, keep open, etc.). Default is `dismiss()`.

**Back button:** while the modal is open, browser Back and Android `backbutton` close it instead of leaving the page. That is **on by default**. Turn it off with `static interceptBack = false`, a `interceptBack` prop, or a state key (`static interceptBackState = 'search-trap-back'`).

Escape still dismisses whenever the modal is visible.

The app still has a `.popups` host (StackLayout `static render()`, or created automatically). You can leave that host empty.
