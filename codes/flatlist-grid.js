export const gridListCode = {
  title: 'components/PhotoGrid.js',
  language: 'javascript',
  code: `import { FlatList, createState, updateState, getState } from 'switch-framework';

export class PhotoGrid extends FlatList {
  static tag = 'sw-photo-grid';
  static numColumns = 3;  // Grid layout

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
    return \`
      <div class="photo-card">
        <img src="\${item.url}" alt="\${item.title}" loading="lazy" />
        <div class="photo-overlay">
          <div class="photo-title">\${item.title}</div>
          <div class="photo-badge">\${index + 1}</div>
        </div>
      </div>
    \`;
  }

  keyExtractor(item, index) {
    return \`photo-\${item.id}\`;
  }

  renderEmpty() {
    return \`<div class="empty-grid">No photos available</div>\`;
  }

  styleSheet() {
    return \`
      <style>
        :host { display: block; width: 100%; font-family: var(--font, system-ui); }
        .photo-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(148, 163, 184, 0.25);
          box-shadow: 0 10px 24px rgba(2,6,23,0.08);
          transform: translateZ(0);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .photo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(2,6,23,0.14);
        }
        .photo-card img {
          width: 100%;
          height: 130px;
          object-fit: cover;
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 10px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%);
          gap: 8px;
        }
        .photo-title {
          color: white;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .photo-badge {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(99,102,241,0.95);
          color: white;
          font-weight: 1000;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.25);
          flex: 0 0 auto;
        }
        .empty-grid {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
      </style>
    \`;
  }
}`
};
