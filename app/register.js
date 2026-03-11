export async function appRegisters() {
  await Promise.all([
    import('../components/SwStarterSplashScreen.js'),
    import('../components/SwTabBar.js'),
    import('../components/TopBar.js'),
    import('../components/CodeBlock.js'),
    import('../components/DocsLeftSidebarNav.js'),
    import('../components/DocsRightSidebarNav.js'),
    import('../components/DocsFeedback.js'),
    import('../components/DocsPagination.js'),

    import('./index.js'),
    import('./+not-found.js'),
    import('./(tabs)/_layout.js'),
    import('./(tabs)/docs.js'),
    import('./(tabs)/screens/introduction.js'),
    import('./(tabs)/screens/router.js'),
    import('./(tabs)/screens/state.js'),
    import('./(tabs)/screens/theming.js'),
    import('./(tabs)/screens/animations.js'),
    import('./(tabs)/+not-found.js')
  ]);
}
