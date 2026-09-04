# Introduction

**Switch Framework** is a lightweight, runtime-first frontend framework that plays nicely with `switch-framework-backend`. Think of it as your friendly neighborhood router + component layer – no build step required, no webpack config to cry over. Just HTML, ES modules, and a sprinkle of structure.

> [!TIP]
> New here? After this page, follow [[Tutorial: Reactive button|docs/tutorial/reactive-button]] for a hands-on first component, then [[Web installation|docs/installation/web]] to scaffold an app.

> [!NOTE]
> Switch runs as native ES modules in the browser. You do not need a bundler to get started.

### What's the deal?

You get a declarative routing system (stack screens, tab navigation), Web Components for encapsulation, and optional state management. Everything runs directly in the browser – no bundler needed to get started. Prototype fast, ship faster. If you've ever wanted "React Router but simpler" or "Vue's structure without the framework," Switch is here for you.

### Key Features

- **Runtime-first** – No bundler required. Use native ES modules. Your `index.html` loads scripts, and you're off to the races.
- **SwitchComponent** – Base class for screens and components. Shadow DOM, `render()`, `styleSheet()`, `connected()`/`disconnected()`, and `useEffect` for reactive updates.
- **Reactive state** – `createState` and `useState` for shared, event-driven state. No prop drilling.
- **StackLayout & TabLayout** – Register screens in `stackScreens` or `TabLayout.screens`. Layout is inferred automatically; `static layout` is optional if you want it explicit.
- **Auto boot** – Load `app/_layout.js` from `index.html`. When the framework detects your `StackLayout` subclass, it starts the app — no manual `startApp()` call.
- **Backend integration** – `switch-framework-backend` gives you auth, sessions, and API helpers. Full-stack made easy.
- **Theming** – Dark/light mode with CSS variables. One line to init, and you're themed.

### When should I use Switch?

**No-build apps.** If you want a lightweight, zero-build frontend that runs directly in the browser – no webpack, no Vite, no bundler – Switch is built for that. Just HTML and ES modules.

**State management + DOM.** Switch gives you an event-driven state manager that plays nicely with normal DOM operations. You can mix reactive state (`createState`, `useState`) with vanilla DOM updates, `querySelector`, and direct manipulation. No virtual DOM lock-in – use as much or as little structure as you need.

**Lightweight, event-driven.** If you want a small runtime with state management, routing, and components – without the weight of a full framework – Switch fits. Documentation sites, dashboards, internal tools, admin panels, prototypes. Anything that benefits from routing and a bit of structure, without the overhead.
