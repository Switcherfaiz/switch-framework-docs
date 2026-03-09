import { Tabs } from '/switch-framework/index.js';

export const tabsLayout = Tabs({
  name: 'sw-tabs-layout',
  initialTab: 'docs',
  tabs: [
    {
      name: 'docs',
      title: 'Docs',
      icon: 'description',
      path: '/docs/:id',
      screen: 'sw-docs-screen',
      match: ['docs', 'introduction', 'installation', 'quickstart'],
      initialRoute: 'introduction'
    }
  ],
  options: {
    position: 'bottom'
  }
});

export class SwTabsLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  getContentContainer() {
    return this.shadowRoot.querySelector('.tabcontainer');
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="layout">
        <sw-topbar></sw-topbar>
        <div class="content">
          <div class="left-sidebar">
            <sw-docs-left-sidebar-nav></sw-docs-left-sidebar-nav>
          </div>
          <div class="tabcontainer"></div>
          <div class="right-sidebar">
            <sw-docs-right-sidebar-nav></sw-docs-right-sidebar-nav>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style> 
      :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: inherit;
    overflow: hidden;
    font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
}

* {
    box-sizing: border-box;
    font-family: inherit
}


.layout {
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 240px;
  overflow: hidden;
}

.left-sidebar {
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
}

.right-sidebar {
  border-left: 1px solid #e5e7eb;
  overflow: hidden;
}

.tabcontainer {
  z-index: 1;
  min-height: 0;
  overflow: auto;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .left-sidebar,
  .right-sidebar {
    display: none;
  }
}

</style>
    `;
  }
}

if (!customElements.get('sw-tabs-layout')) {
  customElements.define('sw-tabs-layout', SwTabsLayout);
}

export const screens = [
  Tabs.screen({
    name: 'docs',
    path: '/docs/:id',
    title: 'Docs',
    tag: 'sw-docs-screen',
    layout: 'tabs'
  }),
  Tabs.screen({
    name: 'introduction',
    path: '/docs/introduction',
    title: 'Introduction',
    tag: 'sw-introduction-screen',
    layout: 'tabs'
  }),
  Tabs.screen({
    name: 'installation',
    path: '/docs/installation',
    title: 'Installation',
    tag: 'sw-installation-screen',
    layout: 'tabs'
  }),
  Tabs.screen({
    name: 'quickstart',
    path: '/docs/quickstart',
    title: 'Quick Start',
    tag: 'sw-quickstart-screen',
    layout: 'tabs'
  })
];

tabsLayout.screens = screens;

export default tabsLayout;
