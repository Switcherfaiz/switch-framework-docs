export const infiniteScrollCode = {
  title: 'components/InfiniteFeed.js',
  language: 'javascript',
  code: `import { FlatList, createState, updateState, getState } from 'switch-framework';

export class InfiniteFeed extends FlatList {
  static tag = 'sw-infinite-feed';
  static onEndReachedThreshold = 0.6;

  // Only subscribe to loading for the spinner — NOT data,
  // because we handle data updates via append, not full re-render
  static { this.useState('sw-infinite-feed-loading'); }

  static {
    createState('sw-infinite-feed-data', []);
    createState('sw-infinite-feed-page', 1);
    createState('sw-infinite-feed-loading', false);
    createState('sw-infinite-feed-has-more', true);
  }

  constructor() {
    super();
    this._renderedCount = 0;
    this._contentRef = null;
  }

  onMount() {
    super.onMount();
    this._contentRef = this.select('.flat-list-content');

    // Re-append items if DOM was wiped by a loading-state rerender
    const data = (() => { try { return getState('sw-infinite-feed-data') ?? []; } catch (_) { return []; } })();
    if (data.length > 0 && this._contentRef && this._contentRef.children.length === 0) {
      this._renderedItems = [];
      this._itemsRef.clear();
      this._renderedCount = 0;
      this._appendItems(data, 0);
    }

    // Only kick off initial load if nothing has been fetched yet
    if (data.length === 0) {
      this._loadMore();
    }
  }

  async onEndReached() {
    const hasMore = getState('sw-infinite-feed-has-more');
    const loading = getState('sw-infinite-feed-loading');
    if (!hasMore || loading) return;
    await this._loadMore();
  }

  async _loadMore() {
    updateState('sw-infinite-feed-loading', true);
    try {
      const page = getState('sw-infinite-feed-page') ?? 1;
      const newItems = await this._fetchItems(page);
      const current = getState('sw-infinite-feed-data') ?? [];
      const updated = [...current, ...newItems];

      updateState('sw-infinite-feed-data', updated);
      updateState('sw-infinite-feed-page', page + 1);
      if (page >= 4) updateState('sw-infinite-feed-has-more', false);

      this._appendItems(newItems, current.length);
    } finally {
      updateState('sw-infinite-feed-loading', false);
    }
  }

  _appendItems(newItems, startIndex) {
    if (!this._contentRef) return;
    const fragment = document.createDocumentFragment();
    newItems.forEach((item, i) => {
      const index = startIndex + i;
      const key = this.keyExtractor(item, index);
      this._renderedItems.push(key);

      const wrapper = document.createElement('div');
      wrapper.className = 'flat-list-item-wrapper';
      wrapper.dataset.key = key;
      wrapper.dataset.index = index;
      wrapper.innerHTML = this.renderItem({ item, index, separators: {} });

      this._itemsRef.set(key, wrapper);
      fragment.appendChild(wrapper);
    });
    this._contentRef.appendChild(fragment);
    this._renderedCount += newItems.length;
  }

  async _fetchItems(page) {
    await new Promise(r => setTimeout(r, 450));
    const media = [
      { id: 101, src: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=900', user: 'Pexels' },
      { id: 102, src: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=900', user: 'Pexels' },
      { id: 103, src: 'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=900', user: 'Pexels' },
      { id: 104, src: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=900', user: 'Pexels' },
      { id: 105, src: 'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=900', user: 'Pexels' }
    ];
    return Array.from({ length: 2 }, (_, i) => {
      const m = media[(page * 10 + i) % media.length];
      return {
        id: page + '-' + i + '-' + m.id,
        src: m.src,
        user: m.user,
        caption: 'Reel ' + page + '.' + (i + 1)
      };
    });
  }

  renderItem({ item }) {
    return \`
      <section class="reel">
        <img class="reel-media" src="\${item.src}" alt="\${item.caption}" loading="lazy" />
        <div class="reel-grad"></div>
        <div class="reel-ui">
          <div class="reel-title">\${item.caption}</div>
          <div class="reel-sub">Swipe/scroll down • \${item.user}</div>
          <div class="reel-actions">
            <button class="pill">Like</button>
            <button class="pill">Save</button>
            <button class="pill">Share</button>
          </div>
        </div>
      </section>
    \`;
  }

  keyExtractor(item) {
    return item.id;
  }

  renderLoader() {
    return \`
      <div class="reel-loader">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    \`;
  }

  render() {
    const loading = (() => { try { return getState('sw-infinite-feed-loading') ?? false; } catch (_) { return false; } })();
    return \`
      <div class="reels-wrap">
        <div class="flat-list-container vertical reels" style="overflow-y: auto; overflow-x: hidden; height: min(520px, calc(100vh - 32px)); border-radius: 16px;">
          <div class="flat-list-content" style="scroll-snap-type: y mandatory;"></div>
          \${loading ? this.renderLoader() : ''}
        </div>
      </div>
    \`;
  }

  styleSheet() {
    return \`
      <style>
        :host { display: block; width: 100%; }
        .reels-wrap { width: 100%; }
        .flat-list-container.reels { background: #0b1220; border: 1px solid rgba(255,255,255,0.08); }
        .flat-list-item-wrapper { scroll-snap-align: start; }
        .reel {
          position: relative;
          height: min(520px, calc(100vh - 32px));
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .reel-media { width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); }
        .reel-grad {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%);
        }
        .reel-ui { position: absolute; left: 16px; right: 16px; bottom: 16px; color: white; font-family: var(--font, system-ui); }
        .reel-title { font-weight: 900; font-size: 18px; letter-spacing: -0.02em; }
        .reel-sub { margin-top: 4px; opacity: 0.85; font-size: 12px; font-weight: 600; }
        .reel-actions { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
        .pill {
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(0,0,0,0.35);
          color: white; padding: 8px 10px;
          border-radius: 999px; font-weight: 800; cursor: pointer;
        }
        .pill:hover { background: rgba(0,0,0,0.5); }
        .reel-loader {
          position: absolute; left: 50%; bottom: 14px;
          transform: translateX(-50%); display: flex; gap: 6px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.7); animation: b 0.9s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes b { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-4px); opacity: 1; } }
        .flat-list-empty { color: rgba(255,255,255,0.75); }
      </style>
    \`;
  }
}`
};