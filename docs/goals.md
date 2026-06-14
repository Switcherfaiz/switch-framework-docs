## Switch Framework Main Goals

Switch Framework aims to be the simplest way to build structured web apps without build tools. Our main goals:

### No build step

Run directly in the browser. Use native ES modules, no bundler, no transpilation. Your `index.html` loads scripts and you're ready. Ideal for prototypes, internal tools, and docs sites.

### Lightweight

Small runtime. No virtual DOM, no diffing. Components render HTML strings into shadow DOM. State updates trigger re-renders only where needed. Fast load, fast interaction.

### Familiar patterns

Stack and tab navigation like mobile apps. State management that feels like React's useState. Web Components under the hood. If you've used React or Vue, you'll feel at home.

### Flexible

Mix reactive state with vanilla DOM. Use as much or as little of the framework as you need. No lock-in – it's just JavaScript and HTML.
