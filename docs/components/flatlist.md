## FlatList

**FlatList** is a performant list component inspired by React Native's FlatList. It provides efficient rendering of scrollable lists with built-in support for infinite scrolling, grid layouts, pull-to-refresh, and state-driven updates.

> **Key Concept:** FlatList extends `SwitchComponent` and uses **states** (re-rendering) and **refs** (DOM manipulation without re-render) for optimal performance.

### Basic Usage

Extend `FlatList` and override `renderItem()` to render each item. Initialize states in a `static {}` block using `createState()`, then use `static { this.useState('key'); }` to subscribe to changes for automatic re-rendering.

Click **Run** to open a fullscreen live preview. Use **View / Edit** there to tweak code and run again.

```javascript title:components/UserList.js preview:liveview
import { FlatList, createState, getState } from 'switch-framework';

export class UserList extends FlatList {
  static tag = 'sw-user-list';

  static {
    createState('sw-user-list-data', [
      { id: 1, name: 'Alice', role: 'Developer' },
      { id: 2, name: 'Bob', role: 'Designer' },
      { id: 3, name: 'Carol', role: 'Manager' }
    ]);
  }

  static { this.useState('sw-user-list-data'); }

  renderItem({ item, index }) {
    return `
      <div class="user-card" data-index="${index}">
        <div class="user-avatar">${item.name[0]}</div>
        <div class="user-info">
          <div class="user-name">${item.name}</div>
          <div class="user-role">${item.role}</div>
        </div>
        <div class="user-chip">View</div>
      </div>
    `;
  }

  keyExtractor(item, index) {
    return item.id?.toString() || `user-${index}`;
  }

  onMount() {
    super.onMount();
    this.listener('.user-card', 'click', (e) => {
      const card = e.target.closest('.user-card');
      const index = card?.dataset.index;
      const data = getState('sw-user-list-data');
      console.log('Clicked:', data[index]?.name);
    });
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; font-family: var(--font, system-ui); }
        .user-card {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          padding: 12px; border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 14px;
          cursor: pointer; background: rgba(255,255,255,0.7);
        }
        .user-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;
        }
        .user-name { font-weight: 800; color: #0f172a; }
        .user-role { font-size: 12px; color: #64748b; font-weight: 700; }
        .user-chip {
          padding: 8px 10px; border-radius: 999px; font-weight: 900; font-size: 12px;
          background: rgba(99,102,241,0.12); color: #4f46e5;
        }
      </style>
    `;
  }
}
```

### Grid Layout

Set `static numColumns = N` to create a grid. The layout automatically adjusts using flexbox with percentage-based widths.

```javascript title:components/PhotoGrid.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class PhotoGrid extends FlatList {
  static tag = 'sw-photo-grid';
  static numColumns = 3;

  static {
    createState('sw-photo-grid-data', [
      { id: 1, url: 'https://picsum.photos/200?1', title: 'Mountain' },
      { id: 2, url: 'https://picsum.photos/200?2', title: 'Ocean' },
      { id: 3, url: 'https://picsum.photos/200?3', title: 'Forest' },
      { id: 4, url: 'https://picsum.photos/200?4', title: 'City' },
      { id: 5, url: 'https://picsum.photos/200?5', title: 'Desert' },
      { id: 6, url: 'https://picsum.photos/200?6', title: 'Snow' }
    ]);
  }

  static { this.useState('sw-photo-grid-data'); }

  renderItem({ item, index }) {
    return `
      <div class="photo-card">
        <img src="${item.url}" alt="${item.title}" loading="lazy" />
        <div class="photo-overlay">
          <div class="photo-title">${item.title}</div>
          <div class="photo-badge">${index + 1}</div>
        </div>
      </div>
    `;
  }

  keyExtractor(item) {
    return `photo-${item.id}`;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; }
        .photo-card { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 1; }
        .photo-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .photo-overlay {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 10px;
          background: linear-gradient(transparent, rgba(0,0,0,0.65));
        }
        .photo-title { color: #fff; font-weight: 700; font-size: 13px; }
        .photo-badge {
          position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9);
          color: #111; font-weight: 800; font-size: 11px; padding: 4px 8px; border-radius: 999px;
        }
      </style>
    `;
  }
}
```

### Infinite Scrolling

Override `onEndReached()` to load more data when the user scrolls near the bottom. Use `static onEndReachedThreshold` to control when the callback fires (0.5 = 50% from bottom).

Scroll down in the preview to load more reels.

```javascript title:components/InfiniteFeed.js preview:liveview
import { FlatList, createState, updateState, getState } from 'switch-framework';

export class InfiniteFeed extends FlatList {
  static tag = 'sw-infinite-feed';
  static onEndReachedThreshold = 0.6;
  static { this.useState('sw-infinite-feed-data'); }
  static { this.useState('sw-infinite-feed-loading'); }
  static {
    createState('sw-infinite-feed-data', []);
    createState('sw-infinite-feed-page', 1);
    createState('sw-infinite-feed-loading', false);
    createState('sw-infinite-feed-has-more', true);
  }

  onMount() {
    super.onMount();
    if ((getState('sw-infinite-feed-data') ?? []).length === 0) this._loadMore();
  }

  async onEndReached() {
    const loading = getState('sw-infinite-feed-loading');
    const hasMore = getState('sw-infinite-feed-has-more');
    if (loading || !hasMore) return;
    await this._loadMore();
  }

  async _loadMore() {
    updateState('sw-infinite-feed-loading', true);
    try {
      const page = getState('sw-infinite-feed-page') ?? 1;
      const items = await this._fetchItems(page);
      const current = getState('sw-infinite-feed-data') ?? [];
      updateState('sw-infinite-feed-data', [...current, ...items]);
      updateState('sw-infinite-feed-page', page + 1);
      if (page >= 3) updateState('sw-infinite-feed-has-more', false);
    } finally {
      updateState('sw-infinite-feed-loading', false);
    }
  }

  async _fetchItems(page) {
    await new Promise((r) => setTimeout(r, 400));
    return Array.from({ length: 2 }, (_, i) => ({
      id: `${page}-${i}`,
      caption: `Reel ${page}.${i + 1}`,
      user: 'Demo',
      src: `https://picsum.photos/seed/${page}${i}/900/1200`,
    }));
  }

  renderItem({ item }) {
    return `
      <section class="reel">
        <img class="reel-media" src="${item.src}" alt="${item.caption}" loading="lazy" />
        <div class="reel-ui">
          <div class="reel-title">${item.caption}</div>
          <div class="reel-sub">${item.user}</div>
        </div>
      </section>
    `;
  }

  keyExtractor(item) { return item.id; }

  renderLoader() {
    return '<div class="reel-loader">Loading…</div>';
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; width: 100%; }
        .flat-list-container { height: min(480px, 70vh); overflow-y: auto; border-radius: 16px; background: #0b1220; }
        .reel { position: relative; height: min(480px, 70vh); scroll-snap-align: start; }
        .reel-media { width: 100%; height: 100%; object-fit: cover; }
        .reel-ui { position: absolute; left: 16px; bottom: 16px; color: white; font-family: system-ui; }
        .reel-title { font-weight: 800; font-size: 18px; }
        .reel-sub { font-size: 12px; opacity: 0.85; }
        .reel-loader { padding: 16px; text-align: center; color: rgba(255,255,255,0.7); }
      </style>
    `;
  }
}
```

### User Overridable Methods

- `renderItem({ item, index, separators })` - Render a single item. Required.
- `keyExtractor(item, index)` - Return unique key string for item.
- `renderLoader()` - Render bottom loading indicator.
- `renderEmpty()` - Render when data array is empty.
- `renderHeader()` - Render header component at top.
- `renderFooter()` - Render footer component at bottom.
- `renderSeparator()` - Render separator between items.
- `renderError()` - Render error state.
- `onEndReached()` - Called when scrolling near bottom.
- `onRefresh()` - Called for pull-to-refresh.
- `onScroll(event)` - Called on every scroll event.
- `getItemLayout(data, index)` - Return { length, offset, index } for optimization.

### Static Configuration

- `static numColumns = 1` - Number of columns for grid layout.
- `static horizontal = false` - Horizontal scrolling instead of vertical.
- `static onEndReachedThreshold = 0.5` - How close to bottom before triggering onEndReached (0-1).
- `static initialNumToRender = 10` - Initial items to render (for future virtualization).
- `static windowSize = 21` - Viewport window size for virtualization.

### Public API Methods

- `scrollToIndex({ index, animated, viewOffset })` - Scroll to specific item index.
- `scrollToEnd({ animated })` - Scroll to bottom/end of list.
- `scrollToOffset({ offset, animated })` - Scroll to specific offset position.
- `recordInteraction()` - Record interaction for highlighting.
- `flashScrollIndicators()` - Flash scrollbars briefly.

### Lifecycle

- `onMount()` - Call `super.onMount()` first, then add listeners via `this.listener()`.
- `onDestroy()` - Cleanup registered automatically. Use `this.addOnDestroy(fn)` for custom cleanup.
