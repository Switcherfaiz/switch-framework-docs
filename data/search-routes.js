/**
 * Routes and keywords for docs search.
 * Each entry: { route, title, keywords } – keywords are used to match user search.
 */
export const SEARCH_ROUTES = [
  { route: 'index', title: 'Welcome', keywords: ['home', 'welcome', 'start', 'dashboard'] },
  { route: 'docs/introduction', title: 'Introduction', keywords: ['intro', 'getting started', 'overview', 'what is switch'] },
  { route: 'docs/tutorial/reactive-button', title: 'Tutorial: Reactive Button', keywords: ['tutorial', 'reactive', 'button', 'counter', 'state', 'example'] },
  { route: 'docs/thinking', title: 'Thinking in Switch Framework', keywords: ['thinking', 'philosophy', 'concepts'] },
  { route: 'docs/goals', title: 'Switch Framework Goals', keywords: ['goals', 'objectives', 'mission'] },
  { route: 'docs/cli', title: 'CLI', keywords: ['cli', 'command', 'npx', 'create', 'scaffold', 'npm install', 'global'] },
  { route: 'docs/installation/web', title: 'Web Installation', keywords: ['install', 'web', 'browser', 'setup'] },
  { route: 'docs/installation/desktop', title: 'Desktop Installation', keywords: ['install', 'desktop', 'electron', 'app'] },
  { route: 'docs/quickstart', title: 'Quick Start', keywords: ['quick', 'start', 'fast', 'begin'] },
  { route: 'docs/folder-structure', title: 'Folder Structure', keywords: ['folder', 'structure', 'files', 'project'] },
  { route: 'docs/layouts', title: 'Layouts', keywords: ['layout', 'stack', 'tabs', 'navigation'] },
  { route: 'docs/router', title: 'Routing', keywords: ['router', 'route', 'navigation', 'url', 'params'] },
  { route: 'docs/state', title: 'State Management', keywords: ['state', 'useState', 'createState', 'getState', 'updateState', 'useEffect', 'reactive'] },
  { route: 'docs/theming', title: 'Theming', keywords: ['theme', 'dark', 'light', 'css', 'variables'] },
  { route: 'docs/animations', title: 'Animations', keywords: ['animation', 'transition', 'keyframes'] },
  { route: 'docs/switch-icons', title: 'Switch Icons', keywords: ['icons', 'icon', 'svg'] },
  { route: 'docs/components', title: 'Component Setup', keywords: ['component', 'web component', 'custom element'] },
  { route: 'docs/components/flatlist', title: 'Flatlists', keywords: ['flatlist', 'list', 'scroll'] },
  { route: 'docs/hooks', title: 'Hooks', keywords: ['hooks', 'useEffect', 'useState'] },
  { route: 'docs/server/introduction', title: 'Server Introduction', keywords: ['server', 'backend', 'express'] },
  { route: 'docs/server/web', title: 'Web Server', keywords: ['server', 'web', 'express', 'api'] },
  { route: 'docs/server/desktop', title: 'Desktop Server', keywords: ['server', 'desktop', 'electron'] },
  { route: 'changelogs', title: 'Changelogs', keywords: ['changelog', 'release', 'version', 'updates'] },
  { route: 'authors', title: 'Authors', keywords: ['authors', 'contributors'] },
  { route: 'about', title: 'About', keywords: ['about', 'framework', 'mit'] }
];

/** Ordered list of doc routes for pagination. Each: { route, title } */
export const DOC_ORDER = [
  { route: 'docs/introduction', title: 'Introduction' },
  { route: 'docs/tutorial/reactive-button', title: 'Tutorial: Reactive Button' },
  { route: 'docs/thinking', title: 'Thinking in Switch Framework' },
  { route: 'docs/goals', title: 'Switch Framework Goals' },
  { route: 'docs/cli', title: 'CLI' },
  { route: 'docs/installation/web', title: 'Web Installation' },
  { route: 'docs/installation/desktop', title: 'Desktop Installation' },
  { route: 'docs/quickstart', title: 'Quick Start' },
  { route: 'docs/folder-structure', title: 'Folder Structure' },
  { route: 'docs/layouts', title: 'Layouts' },
  { route: 'docs/router', title: 'Routing' },
  { route: 'docs/state', title: 'State Management' },
  { route: 'docs/theming', title: 'Theming' },
  { route: 'docs/animations', title: 'Animations' },
  { route: 'docs/switch-icons', title: 'Switch Icons' },
  { route: 'docs/components', title: 'Component Setup' },
  { route: 'docs/components/flatlist', title: 'Flatlists' },
  { route: 'docs/hooks', title: 'Hooks' },
  { route: 'docs/server/introduction', title: 'Server Introduction' },
  { route: 'docs/server/web', title: 'Web Server' },
  { route: 'docs/server/desktop', title: 'Desktop Server' }
];

export function searchRoutes(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return SEARCH_ROUTES.filter(({ title, keywords }) => {
    const titleMatch = title.toLowerCase().includes(q);
    const keywordMatch = keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
    return titleMatch || keywordMatch;
  });
}
