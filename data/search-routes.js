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
  { route: 'docs/folder-structure', title: 'Folder Structure', keywords: ['folder', 'structure', 'files', 'project'] },
  { route: 'docs/layouts', title: 'Layouts', keywords: ['layout', 'stack', 'tabs', 'navigation'] },
  { route: 'docs/router', title: 'Routing', keywords: ['router', 'route', 'navigation', 'url', 'params', 'useScreenFocus', 'keep alive', 'scroll', 'switch-framework-router', 'navigate', 'replace'] },
  { route: 'docs/state', title: 'State Management', keywords: ['state', 'useState', 'createState', 'getState', 'updateState', 'useEffect', 'reactive'] },
  { route: 'docs/theming', title: 'Theming', keywords: ['theme', 'dark', 'light', 'css', 'variables'] },
  { route: 'docs/animations', title: 'Animations', keywords: ['animation', 'transition', 'keyframes', 'inAnimation', 'outAnimation', 'navigatingAnimation', 'fade', 'screen transition'] },
  { route: 'docs/switch-framework-icons', title: 'Switch Icons', keywords: ['icons', 'icon', 'svg'] },
  { route: 'docs/data-flow/props', title: 'Props', keywords: ['props', 'createProps', 'getProps', 'create props', 'get props', 'data flow', 'dataflow', 'data attribute', 'pass data', 'pass props', 'passing props', 'callbacks', 'callback', 'state keys', 'valueState', 'onChangeState', 'parent child', 'child component', 'encode', 'decode', 'reusable component'] },
  { route: 'docs/external-dependencies', title: 'Importing packages', keywords: ['npm', 'import', 'imports', 'package', 'allowlist', 'external', 'dependencies', 'import map', '/npm'] },
  { route: 'docs/external-dependencies/creating', title: 'Creating a Switch package', keywords: ['publish', 'create package', 'peerDependencies', 'registerComponent', 'component package', 'npm package'] },
  { route: 'docs/external-dependencies/package-json', title: 'Allowlisting in package.json', keywords: ['switchFramework.imports', 'package.json', 'allowlist', 'allow list', 'imports array'] },
  { route: 'docs/external-dependencies/switch-framework-doctor', title: 'Switch Framework Doctor', keywords: ['doctor', 'switch-framework-doctor', 'npx', 'check', '--fix', '--json', 'peerDependencies', 'health', 'ci'] },
  { route: 'docs/components', title: 'Component Setup', keywords: ['component', 'web component', 'custom element'] },
  { route: 'docs/components/flatlist', title: 'Flatlists', keywords: ['flatlist', 'list', 'scroll'] },
  { route: 'docs/components/scrollview', title: 'ScrollView', keywords: ['scrollview', 'scroll view', 'scroll', 'masonry', 'append', 'onEndReached', 'orientation', 'layout', 'virtualized'] },
  { route: 'docs/components/modal', title: 'Modal', keywords: ['modal', 'overlay', 'dialog', 'popup', 'sheet', 'visible'] },
  { route: 'docs/components/electron-titlebar', title: 'ElectronTitleBar', keywords: ['electron', 'titlebar', 'title bar', 'window', 'desktop', 'minimize', 'maximize', 'close'] },
  { route: 'docs/hooks', title: 'Hooks', keywords: ['hooks', 'useEffect', 'useState', 'useScreenFocus'] },
  { route: 'docs/server/introduction', title: 'Server Introduction', keywords: ['server', 'backend', 'express'] },
  { route: 'docs/server/web', title: 'Web Server', keywords: ['server', 'web', 'express', 'api'] },
  { route: 'docs/server/desktop', title: 'Desktop Server', keywords: ['server', 'desktop', 'electron', 'dynamic port', 'child process'] },
  { route: 'docs/server/desktop-electron-package', title: 'switch-framework-electron', keywords: ['electron package', 'bootstrapElectronApp', 'ipc', 'child server', 'fork', 'switch-framework-electron'] },
  { route: 'docs/server/desktop-multi-server', title: 'Multiple Child Servers', keywords: ['electron', 'fork', 'worker', 'multi server', 'ipc', 'onServerReady'] },
  { route: 'docs/server/desktop-splash', title: 'Splash Window', keywords: ['electron', 'splash', 'loading', 'boot', 'BrowserWindow'] },
  { route: 'docs/server/desktop-auth', title: 'Web Viewing & Auth', keywords: ['electron', 'auth', 'token', 'ALLOW_WEB_VIEWING', 'browser', 'debug'] },
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
  { route: 'docs/folder-structure', title: 'Folder Structure' },
  { route: 'docs/layouts', title: 'Layouts' },
  { route: 'docs/router', title: 'Routing' },
  { route: 'docs/state', title: 'State Management' },
  { route: 'docs/theming', title: 'Theming' },
  { route: 'docs/animations', title: 'Animations' },
  { route: 'docs/switch-framework-icons', title: 'Switch Icons' },
  { route: 'docs/data-flow/props', title: 'Props' },
  { route: 'docs/external-dependencies', title: 'Importing packages' },
  { route: 'docs/external-dependencies/creating', title: 'Creating a Switch package' },
  { route: 'docs/external-dependencies/package-json', title: 'Allowlisting in package.json' },
  { route: 'docs/external-dependencies/switch-framework-doctor', title: 'Switch Framework Doctor' },
  { route: 'docs/components', title: 'Component Setup' },
  { route: 'docs/components/flatlist', title: 'Flatlists' },
  { route: 'docs/components/scrollview', title: 'ScrollView' },
  { route: 'docs/components/modal', title: 'Modal' },
  { route: 'docs/components/electron-titlebar', title: 'ElectronTitleBar' },
  { route: 'docs/hooks', title: 'Hooks' },
  { route: 'docs/server/introduction', title: 'Server Introduction' },
  { route: 'docs/server/web', title: 'Web Server' },
  { route: 'docs/server/desktop', title: 'Desktop Server' },
  { route: 'docs/server/desktop-electron-package', title: 'switch-framework-electron' },
  { route: 'docs/server/desktop-multi-server', title: 'Multiple Child Servers' },
  { route: 'docs/server/desktop-splash', title: 'Splash Window' },
  { route: 'docs/server/desktop-auth', title: 'Web Viewing & Auth' }
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
