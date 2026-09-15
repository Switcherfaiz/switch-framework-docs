## ScrollView

**ScrollView** is the viewport for Switch Framework — closer to React Native's `ScrollView` than to a remounting list. It owns scrolling, load-more, empty/loader chrome, and **append-in-place** updates. Inner items are **not** forced into the scroll axis.

> [!NOTE]
> **Key idea:** `orientation` is only the scroll axis (`vertical` | `horizontal` | `both`). Use `layout` (`none` | `stack` | `row` | `grid` | `masonry`) — or your own CSS — for how children sit inside. Updating the **data** state does **not** rebuild the host. ScrollView watches that key, finds the newly added items, and inserts them with `insertAdjacentHTML('beforeend')`. FlatList does the same — it extends ScrollView.

**FlatList** extends ScrollView. Use FlatList when you want row wrappers, separators, and `horizontal` / `numColumns`. Use ScrollView when the inner layout should stay free (masonry, mixed blocks, custom HTML).

### How load-more updates work

You only append to the data state:

```javascript
updateState('home-pins', (items) => [...items, ...nextPage]);
```

ScrollView (and FlatList) already subscribed to that key in `onMount`. The callback:

1. Compares `keyExtractor` values already in the DOM with the new array
2. If the old items are still the prefix (typical load-more) → renders **only the new slice** and runs `content.insertAdjacentHTML('beforeend', html)`
3. If the list was replaced, filtered, or reordered → replaces the **content host** only (`innerHTML` on `.scroll-view-content`), not the scroller, header, or loader
4. Toggles empty / loader without a full `rerender()`

Do **not** also put `static { this.useState('home-pins') }` on the list host. That would remount the whole shadow tree and undo the append.

The same path runs for FlatList because it extends ScrollView — `renderItem`, separators, and row wrappers still apply; only the new rows are inserted.

### React Native-style usage

Boot two states, point the list at them, append on load-more:

```javascript
import { ScrollView, ensureState, updateState } from 'switch-framework';

ensureState('feed-data', []);
ensureState('feed-loading', false);

export class Feed extends ScrollView {
  static tag = 'sw-feed';
  static dataState = 'feed-data';
  static loadingState = 'feed-loading';
  static layout = 'stack';
  static virtualized = true;
  static initialNumToRender = 10;
  static windowSize = 10;

  renderItem({ item }) {
    return `<article class="row">${item.title}</article>`;
  }

  async onEndReached() {
    if (getState('feed-loading')) return;
    updateState('feed-loading', true);
    const page = await fetchNextPage();
    updateState('feed-data', (rows) => [...rows, ...page]);
    updateState('feed-loading', false);
  }
}
```

Parent usage is the same idea as RN props:

```javascript
createProps({
  data: 'feed-data',
  loading: 'feed-loading',
  virtualized: true,
  initialNumToRender: 12
})
```

### Virtualized rendering (`virtualized`)

When `virtualized: true` (state key or literal):

- Only items near the viewport (+ `windowSize` buffer) get DOM nodes
- `removeClippedSubviews: true` hides far-off rows for paint cost
- `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `estimatedItemSize` match RN names
- Override `getItemLayout(data, index)` for fixed row heights (best performance)

FlatList inherits all of this.

### Props: state keys or plain values

Every recognised field can come from:

1. **`static` keys you name** — `static dataState = 'home-pins'`
2. **`createProps`** — the same field name, either a state key or a literal
3. **Default** — `${tag}-data`, `${tag}-loading`, … when you do not set a static key

```javascript
// Literal — first paint only. Changing this string later does not subscribe or patch.
createProps({ orientation: 'vertical' })

// State key — ScrollView watches `feed-axis` and remounts the shell when it changes.
createProps({ orientation: 'feed-axis' })

// Data key — patches with onState (append / reset). No full list remount.
createProps({ data: 'home-pins', loading: 'home-loading' })

// Data snapshot — array in props. No live subscription. Add more with ref.append / appendItems.
createProps({ data: [{ id: 1, title: 'One' }] })
```

You do not choose `onState` vs remount. ScrollView does:

```params-table
{"headers":["Field","How it updates"],"htmlColumns":[0,1],"rows":[["<code>data</code>","Patch — replace on reset, <code>insertAdjacentHTML('beforeend')</code> on load-more"],["<code>loading</code> / <code>error</code> / <code>refreshing</code>","Patch — toggle empty / loader / error"],["<code>orientation</code> / <code>layout</code> / <code>numColumns</code>","Full shell rerender, then refs rebind in <code>onUpdate</code>"]]}
```

Plain values never subscribe. If you pass `orientation: 'horizontal'`, that is a snapshot.

### Static keys you can set

```javascript
export class PinFeed extends ScrollView {
  static tag = 'sw-pin-feed';
  static dataState = 'home-pins';
  static loadingState = 'home-loading';
  static errorState = 'home-error';
  static orientationState = 'home-axis';
  static layoutState = 'home-layout';
  static numColumnsState = 'home-columns';
}
```

Then either leave props empty (the static keys are used) or pass the same keys through `createProps`.

### Masonry feed with photos

Vertical scroller, masonry layout. Scroll to the bottom to load more — only the new cards are inserted.

```javascript title:components/PinFeed.js preview:liveview
import { ScrollView, ensureState, updateState, getState } from 'switch-framework';

const PINS = [
  { id: 1, title: 'Clay studio', author: 'Mina', img: 'https://picsum.photos/id/1011/480/640' },
  { id: 2, title: 'Trail breakfast', author: 'Noah', img: 'https://picsum.photos/id/292/480/360' },
  { id: 3, title: 'Blue doorway', author: 'Aya', img: 'https://picsum.photos/id/1015/480/720' },
  { id: 4, title: 'Night market', author: 'Leo', img: 'https://picsum.photos/id/1016/480/520' },
  { id: 5, title: 'Reading nook', author: 'Sofi', img: 'https://picsum.photos/id/1018/480/400' },
  { id: 6, title: 'Coast road', author: 'Ken', img: 'https://picsum.photos/id/1019/480/640' }
];

export class PinFeed extends ScrollView {
  static tag = 'sw-docs-pin-feed';
  static dataState = 'sw-docs-pin-feed-data';
  static loadingState = 'sw-docs-pin-feed-loading';
  static orientation = 'vertical';
  static layout = 'masonry';
  static numColumns = 2;
  static onEndReachedThreshold = 0.35;

  static {
    ensureState('sw-docs-pin-feed-data', PINS.slice(0, 4));
    ensureState('sw-docs-pin-feed-loading', false);
    ensureState('sw-docs-pin-feed-page', 1);
  }

  renderItem({ item }) {
    return `
      <article class="pin">
        <img src="${item.img}" alt="${item.title}" />
        <div class="pin-meta">
          <strong>${item.title}</strong>
          <span>${item.author}</span>
        </div>
      </article>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  renderEmpty() {
    return `<div class="empty">No pins yet</div>`;
  }

  async onEndReached() {
    if (getState('sw-docs-pin-feed-loading')) return;
    const page = getState('sw-docs-pin-feed-page') || 1;
    if (page >= 2) return;
    updateState('sw-docs-pin-feed-loading', true);
    await new Promise((r) => setTimeout(r, 350));
    updateState('sw-docs-pin-feed-data', (items) => [...(items || []), ...PINS.slice(4)]);
    updateState('sw-docs-pin-feed-page', page + 1);
    updateState('sw-docs-pin-feed-loading', false);
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          height: 420px;
          font-family: var(--font, 'DM Sans', system-ui);
          color: #111;
        }
        scrollview {
          height: 100%;
          padding: 10px;
          border-radius: 18px;
          background: #f6f6f8;
        }
        .pin {
          margin: 0 0 14px;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
        }
        .pin img {
          display: block;
          width: 100%;
          height: auto;
        }
        .pin-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 12px 12px;
        }
        .pin-meta strong { font-size: 13px; letter-spacing: -0.02em; }
        .pin-meta span { font-size: 12px; color: #6b7280; font-weight: 500; }
        .empty { text-align: center; color: #6b7280; padding: 48px 0; }
      </style>
    `;
  }
}
```

### Product grid with images

Same append protocol, `layout: 'grid'`. Existing cards stay mounted when the next page is pushed onto the data state.

```javascript title:components/ProductGrid.js preview:liveview
import { ScrollView, ensureState } from 'switch-framework';

export class ProductGrid extends ScrollView {
  static tag = 'sw-docs-product-grid';
  static dataState = 'sw-docs-product-grid-data';
  static orientation = 'vertical';
  static layout = 'grid';
  static numColumns = 2;

  static {
    ensureState('sw-docs-product-grid-data', [
      { id: 1, name: 'Walnut stool', price: '$89', img: 'https://picsum.photos/id/1060/600/600' },
      { id: 2, name: 'Linen throw', price: '$42', img: 'https://picsum.photos/id/1067/600/600' },
      { id: 3, name: 'Ceramic lamp', price: '$64', img: 'https://picsum.photos/id/1071/600/600' },
      { id: 4, name: 'Oak tray', price: '$36', img: 'https://picsum.photos/id/1080/600/600' }
    ]);
  }

  renderItem({ item }) {
    return `
      <article class="product">
        <img src="${item.img}" alt="${item.name}" />
        <div class="product-body">
          <h3>${item.name}</h3>
          <p>${item.price}</p>
        </div>
      </article>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          height: 400px;
          font-family: var(--font, 'DM Sans', system-ui);
        }
        scrollview {
          height: 100%;
          padding: 12px;
          border-radius: 18px;
          background: #fafafa;
        }
        .scroll-view-content.layout-grid { gap: 12px; }
        .product {
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #ececec;
          box-shadow: 0 8px 20px rgba(17, 17, 17, 0.05);
        }
        .product img {
          display: block;
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        .product-body { padding: 12px 12px 14px; }
        .product-body h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 750;
          letter-spacing: -0.02em;
        }
        .product-body p {
          margin: 4px 0 0;
          font-size: 13px;
          font-weight: 650;
          color: #e60023;
        }
      </style>
    `;
  }
}
```

Existing cards stay in the DOM when you later `updateState` with extra products.

### Passing props from a parent

```javascript title:Parent
import { SwitchComponent, createProps, createState } from 'switch-framework';
import './PinFeed.js';

createState('home-pins', []);
createState('home-loading', false);
createState('home-axis', 'vertical');

export class HomeScreen extends SwitchComponent {
  static tag = 'sw-home-with-feed';

  render() {
    const props = createProps({
      data: 'home-pins',
      loading: 'home-loading',
      orientation: 'home-axis',
      layout: 'masonry',
      numColumns: 3
    });
    return `<sw-pin-feed data="${props}"></sw-pin-feed>`;
  }
}
```

`layout: 'masonry'` and `numColumns: 3` are literals (no subscribe). `orientation: 'home-axis'` is a state key, so `updateState('home-axis', 'horizontal')` rebuilds the shell.

### Empty and loader

Override `renderEmpty()` and `renderLoader()` the same way as FlatList. ScrollView toggles them when `loading` / `data` change — it does not remount the scroller.

### Refs

`useRef(this)` in `onMount()` (or `static { this.useRef('listRef') }`) exposes:

```params-table
{"headers":["Method","Use"],"htmlColumns":[0,1],"rows":[["<code>scrollTo({ x, y, animated })</code>","Pixel scroll, like React Native"],["<code>scrollToEnd({ animated })</code>","Jump to the end of the active axis"],["<code>scrollToOffset({ offset, animated })</code>","Offset on the active axis"],["<code>scrollToIndex({ index, animated })</code>","Scroll an item into view"],["<code>scrollBy({ x, y, animated })</code>","Relative scroll"],["<code>append(html)</code>","<code>insertAdjacentHTML('beforeend')</code> raw HTML"],["<code>appendItems(items)</code>","Render items with <code>renderItem</code> and append"],["<code>reset(items)</code>","Replace the content host"],["<code>flashScrollIndicators()</code>","Brief scrollbar flash"]]}
```

```javascript title:components/InboxFeed.js preview:liveview
import { ScrollView, ensureState, useRef, updateState } from 'switch-framework';

export class InboxFeed extends ScrollView {
  static tag = 'sw-docs-scroll-tools';
  static dataState = 'sw-docs-scroll-tools-data';
  static orientation = 'vertical';
  static layout = 'stack';

  static {
    ensureState('sw-docs-scroll-tools-data', [
      { id: 1, name: 'Amina K.', preview: 'The moodboard is in the shared folder', time: '2m', img: 'https://i.pravatar.cc/80?img=32' },
      { id: 2, name: 'Jonas R.', preview: 'Can we ship the grid tonight?', time: '18m', img: 'https://i.pravatar.cc/80?img=12' },
      { id: 3, name: 'Priya S.', preview: 'Loved the new pin cards', time: '1h', img: 'https://i.pravatar.cc/80?img=48' }
    ]);
  }

  renderHeader() {
    return `
      <div class="tools">
        <button type="button" id="to-end">Jump to latest</button>
        <button type="button" id="add" class="ghost">New message</button>
      </div>
    `;
  }

  renderItem({ item }) {
    return `
      <article class="thread">
        <img class="avatar" src="${item.img}" alt="" />
        <div class="thread-body">
          <div class="thread-top">
            <strong>${item.name}</strong>
            <time>${item.time}</time>
          </div>
          <p>${item.preview}</p>
        </div>
      </article>
    `;
  }

  onMount() {
    super.onMount();
    const ref = useRef(this);
    this.listener('#to-end', 'click', () => ref.scrollToEnd({ animated: true }));
    this.listener('#add', 'click', () => {
      const id = Date.now();
      updateState('sw-docs-scroll-tools-data', (rows) => [...(rows || []), {
        id,
        name: 'You',
        preview: 'Saved a new collection',
        time: 'now',
        img: 'https://i.pravatar.cc/80?img=5'
      }]);
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          height: 360px;
          font-family: var(--font, 'DM Sans', system-ui);
        }
        .tools {
          display: flex;
          gap: 8px;
          padding: 0 0 10px;
        }
        button {
          border: 0;
          border-radius: 999px;
          padding: 8px 14px;
          background: #111;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        button.ghost {
          background: #f3f4f6;
          color: #111;
        }
        scrollview {
          height: calc(100% - 44px);
          border-radius: 16px;
          background: #fff;
          border: 1px solid #ececec;
        }
        .thread {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .thread-body { min-width: 0; flex: 1; }
        .thread-top {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 2px;
        }
        .thread-top strong { font-size: 14px; }
        .thread-top time { font-size: 12px; color: #9ca3af; font-weight: 600; }
        .thread p {
          margin: 0;
          font-size: 13px;
          color: #4b5563;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
    `;
  }
}
```

Call `super.onMount()` in subclasses so the scroller, state watches, and refs attach.

### Styling

The **`scrollview`** keyword is a scope alias (same idea as `flatlist`). It rewrites to the port class.

```params-table
{"headers":["Target","Selector"],"htmlColumns":[1],"rows":[["Host","<code>:host { }</code>"],["Scroll port","<code>scrollview { }</code>"],["Content","<code>scrollview .scroll-view-content</code>"],["Item wrapper","<code>scrollview .scroll-view-item</code>"]]}
```

Give `:host` (or `scrollview`) a bounded height so overflow can scroll.

### ScrollView vs FlatList

```params-table
{"headers":["","ScrollView","FlatList"],"htmlColumns":[0,1,2],"rows":[["Job","Viewport + append protocol","List of rows on top of ScrollView"],["Axis","<code>orientation</code>","<code>horizontal</code> or <code>orientation</code>"],["Inner layout","<code>layout</code> or your CSS","stack / row / grid from <code>horizontal</code> + <code>numColumns</code>"],["Items","Optional <code>renderItem</code>, or <code>append(html)</code>","<code>renderItem</code> + separators"],["Data updates","Patch (append / reset)","Same — no full remount"]]}
```
