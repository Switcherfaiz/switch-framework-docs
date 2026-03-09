export async function appRegisters() {
  await Promise.all([
    import('../components/SwStarterSplashScreen.js'),
    import('../components/SwTabBar.js'),
    import('../components/TopBar.js'),
    import('../components/CodeBlock.js'),
    import('../components/DocsLeftSidebarNav.js'),
    import('../components/DocsRightSidebarNav.js'),

    import('./index.js'),
    import('./+not-found.js'),
    import('./(tabs)/_layout.js'),
    import('./(tabs)/docs.js'),
    import('./(tabs)/+not-found.js'),
    import('./(tabs)/screens/introduction.js'),
    import('./(tabs)/screens/installation.js'),
    import('./(tabs)/screens/quickstart.js')
  ]);
}
