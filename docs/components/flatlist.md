## FlatList

**FlatList** is a performant list component inspired by React Native's FlatList. It provides efficient rendering of scrollable lists with built-in support for infinite scrolling, grid layouts, pull-to-refresh, and state-driven updates.

> **Key Concept:** FlatList extends `SwitchComponent` and uses **states** (re-rendering) and **refs** (DOM manipulation without re-render) for optimal performance.

### Basic Usage

Extend `FlatList` and override `renderItem()` to render each item. Initialize states in a `static {}` block with `createState()`, register re-renders with `static { this.useState('key'); }`, and point FlatList at your data/config keys:

```javascript
static {
  createState('sw-user-list-data', [...]);
  createState('sw-user-list-horizontal', false);
}
static { this.useState('sw-user-list-data'); }
static { this.useState('sw-user-list-horizontal'); }

static dataState = 'sw-user-list-data';
static horizontalState = 'sw-user-list-horizontal';
// FlatList reads getState(dataState) / getState(horizontalState) on every render
```

When `updateState('sw-user-list-data', …)` or `updateState('sw-user-list-horizontal', …)` runs anywhere in the app, the list re-renders with fresh values. You can also drive updates with `useEffect` and a dependency array (see below).

Click **Run** to open a fullscreen live preview. Use **View / Edit** there to tweak code and run again.

```javascript title:components/UserList.js preview:liveview
import { FlatList, createState, getState } from 'switch-framework';

export class UserList extends FlatList {
  static tag = 'sw-user-list';
  static dataState = 'sw-user-list-data';

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
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-family: var(--font, system-ui);
        }

        flatlist {
          width: min(100%, 480px);
          max-height: min(420px, 70vh);
        }
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

### Styling FlatList

FlatList renders inside shadow DOM. Style it from your extended component’s `styleSheet()` using these patterns:

```params-table
{"headers":["Target","Selector","Use for"],"htmlColumns":[1],"rows":[["Host element","<code>:host { }</code>","Size, fonts, CSS variables that inherit into the list"],["Global CSS","<code>my-list-tag { }</code>","Host styles from an external stylesheet"],["Scroll area &amp; internals","<code>flatlist { }</code> or <code>flatlist::-webkit-scrollbar</code>","Scrollbar, overflow, inner layout"]]}
```

The **`flatlist`** keyword is a scope alias — the framework rewrites it to `.flatlist` (the scroll container class). You do not call `super.styleSheet()`; base FlatList styles merge automatically.

**Common inner classes** (use with `flatlist` or directly in `styleSheet()`):

- `flatlist` — scroll container
- `flatlist .flat-list-content` — item wrapper (grid `gap` lives here)
- `flatlist .flat-list-item-wrapper` — each row/cell wrapper
- `flatlist .flat-list-separator` — default separator line

Give the list a bounded height on `:host` (or `flatlist`) so scrolling is visible in previews and nested layouts.

#### Custom scrollbar

```javascript title:components/StyledScrollList.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class StyledScrollList extends FlatList {
  static tag = 'sw-styled-scroll-list';
  static dataState = 'sw-styled-scroll-list-data';

  static {
    createState('sw-styled-scroll-list-data', [
      { id: 1, label: 'Design tokens', tone: '#6366f1' },
      { id: 2, label: 'Router guards', tone: '#0ea5e9' },
      { id: 3, label: 'Tab layouts', tone: '#14b8a6' },
      { id: 4, label: 'State hooks', tone: '#f59e0b' },
      { id: 5, label: 'FlatList styling', tone: '#ec4899' },
      { id: 6, label: 'Electron shell', tone: '#8b5cf6' },
      { id: 7, label: 'Theme helpers', tone: '#22c55e' },
      { id: 8, label: 'Live previews', tone: '#ef4444' }
    ]);
  }

  static { this.useState('sw-styled-scroll-list-data'); }

  renderItem({ item }) {
    return `
      <article class="topic-row">
        <span class="topic-dot" style="background:${item.tone}"></span>
        <span class="topic-label">${item.label}</span>
        <span class="topic-arrow">→</span>
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
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: min(320px, 52vh);
          --scroll-thumb: #6366f1;
          --scroll-track: rgba(99, 102, 241, 0.08);
          scrollbar-width: thin;
          scrollbar-color: var(--scroll-thumb) var(--scroll-track);
        }

        flatlist {
          width: min(100%, 420px);
          height: 100%;
          max-height: 100%;
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.18);
          background: linear-gradient(180deg, rgba(99,102,241,0.06), rgba(255,255,255,0.9));
        }

        flatlist::-webkit-scrollbar {
          width: 8px;
        }

        flatlist::-webkit-scrollbar-track {
          background: var(--scroll-track);
          border-radius: 999px;
        }

        flatlist::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #818cf8, var(--scroll-thumb));
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .topic-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin: 0 10px 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.25);
          font-family: system-ui, sans-serif;
        }

        .topic-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .topic-label {
          flex: 1;
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
        }

        .topic-arrow {
          color: #94a3b8;
          font-weight: 800;
        }
      </style>
    `;
  }
}
```

#### Horizontal orientation

Set `static horizontal = true` for a row-based list. Style item width and snap on the scroll container.

```javascript title:components/HorizontalChipList.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class HorizontalChipList extends FlatList {
  static tag = 'sw-horizontal-chip-list';
  static horizontal = true;
  static dataState = 'sw-horizontal-chip-list-data';

  static {
    createState('sw-horizontal-chip-list-data', [
      { id: 'all', label: 'All', active: true },
      { id: 'ui', label: 'UI' },
      { id: 'router', label: 'Router' },
      { id: 'state', label: 'State' },
      { id: 'lists', label: 'Lists' },
      { id: 'themes', label: 'Themes' },
      { id: 'electron', label: 'Electron' },
      { id: 'backend', label: 'Backend' }
    ]);
  }

  static { this.useState('sw-horizontal-chip-list-data'); }

  renderItem({ item }) {
    return `
      <button type="button" class="chip ${item.active ? 'active' : ''}" data-id="${item.id}">
        ${item.label}
      </button>
    `;
  }

  keyExtractor(item) {
    return item.id;
  }

  renderSeparator() {
    return '';
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        flatlist {
          width: min(100%, 560px);
          max-height: 72px;
          padding: 12px 4px;
          scroll-snap-type: x proximity;
        }

        flatlist .flat-list-content {
          gap: 10px;
          padding: 0 8px 6px;
        }

        .chip {
          flex: 0 0 auto;
          scroll-snap-align: start;
          border: 1px solid rgba(148, 163, 184, 0.45);
          background: #fff;
          color: #334155;
          font-weight: 800;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
        }

        .chip.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent;
          color: #fff;
        }

        flatlist::-webkit-scrollbar {
          height: 6px;
        }

        flatlist::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.45);
          border-radius: 999px;
        }
      </style>
    `;
  }
}
```

#### State-driven layout (useState + state keys)

Toggle orientation from global state. Register the state with `this.useState`, set `static horizontalState` to the key, and FlatList resolves `getState(horizontalState)` on each render.

```javascript title:components/ToggleLayoutList.js preview:liveview
import { FlatList, createState, updateState, getState } from 'switch-framework';

export class ToggleLayoutList extends FlatList {
  static tag = 'sw-toggle-layout-list';
  static dataState = 'sw-toggle-layout-data';
  static horizontalState = 'sw-toggle-layout-horizontal';

  static {
    createState('sw-toggle-layout-horizontal', false);
    createState('sw-toggle-layout-data', [
      { id: 1, label: 'Router' },
      { id: 2, label: 'Tabs' },
      { id: 3, label: 'State' },
      { id: 4, label: 'FlatList' },
      { id: 5, label: 'Themes' },
      { id: 6, label: 'Electron' }
    ]);
  }

  static { this.useState('sw-toggle-layout-data'); }
  static { this.useState('sw-toggle-layout-horizontal'); }

  renderHeader() {
    const horizontal = getState('sw-toggle-layout-horizontal');
    return `
      <div class="toggle-bar">
        <span class="toggle-label">${horizontal ? 'Horizontal' : 'Vertical'} mode</span>
        <button type="button" class="toggle-btn" data-action="flip">
          Flip layout
        </button>
      </div>
    `;
  }

  renderItem({ item }) {
    return `<div class="layout-item">${item.label}</div>`;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  onMount() {
    super.onMount();
    this.listener('[data-action="flip"]', 'click', () => {
      updateState('sw-toggle-layout-horizontal', (v) => !v);
    });
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-family: system-ui, sans-serif;
        }

        flatlist {
          width: min(100%, 420px);
          max-height: min(280px, 50vh);
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
        }

        .toggle-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px 8px;
        }

        .toggle-label {
          font-size: 12px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .toggle-btn {
          border: none;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .layout-item {
          margin: 0 10px 8px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          font-weight: 700;
          color: #0f172a;
        }

        flatlist .flat-list-content { gap: 0; }
      </style>
    `;
  }
}
```

#### State-driven layout (useEffect)

Same pattern, but subscribe in `onMount` with `this.useEffect(callback, [stateKeys])` instead of `static { this.useState(...) }`. When a dep state changes, the component re-renders automatically — use the callback only for side effects, not `this.rerender()`.

```javascript title:components/EffectLayoutList.js preview:liveview
import { FlatList, createState, updateState, getState } from 'switch-framework';

export class EffectLayoutList extends FlatList {
  static tag = 'sw-effect-layout-list';
  static dataState = 'sw-effect-layout-data';
  static horizontalState = 'sw-effect-layout-horizontal';

  static {
    createState('sw-effect-layout-horizontal', false);
    createState('sw-effect-layout-data', [
      { id: 1, label: 'Alpha' },
      { id: 2, label: 'Beta' },
      { id: 3, label: 'Gamma' },
      { id: 4, label: 'Delta' }
    ]);
  }

  renderHeader() {
    const horizontal = getState('sw-effect-layout-horizontal');
    return `
      <div class="effect-bar">
        <span>${horizontal ? 'Row' : 'Column'} layout (useEffect)</span>
        <button type="button" class="effect-btn" data-action="flip">Toggle</button>
      </div>
    `;
  }

  renderItem({ item }) {
    return `<div class="effect-item">${item.label}</div>`;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  onMount() {
    super.onMount();

    this.useEffect(null, ['sw-effect-layout-data', 'sw-effect-layout-horizontal']);

    this.listener('[data-action="flip"]', 'click', () => {
      updateState('sw-effect-layout-horizontal', (v) => !v);
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-family: system-ui, sans-serif;
        }

        flatlist {
          width: min(100%, 380px);
          max-height: min(260px, 48vh);
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #fff;
        }

        .effect-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 14px 8px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .effect-btn {
          border: none;
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          color: #fff;
          background: #0ea5e9;
        }

        .effect-item {
          margin: 0 10px 8px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #f1f5f9;
          font-weight: 700;
          color: #0f172a;
        }
      </style>
    `;
  }
}
```

#### Image carousel (horizontal snap)

Full-bleed photo slides with scroll snap. Center the host; constrain scroll area with `flatlist` width and max-height.

```javascript title:components/ImageCarousel.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class ImageCarousel extends FlatList {
  static tag = 'sw-image-carousel';
  static horizontal = true;
  static horizontalItemWidth = '100%';
  static dataState = 'sw-image-carousel-data';
  static showsHorizontalScrollIndicator = false;

  static {
    createState('sw-image-carousel-data', [
      { id: 1, title: 'Mountain lake', src: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=900' },
      { id: 2, title: 'City lights', src: 'https://images.pexels.com/photos/313690/pexels-photo-313690.jpeg?auto=compress&cs=tinysrgb&w=900' },
      { id: 3, title: 'Forest trail', src: 'https://images.pexels.com/photos/349097/pexels-photo-349097.jpeg?auto=compress&cs=tinysrgb&w=900' },
      { id: 4, title: 'Ocean sunset', src: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=900' },
      { id: 5, title: 'Desert dunes', src: 'https://images.pexels.com/photos/266659/pexels-photo-266659.jpeg?auto=compress&cs=tinysrgb&w=900' }
    ]);
  }

  static { this.useState('sw-image-carousel-data'); }
  static { this.useRef('flatlistRef'); }

  renderItem({ item }) {
    return `
      <figure class="slide">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <figcaption>${item.title}</figcaption>
      </figure>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  renderSeparator() {
    return '';
  }

  renderFooter() {
    return `
      <button type="button" class="carousel-nav prev" aria-label="Previous slide">
        <span class="switch_icon_chevron_left"></span>
      </button>
      <button type="button" class="carousel-nav next" aria-label="Next slide">
        <span class="switch_icon_chevron_right"></span>
      </button>
    `;
  }

  onMount() {
    super.onMount();
    const ref = this.constructor.flatlistRef;
    this.listener('.carousel-nav.prev', 'click', () => {
      ref.scrollBy({ x: -(this._containerRef?.clientWidth ?? 320), animated: true });
    });
    this.listener('.carousel-nav.next', 'click', () => {
      ref.scrollBy({ x: this._containerRef?.clientWidth ?? 320, animated: true });
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative;
          padding: 8px 0;
        }

        .flat-list-wrapper {
          position: relative;
          width: min(100%, 520px);
          margin: 0 auto;
        }

        flatlist.flat-list-container.horizontal {
          width: 100%;
          height: min(320px, 48vh);
          border-radius: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
        }

        flatlist .flat-list-item-wrapper {
          height: 100%;
        }

        flatlist .flat-list-content {
          gap: 0;
          height: 100%;
        }

        .slide {
          width: 100%;
          height: 100%;
          margin: 0;
          position: relative;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .slide figcaption {
          position: absolute;
          left: 16px;
          bottom: 14px;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
          font-family: system-ui, sans-serif;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #fff;
          background: rgba(15, 23, 42, 0.55);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }

        .carousel-nav.prev { left: 12px; }
        .carousel-nav.next { right: 12px; }

        .carousel-nav span {
          font-size: 16px;
          line-height: 1;
        }
      </style>
    `;
  }
}
```

#### Album row carousel (Spotify-style)

Horizontal album cards with left/right nav buttons using **switch icons**. Pexels cover art, dark theme, edge fade.

```javascript title:components/AlbumCarousel.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class AlbumCarousel extends FlatList {
  static tag = 'sw-album-carousel';
  static horizontal = true;
  static horizontalItemWidth = '148px';
  static dataState = 'sw-album-carousel-data';
  static showsHorizontalScrollIndicator = false;

  static {
    createState('sw-album-carousel-data', [
      { id: 1, title: 'Neon Pulse', artist: 'Luna Ray, Kairo', cover: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 2, title: 'Midnight Drive', artist: 'The Echoes', cover: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 3, title: 'Golden Hour', artist: 'Maya Bloom', cover: 'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 4, title: 'Static Dreams', artist: 'Vera Knox, Satin', cover: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 5, title: 'Low Tide', artist: 'Coastal Kids', cover: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 6, title: 'Paper Planes', artist: 'North & Ivy', cover: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 7, title: 'Afterglow', artist: 'DJ Prism', cover: 'https://images.pexels.com/photos/211816/pexels-photo-211816.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ]);
  }

  static { this.useState('sw-album-carousel-data'); }
  static { this.useRef('flatlistRef'); }

  renderHeader() {
    return `
      <div class="releases-head">
        <div class="releases-copy">
          <p class="releases-kicker">Brand new music from artists you love.</p>
          <h2 class="releases-title">New releases for you</h2>
        </div>
        <button type="button" class="releases-show-all">Show all</button>
      </div>
    `;
  }

  renderFooter() {
    return `
      <button type="button" class="carousel-nav prev" aria-label="Scroll left">
        <span class="switch_icon_chevron_left"></span>
      </button>
      <button type="button" class="carousel-nav next" aria-label="Scroll right">
        <span class="switch_icon_chevron_right"></span>
      </button>
    `;
  }

  renderItem({ item }) {
    return `
      <article class="album-card">
        <img class="album-cover" src="${item.cover}" alt="${item.title}" loading="lazy" />
        <h3 class="album-title">${item.title}</h3>
        <p class="album-artist">${item.artist}</p>
      </article>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  renderSeparator() {
    return '';
  }

  onMount() {
    super.onMount();
    const ref = this.constructor.flatlistRef;
    const step = () => Math.round((this._containerRef?.clientWidth ?? 320) * 0.72);

    this.listener('.carousel-nav.prev', 'click', () => {
      ref.scrollBy({ x: -step(), animated: true });
    });

    this.listener('.carousel-nav.next', 'click', () => {
      ref.scrollBy({ x: step(), animated: true });
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          background: #000;
          padding: 20px 0 28px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .flat-list-wrapper {
          position: relative;
          width: min(100%, 720px);
          margin: 0 auto;
        }

        flatlist.flat-list-container.horizontal {
          width: 100%;
          max-height: none;
          overflow-x: auto;
          overflow-y: hidden;
          position: relative;
          mask-image: linear-gradient(90deg, #000 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, #000 92%, transparent 100%);
        }

        flatlist .flat-list-content {
          gap: 20px;
          padding: 4px 2px 8px;
        }

        flatlist .flat-list-item-wrapper {
          flex: 0 0 148px;
          width: 148px;
          scroll-snap-align: start;
        }

        .releases-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding: 0 4px 16px;
          color: #fff;
        }

        .releases-kicker {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 600;
          color: #a7a7a7;
        }

        .releases-title {
          margin: 0;
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .releases-show-all {
          border: none;
          background: none;
          color: #a7a7a7;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 0;
        }

        .releases-show-all:hover { color: #fff; }

        .album-card {
          width: 148px;
        }

        .album-cover {
          width: 148px;
          height: 148px;
          border-radius: 8px;
          object-fit: cover;
          display: block;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .album-title {
          margin: 10px 0 4px;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-artist {
          margin: 0;
          font-size: 13px;
          font-weight: 500;
          color: #a7a7a7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .carousel-nav {
          position: absolute;
          top: calc(50% + 28px);
          transform: translateY(-50%);
          z-index: 3;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #fff;
          background: rgba(0, 0, 0, 0.65);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        .carousel-nav.prev { left: max(4px, calc(50% - 368px)); }
        .carousel-nav.next { right: max(4px, calc(50% - 368px)); }

        .carousel-nav span {
          font-size: 14px;
          line-height: 1;
        }
      </style>
    `;
  }
}
```

#### Grid gap, separators, header & footer

Grid gap is applied on `flatlist .flat-list-content` (default `8px`). Override separators and add chrome with `renderHeader()` / `renderFooter()`.

```javascript title:components/SpacedGridList.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class SpacedGridList extends FlatList {
  static tag = 'sw-spaced-grid-list';
  static numColumns = 2;
  static dataState = 'sw-spaced-grid-list-data';

  static {
    createState('sw-spaced-grid-list-data', [
      { id: 1, title: 'Cards', emoji: '🃏' },
      { id: 2, title: 'Lists', emoji: '📋' },
      { id: 3, title: 'Tabs', emoji: '📑' },
      { id: 4, title: 'Themes', emoji: '🎨' },
      { id: 5, title: 'Router', emoji: '🧭' },
      { id: 6, title: 'State', emoji: '⚡' }
    ]);
  }

  static { this.useState('sw-spaced-grid-list-data'); }

  renderHeader() {
    return `
      <div class="list-head">
        <div class="list-head-title">Component gallery</div>
        <div class="list-head-sub">2-column grid · custom gap & separators</div>
      </div>
    `;
  }

  renderFooter() {
    return `<div class="list-foot">6 items · scroll inside the list</div>`;
  }

  renderSeparator() {
    return '';
  }

  renderItem({ item }) {
    return `
      <div class="tile">
        <div class="tile-emoji">${item.emoji}</div>
        <div class="tile-title">${item.title}</div>
      </div>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: min(380px, 58vh);
        }

        flatlist {
          width: min(100%, 440px);
          height: 100%;
          max-height: 100%;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        flatlist .flat-list-content {
          gap: 14px;
          padding: 0 12px 12px;
        }

        .list-head {
          padding: 16px 16px 8px;
          font-family: system-ui, sans-serif;
        }

        .list-head-title {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
        }

        .list-head-sub {
          margin-top: 4px;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .list-foot {
          padding: 10px 16px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-align: center;
          border-top: 1px dashed #cbd5e1;
          font-family: system-ui, sans-serif;
        }

        .tile {
          height: 100%;
          min-height: 108px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }

        .tile-emoji { font-size: 28px; }
        .tile-title { font-weight: 800; color: #1e293b; font-size: 13px; }

        flatlist::-webkit-scrollbar { width: 6px; }
        flatlist::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
      </style>
    `;
  }
}
```

#### Full styled showcase

A polished vertical feed combining scrollbar styling, separators, header, and card layout.

```javascript title:components/ShowcaseFeed.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class ShowcaseFeed extends FlatList {
  static tag = 'sw-showcase-feed';
  static dataState = 'sw-showcase-feed-data';

  static {
    createState('sw-showcase-feed-data', [
      { id: 1, name: 'Amina', role: 'Design lead', online: true },
      { id: 2, name: 'Ben', role: 'Frontend', online: false },
      { id: 3, name: 'Chloe', role: 'Docs', online: true },
      { id: 4, name: 'Diego', role: 'Electron', online: true },
      { id: 5, name: 'Elena', role: 'Backend', online: false },
      { id: 6, name: 'Finn', role: 'QA', online: true }
    ]);
  }

  static { this.useState('sw-showcase-feed-data'); }

  renderHeader() {
    return `
      <div class="feed-head">
        <span class="feed-badge">Team</span>
        <span class="feed-count">6 members</span>
      </div>
    `;
  }

  renderSeparator() {
    return '<div class="feed-sep"></div>';
  }

  renderItem({ item }) {
    return `
      <div class="member">
        <div class="avatar">${item.name[0]}</div>
        <div class="meta">
          <div class="name">${item.name}</div>
          <div class="role">${item.role}</div>
        </div>
        <span class="status ${item.online ? 'on' : 'off'}">${item.online ? 'Online' : 'Away'}</span>
      </div>
    `;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 420px;
          height: min(400px, 62vh);
          font-family: 'Poppins', system-ui, sans-serif;
          --accent: #4f46e5;
        }

        flatlist {
          width: 100%;
          height: 100%;
          max-height: 100%;
          border-radius: 20px;
          background: linear-gradient(165deg, #ffffff 0%, #f5f3ff 100%);
          border: 1px solid rgba(79, 70, 229, 0.14);
          box-shadow: 0 18px 40px rgba(79, 70, 229, 0.08);
        }

        flatlist::-webkit-scrollbar { width: 7px; }
        flatlist::-webkit-scrollbar-track { background: transparent; }
        flatlist::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.35);
          border-radius: 999px;
        }

        .feed-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px 10px;
        }

        .feed-badge {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .feed-count {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
        }

        .member {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin: 0 10px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.88);
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .name { font-weight: 800; color: #0f172a; font-size: 14px; }
        .role { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 2px; }

        .status {
          margin-left: auto;
          font-size: 10px;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
        }

        .status.on { background: rgba(34, 197, 94, 0.12); color: #15803d; }
        .status.off { background: rgba(148, 163, 184, 0.16); color: #64748b; }

        .feed-sep {
          height: 1px;
          margin: 4px 18px;
          background: linear-gradient(90deg, transparent, rgba(79,70,229,0.18), transparent);
        }
      </style>
    `;
  }
}
```

### Grid Layout

Set `static numColumns = N` to create a grid. The layout automatically adjusts using flexbox with percentage-based widths. Override spacing with `flatlist .flat-list-content { gap: 12px; }` in your `styleSheet()`.

```javascript title:components/PhotoGrid.js preview:liveview
import { FlatList, createState } from 'switch-framework';

export class PhotoGrid extends FlatList {
  static tag = 'sw-photo-grid';
  static numColumns = 3;
  static dataState = 'sw-photo-grid-data';

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
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        flatlist {
          width: min(100%, 480px);
        }
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
  static dataState = 'sw-infinite-feed-data';
  static loadingState = 'sw-infinite-feed-loading';
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
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: min(480px, 70vh);
        }

        flatlist {
          width: min(100%, 420px);
          height: 100%;
          max-height: 100%;
          border-radius: 16px;
          background: #0b1220;
        }
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

Create states and register re-renders with `this.useState('key')` in separate `static {}` blocks. Point FlatList at your keys with `static dataState`, `static horizontalState`, `static numColumnsState`, etc. — FlatList calls `getState(...)` on every render for those props.

```javascript
static {
  createState('my-list-data', []);
  createState('my-list-horizontal', false);
}
static { this.useState('my-list-data'); }
static { this.useState('my-list-horizontal'); }

static dataState = 'my-list-data';
static horizontalState = 'my-list-horizontal';
```

Alternatively, subscribe in `onMount` with `this.useEffect(null, ['my-list-data', 'my-list-horizontal'])` — deps changing re-renders the component automatically.

- `static dataState = ''` - State key for list items (defaults to `${tag}-data`).
- `static horizontalState = ''` - State key for horizontal layout (falls back to `static horizontal`).
- `static numColumnsState = ''` - State key for column count (falls back to `static numColumns`).
- `static loadingState`, `static refreshingState`, `static errorState` - Optional state keys for status flags.
- `static numColumns = 1` - Number of columns for grid layout.
- `static horizontal = false` - Horizontal scrolling instead of vertical.
- `static horizontalItemWidth = ''` - Item wrapper width in horizontal mode (e.g. `'100%'` for carousels, `'148px'` for album cards).
- `static showsVerticalScrollIndicator = true` - Show vertical scroll indicator (vertical lists).
- `static showsHorizontalScrollIndicator = true` - Show horizontal scroll indicator (horizontal lists).
- `static onEndReachedThreshold = 0.5` - How close to bottom/end before triggering onEndReached (0-1).
- `static initialNumToRender = 10` - Initial items to render (for future virtualization).
- `static windowSize = 21` - Viewport window size for virtualization.

**Centered previews:** use `:host { display: flex; align-items: center; justify-content: center; }` and size the scroll surface with `flatlist { width: …; max-height: …; }`.

### Styling quick reference

```params-table
{"headers":["Goal","Example"],"htmlColumns":[1],"rows":[["Center list in preview","<code>:host { display: flex; align-items: center; justify-content: center; }</code>"],["Constrain scroll area","<code>flatlist { width: min(100%, 640px); max-height: 320px; }</code>"],["List data state key","<code>static dataState = 'my-list-data'</code> + <code>this.useState('my-list-data')</code>"],["State-driven horizontal","<code>static horizontalState = 'my-h'</code> + <code>this.useState('my-h')</code>"],["Hide scroll indicator","<code>static showsHorizontalScrollIndicator = false</code> (horizontal) or <code>showsVerticalScrollIndicator = false</code>"],["List height","<code>:host { height: 400px; }</code> + <code>flatlist { height: 100%; }</code>"],["Scrollbar (WebKit)","<code>flatlist::-webkit-scrollbar { width: 6px; }</code>"],["Scrollbar (Firefox)","<code>:host { scrollbar-width: thin; scrollbar-color: #888 transparent; }</code>"],["Grid gap","<code>flatlist .flat-list-content { gap: 14px; }</code>"],["Horizontal row gap","<code>flatlist .flat-list-content { gap: 10px; }</code> with <code>static horizontal = true</code>"],["useEffect re-render","<code>this.useEffect(null, ['state-key'])</code> in <code>onMount</code> — auto re-render on dep change"],["Custom separator","Override <code>renderSeparator()</code> or style <code>flatlist .flat-list-separator</code>"]]}
```

### useRef — imperative scroll control

Use **`useRef`** to call FlatList scroll methods from `onMount`, listeners, or effects — similar to React Native refs.

**Static ref** (class-level, bound to the list instance on mount):

```javascript
static { this.useRef('flatlistRef'); }

onMount() {
  super.onMount();
  this.constructor.flatlistRef.scrollToIndex({ index: 2, animated: true, viewPosition: 0 });
}
```

**Instance ref** inside methods:

```javascript
onMount() {
  super.onMount();
  const listRef = useRef(this);
  listRef.scrollToEnd({ animated: true });
}
```

```params-table
{"headers":["Method","Parameters","Description"],"htmlColumns":[1,1],"rows":[["<code>scrollToIndex</code>","<code>{ index, animated?, viewOffset?, viewPosition? }</code>","Scroll to item index. <code>viewPosition</code>: 0 = start, 0.5 = center, 1 = end of viewport."],["<code>scrollToEnd</code>","<code>{ animated? }</code>","Scroll to the last item (bottom or far right)."],["<code>scrollToOffset</code>","<code>{ offset, animated? }</code>","Scroll to exact pixel offset along the scroll axis."],["<code>scrollBy</code>","<code>{ x?, y?, animated? }</code>","Relative scroll — e.g. carousel nav: <code>scrollBy({ x: 200, animated: true })</code>."],["<code>flashScrollIndicators</code>","none","Briefly flash scroll indicators."]]}
```

### Public API Methods

These methods are also available directly on the FlatList instance (and via `useRef` handles above):

- `scrollToIndex({ index, animated, viewOffset, viewPosition })` - Scroll to specific item index.
- `scrollToEnd({ animated })` - Scroll to bottom/end of list.
- `scrollToOffset({ offset, animated })` - Scroll to specific offset position.
- `scrollBy({ x, y, animated })` - Relative scroll by pixels.
- `recordInteraction()` - Record interaction for highlighting.
- `flashScrollIndicators()` - Flash scrollbars briefly.

### Lifecycle

- `onMount()` - Call `super.onMount()` first, then add listeners via `this.listener()`.
- `onDestroy()` - Cleanup registered automatically. Use `this.addOnDestroy(fn)` for custom cleanup.
