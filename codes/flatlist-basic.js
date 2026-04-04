export const basicListCode = {
  title: 'components/UserList.js',
  language: 'javascript',
  code: `import { FlatList, createState, updateState, getState } from 'switch-framework';

export class UserList extends FlatList {
  static tag = 'sw-user-list';

  // Initialize states in static block - use tag-based naming
  static {
    createState('sw-user-list-data', [
      { id: 1, name: 'Alice', role: 'Developer' },
      { id: 2, name: 'Bob', role: 'Designer' },
      { id: 3, name: 'Carol', role: 'Manager' }
    ]);
    createState('sw-user-list-loading', false);
  }

  // Subscribe to state changes for auto re-render
  static { this.useState('sw-user-list-data'); }

  renderItem({ item, index }) {
    return \`
      <div class="user-card" data-index="\${index}">
        <div class="user-avatar">\${item.name[0]}</div>
        <div class="user-info">
          <div class="user-name">\${item.name}</div>
          <div class="user-role">\${item.role}</div>
        </div>
        <div class="user-chip">View</div>
      </div>
    \`;
  }

  keyExtractor(item, index) {
    return item.id?.toString() || \`user-\${index}\`;
  }

  onMount() {
    super.onMount();
    // Add click listener using this.listener (delegated)
    this.listener('.user-card', 'click', (e) => {
      const card = e.target.closest('.user-card');
      const index = card?.dataset.index;
      const data = getState('sw-user-list-data');
      console.log('Clicked:', data[index]?.name);
    });
  }

  styleSheet() {
    return \`
      <style>
        :host { display: block; width: 100%; font-family: var(--font, system-ui); }
        .user-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px;
          border: 1px solid rgba(148, 163, 184, 0.35);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 18px rgba(2,6,23,0.06);
        }
        .user-card:hover {
          transform: translateY(-1px);
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 10px 24px rgba(2,6,23,0.10);
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #a5b4fc 0%, #6366f1 45%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex: 0 0 auto;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-name { font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
        .user-role { font-size: 12px; color: #64748b; font-weight: 700; margin-top: 2px; }
        .user-chip {
          padding: 8px 10px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 12px;
          background: rgba(99,102,241,0.12);
          color: #4f46e5;
          border: 1px solid rgba(99,102,241,0.25);
          flex: 0 0 auto;
        }
      </style>
    \`;
  }
}`
};
