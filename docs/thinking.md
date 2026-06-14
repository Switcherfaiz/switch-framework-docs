## Thinking in Switch Framework

Switch Framework is built around a few core ideas: **screens as routes**, **state as events**, and **components as Web Components**. Understanding these will help you build apps that feel natural and stay maintainable.

### Screens and routes

Every screen is a route. You define screens with `screenName` and `path`. The framework maps URLs to screens and renders them into the layout container. Stack screens push/pop; tab screens switch between views.

### State as events

State is global and event-driven. `createState` registers a key; `updateState` changes it and notifies subscribers. Components use `useState` to react. No prop drilling – any component can read or update shared state.

### Components

All UI extends `SwitchComponent` – a Web Component with shadow DOM, `render()`, and `styleSheet()`. Use `registerComponents` to auto-define custom elements. No JSX, no virtual DOM – just HTML strings and real DOM.
