## Hooks

Hooks are small tools that help your components **remember things**, **react to changes**, and **call special actions** (like scrolling a list or closing a window).

> **Simple idea:** A **state** is like a shared notebook. Anyone can read it with `getState` and write in it with `updateState`. Hooks tell your component when to redraw, when to run extra code, or how to control lists.

---

### Quick cheat sheet (read this first)

```params-table
{"headers":["Tool","What it is","Rerender?","Where to call","Read / write"],"htmlColumns":[0,1,2,3,4],"rows":[["<code>createState(key, value)</code>","Create a global key once at app boot","—","<code>_layout.js</code> init","<code>getState(key)</code> / <code>updateState(key, value)</code>"],["<code>ensureState(key, value)</code>","Same as create, but never throws if key exists","—","boot or features","same as createState"],["<code>getState(key)</code>","Read a global value from anywhere","No","anywhere","read only"],["<code>updateState(key, value)</code>","Write a global value from anywhere","Only if a screen uses <code>useShared</code> on that key","anywhere","write"],["<code>useState(initial)</code>","Small local value on this tag only","Yes — this component only","<code>render()</code>","returned <code>[value, setValue]</code>"],["<code>useInstanceState(initial)</code>","Screen data on this tag only (like constructor fields)","Optional — default yes; pass <code>{ rerender: false }</code> to skip","<code>render()</code>","returned <code>[value, setValue]</code> — not in <code>getState</code>"],["<code>useShared(key, default)</code>","Subscribe to a global key + rerender this screen when it changes","Yes — full rerender","<code>render()</code>","returned <code>[value, setValue]</code> — same as updateState"],["<code>onState(key, fn)</code>","Run a function when a global key changes","No — patch DOM only","<code>onMount()</code> once","wins over useShared for same key"],["<code>useEffect(fn, deps)</code>","Run code when deps change","Can trigger rerender if deps are state keys","<code>effects()</code>",""],["<code>useScreenFocus(fn)</code>","Run when this screen is visible (and params match)","No by itself","<code>effects()</code>",""],["<code>this.paint(sel, html)</code>","Replace one HTML region without full rerender","No","handlers / async","imperative"]]}
```

**Two state systems (both stay — they do different jobs):**

- **`SwitchStateManager`** — app data keys: `user`, `pins`, `home-results`. Use `createState` / `ensureState` / `getState` / `updateState` / hooks.
- **`globalStates`** — router + navigation: `activeRoute`, `routeParams`, `navigate`. The framework mirrors route keys into `SwitchStateManager` at boot so `useEffect(..., ['activeRoute'])` works.

**Lifecycle:**

- **`onMount()`** — runs **once** after first render. Put `listener()` and `onState()` here.
- **`onUpdate()`** — optional; runs after later rerenders only.
- **`effects()`** — runs every render cycle; put `useScreenFocus` / `useEffect` here.

**Where hooks go:**
- **`useState(initial)`**, **`useShared(key)`**, **`useInstanceState(initial)`** → call from **`render()`**
- **`useEffect`** and **`useScreenFocus`** → write them in **`effects()`**
- **`onState(key, fn)`**, **`this.listener()`**, and **`useRef(this)`** → write them in **`onMount()`**

Every example below is a **full component** you can copy, register, and run.

---

### React-style hooks (simplified API)

These hooks cover most cases without global keys or `static {}` blocks.

#### useState — local component state

`useState(initialValue)` creates state that belongs only to this component instance. Calling the setter rerenders this component and no one else. **Not global** — other components cannot use `getState()` to read it.

```javascript title:components/Counter.js
import { SwitchComponent, useState, registerComponent } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';

  onMount() {
    this.listener('#inc', 'click', () => this._setCount((n) => n + 1));
  }

  render() {
    const [count, setCount] = useState(0);
    this._setCount = setCount;         // expose for onMount handlers
    return `
      <div class="card">
        <p class="count">${count}</p>
        <button id="inc">Add one</button>
      </div>
    `;
  }
}
registerComponent(Counter);
```

**Rules:**
- Call `useState` in the same order every render (same as React).
- Store the setter on `this` so `onMount` handlers and async methods can use it.
- The setter accepts a value or an updater function: `setCount(n => n + 1)`.

---

#### useInstanceState — screen-level instance state

`useInstanceState(initialValue)` stores data **on this component instance** — like putting values on `this` in a constructor. Each keep-alive screen gets its own copy (e.g. `/user/alice` vs `/user/bob`).

- **Not global** — no `getState('profile')` from another file.
- **Default:** calling the setter **rerenders** this screen (same as `useState`).
- **Skip rerender:** `setProfile(next, { rerender: false })` then use `this.paint()` or a small DOM patch.

```javascript title:screens/UserScreen.js
import { SwitchComponent, useInstanceState, useScreenFocus, registerComponent } from 'switch-framework';

export class UserScreen extends SwitchComponent {
  static screenName = 'user/:id';
  static tag = 'sw-user-screen';
  static props = 'encoded';

  effects() {
    useScreenFocus(() => this.load());
  }

  onMount() {
    this.listener('#follow', 'click', () => {
      this._setProfile((s) => ({
        ...s,
        user: { ...s.user, isFollowing: !s.user.isFollowing }
      }), { rerender: false });
      // patch button only — no full remount
      const btn = this.select('#follow');
      if (btn) btn.textContent = 'Following';
    });
  }

  async load() {
    const id = this.getProps().id;
    const json = await fetch(`/api/users/${id}`).then((r) => r.json());
    this._setProfile({ user: json.user, pins: [], loading: false });
  }

  render() {
    const [profile, setProfile] = useInstanceState({ user: null, pins: [], loading: true });
    this._setProfile = setProfile;
    const { user, loading } = profile;
    if (loading) return `<div class="page">Loading…</div>`;
    return `<div class="page"><h1>${user?.name}</h1><button id="follow">Follow</button></div>`;
  }
}
registerComponent(UserScreen);
```

---

#### ensureState — safe global key creation

`ensureState(key, default)` creates a global key **only if missing**. Use it in `_layout.js` boot and feature files instead of `try { createState(...) } catch {}`.

`createState` still throws when the key already exists — useful to catch duplicate boot keys during development.

```javascript title:app/_layout.js
import { ensureState, updateState } from 'switch-framework';

ensureState('pins', []);
ensureState('user', null);
updateState('user', sessionUser);
```

---

#### useShared — subscribe to global state

`useShared(key, defaultValue?)` reads a global state key **and** subscribes this component to it. When the value changes (from anywhere in the app), this component rerenders. Uses `ensureState` internally — no try/catch needed.

```javascript title:screens/PinsScreen.js
import { SwitchComponent, useShared, useScreenFocus, createProps } from 'switch-framework';
import { apiGet } from '../api.js';

export class PinsScreen extends SwitchComponent {
  static screenName = 'pins';
  static tag = 'sw-pins-screen';

  effects() {
    useScreenFocus(async () => {
      const json = await apiGet('/pins');
      this._setPins(json.pins || []);
    });
  }

  render() {
    const [pins, setPins] = useShared('pins', []);
    this._setPins = setPins;
    return `
      <div class="masonry">
        ${pins.map(p => `<tw-pin-card data="${createProps(p)}"></tw-pin-card>`).join('')}
      </div>
    `;
  }
}
```

`setPins(next)` is equivalent to `updateState('pins', next)`. Both work — use whichever reads cleaner.

**When to use `useShared` vs `static { this.useState() }`:**

```params-table
{"headers":["","useShared","static { this.useState() }"],"htmlColumns":[0,1,2],"rows":[["Where to write","<code>render()</code>","class <code>static {}</code> block"],["Auto-creates key","✓ yes","✗ no"],["Creates subscription","yes, on first render","yes, at class load time"],["Both cause full rerender","✓","✓"],["Verdict","<strong>preferred — simpler</strong>","still works, no plans to remove"]]}
```

`useShared` is the preferred approach going forward. `static { this.useState() }` still works and will not be removed.

---

#### onState — DOM patch without rerender

`onState(key, fn)` subscribes to a global key and calls `fn` on each change — **without** triggering `render()`. Use this when replacing `innerHTML` would reset a CSS animation or discard a focused input.

Call it from `onMount()` (runs once). Subscriptions are deduped per key — calling onState with the same key on a later rerender safely updates the callback reference.

**Priority rule — `onState` wins over `useShared` for the same key.** If both are called for the same key on the same component, the framework cancels the `useShared` rerender subscription so only the `onState` callback fires. This lets you opt out of a full rerender for specific keys. In practice, use each key with only one strategy: either `useShared` (rerender) or `onState` (callback), not both.

```javascript title:components/LikeButton.js
import { SwitchComponent, onState, updateState, createState, registerComponent } from 'switch-framework';

createState('liked', false);

export class LikeButton extends SwitchComponent {
  static tag = 'sw-like-button';

  onMount() {
    // Runs on change without rebuilding HTML — animation survives
    onState('liked', (liked) => {
      const heart = this.select('.heart');
      if (!heart) return;
      heart.classList.remove('pop');
      void heart.offsetWidth;          // force reflow
      heart.classList.add('pop');
      heart.style.color = liked ? '#e60023' : '#ccc';
    });

    this.listener('.like-btn', 'click', () => {
      updateState('liked', (v) => !v);
    });
  }

  render() {
    return `
      <button class="like-btn">
        <span class="heart">♥</span>
      </button>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; }
        .like-btn { border: none; background: transparent; cursor: pointer; font-size: 28px; }
        .heart { display: inline-block; color: #ccc; }
        .heart.pop { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.5); } 100% { transform: scale(1); } }
      </style>
    `;
  }
}
registerComponent(LikeButton);
```

---

#### All three together — Messages screen

This example shows all three hooks on the **same component with different keys** — the right way to use them together.

- `useShared('messages')` owns the list. When messages change, the component rerenders and the unread badge recalculates inside `render()` — no separate `onState` needed for the same key.
- `onState('messages-typing', fn)` owns the typing indicator. It patches a small element without rebuilding the whole list — a different key with callback-only behavior.
- `useState(null)` is purely local open-thread tracking.

```javascript title:screens/MessagesScreen.js
import { SwitchComponent, useShared, useState, onState, updateState, useScreenFocus } from 'switch-framework';
import { apiGet } from '../api.js';

export class MessagesScreen extends SwitchComponent {
  static screenName = 'messages';
  static tag = 'sw-messages-screen';

  effects() {
    useScreenFocus(async () => {
      const json = await apiGet('/messages');
      this._setList(json.messages || []);
    });
  }

  onMount() {
    this.listener('[data-msg-id]', 'click', (e) => {
      const id = e.target.closest('[data-msg-id]')?.dataset.msgId;
      this._setOpenId(id || null);
    });
    this.listener('#back', 'click', () => this._setOpenId(null));

    // Different key from 'messages' — patches DOM without rebuilding the list
    onState('messages-typing', (who) => {
      const tip = this.select('.typing-tip');
      if (tip) tip.textContent = who ? `${who} is typing…` : '';
    });
  }

  render() {
    // useShared owns 'messages' — full rerender when list changes
    const [list, setList] = useShared('messages', []);
    // useState owns open-thread ID — local, invisible outside this component
    const [openId, setOpenId] = useState(null);

    this._setList  = setList;
    this._setOpenId = setOpenId;

    // Badge calculated here — no need for a separate onState('messages')
    const unread = list.filter(m => m.unread).length;

    const current = list.find(m => String(m.id) === String(openId));
    if (current) return `<div class="thread">...</div>`;

    return `
      <div class="page">
        <span class="badge">${unread || ''}</span>
        <span class="typing-tip"></span>
        ${list.map(m => `<button data-msg-id="${m.id}">${m.name}</button>`).join('')}
      </div>
    `;
  }
}
```

```params-table
{"headers":["Hook","Key","Behavior"],"htmlColumns":[0,1,2],"rows":[["<code>useShared</code>","<code>'messages'</code>","Full rerender — list and badge rebuild together"],["<code>useState</code>","local (no key)","Local open-thread ID — only this component"],["<code>onState</code>","<code>'messages-typing'</code>","Callback only — patches the typing tip, no rebuild"]]}
```

> **Rule of thumb:** use each global key with **one** strategy per component — either `useShared` (rerender) or `onState` (callback). If you call both for the same key, `onState` wins and cancels the rerender subscription.

---

### Shared state — createState, getState, updateState

Think of a state key as a **labeled box** in memory.

- `createState('name', startValue)` — make the box once (usually in `static {}`)
- `getState('name')` — read what is inside
- `updateState('name', newValue)` — put something new inside
- `updateState('name', (old) => old + 1)` — update using the old value

When the box changes, anything subscribed to that key gets notified.

```javascript title:components/Counter.js
import { SwitchComponent, createState, getState, updateState } from 'switch-framework';

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';

  static {
    createState('counter', 0);
    this.useState('counter');
  }

  render() {
    const count = getState('counter') ?? 0;
    return `
      <div class="card">
        <p class="label">Button clicks</p>
        <p class="count" id="count">${count}</p>
        <button type="button" class="btn primary" id="inc">Add one</button>
      </div>
    `;
  }

  onMount() {
    this.listener('#inc', 'click', () => {
      updateState('counter', (n) => (n ?? 0) + 1);
    });
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: linear-gradient(180deg, #fff, #f8fafc);
          max-width: 280px;
          text-align: center;
        }
        .label { margin: 0 0 8px; font-size: 13px; color: #64748b; font-weight: 600; }
        .count { margin: 0 0 16px; font-size: 48px; font-weight: 800; color: #4f46e5; line-height: 1; }
        .btn {
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn.primary { background: #4f46e5; color: #fff; }
        .btn.primary:hover { background: #4338ca; }
      </style>
    `;
  }
}
```

### getProps

Read the props a parent passed through the encoded `data` attribute. The framework decodes and caches the payload for you – never call `getAttribute('data')` or `decodeData()` yourself. Returns `{}` when no props were passed. Available in `render()`, `onMount()`, and event handlers on every `SwitchComponent`.

```javascript title:getProps
render() {
  const { label = 'Select', valueState } = this.getProps();
  const value = getState(valueState);
  return \`<p>\${label}: \${value}</p>\`;
}
```

The component re-renders automatically when the parent replaces its `data` attribute – no `observedAttributes` boilerplate needed. See [[Props|docs/data-flow/props]] for the full props guide with `createProps` and the state-key callback pattern.

### Router hooks

### static useState — redraw the whole component

> **Classic API** — `useShared(key, defaultValue)` called from `render()` is the simpler replacement. Both do the same thing; `static { this.useState() }` will not be removed.

`static { this.useState('key'); }` means: **when this key changes, run `render()` and `onMount()` again.**

Use it for anything that should appear on screen (text, colors, lists, icons).

```javascript title:components/MoodPicker.js
import { SwitchComponent, createState, getState, updateState } from 'switch-framework';

export class MoodPicker extends SwitchComponent {
  static tag = 'sw-mood-picker';

  static {
    createState('mood', 'happy');
    this.useState('mood');
  }

  render() {
    const mood = getState('mood') ?? 'happy';
    const emoji = mood === 'happy' ? '😊' : mood === 'tired' ? '😴' : '🤔';
    return `
      <div class="card">
        <p class="label">How do you feel?</p>
        <div class="emoji" id="emoji">${emoji}</div>
        <p class="mood-name"><strong>${mood}</strong></p>
        <div class="actions">
          <button type="button" class="pill" id="happy">Happy</button>
          <button type="button" class="pill" id="tired">Tired</button>
          <button type="button" class="pill" id="think">Thinking</button>
        </div>
      </div>
    `;
  }

  onMount() {
    this.listener('#happy', 'click', () => updateState('mood', 'happy'));
    this.listener('#tired', 'click', () => updateState('mood', 'tired'));
    this.listener('#think', 'click', () => updateState('mood', 'thinking'));
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
          max-width: 320px;
          text-align: center;
        }
        .label { margin: 0 0 12px; font-size: 13px; color: #64748b; font-weight: 600; }
        .emoji { font-size: 56px; line-height: 1; margin-bottom: 8px; }
        .mood-name { margin: 0 0 16px; text-transform: capitalize; color: #0f172a; }
        .actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .pill {
          border: 1px solid #c7d2fe;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .pill:hover { background: #e0e7ff; }
      </style>
    `;
  }
}
```

You can add more keys in separate blocks:

```javascript
static { this.useState('sw-user-list-data'); }
static { this.useState('sw-user-list-loading'); }
```

**FlatList** already creates default keys for your tag (like `sw-user-list-data`). Add `static { this.useState('…'); }` for each key you read in `render()`.

### useState with a callback — DOM work without full redraw

> **Deprecated** — use [`onState(key, callback)`](#onstate--dom-patch-without-rerender) instead. `useState('key', callback)` still works and will not be removed, but `onState` is the preferred form: it deduplicates subscriptions automatically so you do not need `addOnDestroy`, and it reads more clearly.

Sometimes you need to **touch the DOM directly** when state changes — for example to play a CSS animation. A full re-render would replace the element and **cancel** the animation.

Use `useState('key', callback)` in `onMount`. The callback runs on each change. You update classes, text, or styles yourself. Always clean up with `this.addOnDestroy(unsub)`.

```javascript title:components/LikeButton.js
import { SwitchComponent, createState, updateState, useState } from 'switch-framework';

export class LikeButton extends SwitchComponent {
  static tag = 'sw-like-button';

  static {
    createState('liked', false);
  }

  render() {
    return `
      <div class="card">
        <p class="label">Tap the heart — watch it bounce (no full redraw)</p>
        <button type="button" class="like-btn" id="like-btn" aria-pressed="false">
          <span class="heart" id="heart">♥</span>
          <span class="like-text" id="like-text">Like</span>
        </button>
      </div>
    `;
  }

  onMount() {
    const [, unsub] = useState('liked', (liked) => {
      const btn = this.select('#like-btn');
      const heart = this.select('#heart');
      const text = this.select('#like-text');
      if (!btn || !heart || !text) return;

      text.textContent = liked ? 'Liked!' : 'Like';
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      btn.classList.toggle('is-liked', !!liked);

      heart.classList.remove('pop');
      void heart.offsetWidth;
      heart.classList.add('pop');
    });
    this.addOnDestroy(unsub);

    this.listener('#like-btn', 'click', () => {
      updateState('liked', (v) => !v);
    });
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #fecdd3;
          background: linear-gradient(180deg, #fff1f2, #fff);
          max-width: 300px;
          text-align: center;
        }
        .label { margin: 0 0 16px; font-size: 13px; color: #9f1239; font-weight: 600; }
        .like-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #fda4af;
          background: #fff;
          border-radius: 999px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 800;
          color: #be123c;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .like-btn.is-liked {
          background: #ffe4e6;
          border-color: #fb7185;
        }
        .heart {
          display: inline-block;
          font-size: 22px;
          color: #e11d48;
          transform-origin: center;
        }
        .heart.pop {
          animation: heart-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes heart-pop {
          0% { transform: scale(1); }
          45% { transform: scale(1.45); }
          100% { transform: scale(1); }
        }
      </style>
    `;
  }
}
```

The callback updates text and toggles classes. CSS `animation` runs on the existing element because `render()` did not run again.

For normal UI updates (labels, lists, layout), prefer **`static { this.useState('key'); }`** — it is simpler.

### useEffect — watch keys and react

Import `useEffect` from `switch-framework` and call it inside **`effects()`** — not `onMount`. The framework runs `effects()` after every `render()`, before `onMount`.

You can call **`useEffect` multiple times** in one `effects()` method — each call is a separate effect, in order (like React).

```javascript
effects() {
  useEffect(() => {
    console.log('Runs when activeRoute changes');
    return () => console.log('cleanup');
  }, ['activeRoute']);

  useEffect(() => {
    document.title = getState('page-title') || 'My App';
  }, ['page-title']);

  useEffect(() => {
    console.log('Runs once on mount');
  }, []);
}
```

**Dependency array rules (same idea as React):**

- **`[]`** — runs **once** when the component mounts
- **`['key-a', 'activeRoute']`** — runs on mount, then again only when those **values** change (`activeRoute` comes from router `globalStates`)
- **Infinite loop trap** — do **not** put `quote-loading` or `quote-data` in deps if the effect calls `fetchData()` which updates them. Use `static useState` for redraw instead
- **Return value** — use `return () => { ... }` **only for cleanup** (unsubscribe, clear timers). Call `fetchData()` at the **top** of the effect, before `return`

### useScreenFocus — run when this screen is showing

Kept-alive screens stay in the DOM when you navigate away. `useEffect(['activeRoute'])` would still run on hidden screens. `useScreenFocus` only runs when **this** screen matches the current route.

`home` matches only `/home`. `home/:id` matches `/home/travel`, not `/home`.

```javascript
import { useScreenFocus } from 'switch-framework';

effects() {
  useScreenFocus(() => {
    this.loadFeed();
  });
}
```

Call it from `effects()`, same as `useEffect`. Hidden screens keep their scroll; this hook is for refetching or syncing when the user comes back.

```params-table
{"headers":["Helper","Matches"],"htmlColumns":[0,1],"rows":[["<code>isScreenActive('home')</code>","Only route <code>home</code>"],["<code>isScreenActive('home/:id')</code>","<code>home/travel</code>, not <code>home</code>"],["<code>useScreenFocus(fn)</code>","Runs <code>fn</code> when this screen is active, including param changes"]]}
```

#### Example — color and size box

```javascript title:components/ColorBox.js
import { SwitchComponent, createState, getState, updateState, useEffect } from 'switch-framework';

export class ColorBox extends SwitchComponent {
  static tag = 'sw-color-box';

  static {
    createState('box-color', '#6366f1');
    createState('box-size', 100);
    this.useState('box-color');
    this.useState('box-size');
  }

  render() {
    const color = getState('box-color');
    const size = getState('box-size');
    return `
      <div class="card">
        <p class="label">useEffect runs when color or size changes</p>
        <div class="box" style="background:${color};width:${size}px;height:${size}px;"></div>
        <p class="size-readout">${size}px</p>
        <div class="actions">
          <button type="button" class="btn" id="bigger">Make bigger</button>
          <button type="button" class="btn accent" id="shuffle">Random color</button>
        </div>
      </div>
    `;
  }

  effects() {
    useEffect(() => {
      const box = this.select('.box');
      if (box) {
        box.classList.remove('pulse');
        void box.offsetWidth;
        box.classList.add('pulse');
      }
    }, ['box-color', 'box-size']);
  }

  onMount() {
    this.listener('#bigger', 'click', () => {
      updateState('box-size', (s) => Number(s) + 20);
    });
    this.listener('#shuffle', 'click', () => {
      const palette = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#0ea5e9'];
      updateState('box-color', palette[Math.floor(Math.random() * palette.length)]);
    });
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
          max-width: 320px;
        }
        .label { margin: 0 0 16px; font-size: 13px; color: #64748b; font-weight: 600; }
        .box {
          border-radius: 14px;
          margin-bottom: 10px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
        .box.pulse { animation: box-pulse 0.35s ease; }
        @keyframes box-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .size-readout { margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #475569; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn {
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #0f172a;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn.accent { background: #4f46e5; border-color: #4f46e5; color: #fff; }
        .btn.accent:hover { background: #4338ca; }
      </style>
    `;
  }
}
```

#### Example — fetch with dependency array (no infinite loop)

`fetchData()` is called **at the top** of the effect. The **`return`** is **only** for cleanup (unsubscribe + clear timer).

`['activeRoute']` is in the deps — **not** `quote-loading` or `quote-data`. So when fetch finishes, `static useState` redraws the loader/quote without re-firing this effect in a loop.

```javascript title:screens/QuoteScreen.js
import { SwitchComponent, createState, getState, updateState, useEffect } from 'switch-framework';
import { getActiveRoute, useRouteChangesSubscriber } from 'switch-framework/router';

export class QuoteScreen extends SwitchComponent {
  static screenName = 'quotes';
  static path = '/quotes';
  static tag = 'sw-quotes-screen';

  static {
    createState('quote-data', null);
    createState('quote-loading', false);
    this.useState('quote-data');
    this.useState('quote-loading');
  }

  effects() {
    useEffect(() => {
      this.fetchData();

      const unsub = useRouteChangesSubscriber(() => {
        if (getActiveRoute() === this.constructor.screenName) {
          this.fetchData();
        }
      });

      return () => {
        unsub();
        if (this._fetchTimer) clearTimeout(this._fetchTimer);
      };
    }, ['activeRoute']);
  }

  render() {
    const loading = !!getState('quote-loading');
    const data = getState('quote-data');

    const body = loading
      ? `<div class="loader"><span class="spinner"></span><p>Loading…</p></div>`
      : !data
        ? `<p class="empty">No quote yet</p>`
        : `<blockquote class="quote"><p>"${data.text}"</p><cite>— ${data.author}</cite></blockquote>`;

    return `
      <div class="card">
        ${body}
        <button type="button" class="btn" id="fetch">Fetch</button>
      </div>
    `;
  }

  onMount() {
    this.listener('#fetch', 'click', () => this.fetchData());
  }

  fetchData() {
    if (this._fetchTimer) clearTimeout(this._fetchTimer);

    updateState('quote-loading', true);

    this._fetchTimer = setTimeout(() => {
      this._fetchTimer = null;
      updateState('quote-data', {
        text: 'Stay hungry, stay foolish.',
        author: 'Steve Jobs'
      });
      updateState('quote-loading', false);
    }, 800);
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        .card { padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #fff; max-width: 360px; }
        .loader { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px; margin-bottom: 16px; background: #f8fafc; border-radius: 12px; }
        .spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty { margin: 0 0 16px; color: #64748b; text-align: center; }
        .quote { margin: 0 0 16px; padding: 16px; border-radius: 12px; background: #eef2ff; border-left: 4px solid #4f46e5; }
        .quote p { margin: 0 0 8px; color: #0f172a; }
        .quote cite { color: #6366f1; font-weight: 700; font-style: normal; font-size: 13px; }
        .btn { border: none; border-radius: 10px; padding: 10px 18px; background: #4f46e5; color: #fff; font-weight: 700; cursor: pointer; }
      </style>
    `;
  }
}
```

Why the loader goes away after fetch:

1. `fetchData()` sets `quote-loading` to `true` → `static useState` redraws → spinner shows
2. After 800ms it sets `quote-data` and `quote-loading: false` → `static useState` redraws again → quote shows
3. Those keys are **not** in `['activeRoute']`, so the effect does **not** loop

```javascript
useEffect(() => {
  this.fetchData(); // ← fetch runs here

  const unsub = useRouteChangesSubscriber(/* ... */);

  return () => {
    unsub(); // ← return is cleanup only
    if (this._fetchTimer) clearTimeout(this._fetchTimer);
  };
}, ['activeRoute']); // ← NOT quote-loading or quote-data
```

### useRef — scroll control for FlatList

FlatList has **scroll methods**. Get a ref with `useRef(this)` inside `onMount`, then call methods on it.

```javascript
const listRef = useRef(this);
listRef.scrollToEnd({ animated: true });
```

#### FlatList — scroll with useRef

```javascript title:components/SimpleList.js
import { FlatList, createState, useRef } from 'switch-framework';

export class SimpleList extends FlatList {
  static tag = 'sw-simple-list';
  static dataState = 'sw-simple-list-data';

  static {
    createState('sw-simple-list-data', [
      { id: 1, text: 'Apple' },
      { id: 2, text: 'Banana' },
      { id: 3, text: 'Cherry' },
      { id: 4, text: 'Date' },
      { id: 5, text: 'Elderberry' }
    ]);
    this.useState('sw-simple-list-data');
  }

  renderHeader() {
    return `<button type="button" class="scroll-btn" id="scroll-end">Jump to end</button>`;
  }

  renderItem({ item }) {
    return `<div class="row"><span class="dot"></span>${item.text}</div>`;
  }

  keyExtractor(item) {
    return String(item.id);
  }

  onMount() {
    const listRef = useRef(this);

    this.listener('#scroll-end', 'click', () => {
      listRef.scrollToEnd({ animated: true });
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          height: 280px;
          font-family: system-ui, sans-serif;
        }
        .scroll-btn {
          margin-bottom: 10px;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          background: #4f46e5;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        .scroll-btn:hover { background: #4338ca; }
        flatlist {
          height: calc(100% - 44px);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
        }
        .row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #0f172a;
          font-weight: 600;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          flex-shrink: 0;
        }
      </style>
    `;
  }
}
```

No `super.onMount()` — FlatList sets itself up automatically.

#### FlatList ref methods

```params-table
{"headers":["Method","Parameters","Description"],"htmlColumns":[0,1,2],"rows":[["<code>scrollToIndex</code>","<code>{ index, animated?, viewOffset?, viewPosition? }</code>","Scroll to one item by its index"],["<code>scrollToEnd</code>","<code>{ animated? }</code>","Scroll to the last item"],["<code>scrollToOffset</code>","<code>{ offset, animated? }</code>","Scroll to a pixel position"],["<code>scrollBy</code>","<code>{ x?, y?, animated? }</code>","Scroll by a number of pixels"],["<code>flashScrollIndicators</code>","none","Briefly show the scrollbars"]]}
```

#### Static useRef (advanced)

You can also register a ref on the class:

```javascript
static { this.useRef('myListRef', 'flatlist'); }
```

That sets `this.constructor.myListRef` on mount. Most apps should use **`useRef(this)` in `onMount`** — it is clearer.

### Action states — trigger scroll from anywhere

FlatList exposes **action keys**. Bump or set them with `updateState` from **any file** — no ref needed.

```javascript
import { updateState } from 'switch-framework';

updateState('sw-simple-list-action-scroll-end', (n) => (n ?? 0) + 1);
updateState('sw-simple-list-action-scroll-index', { index: 2, animated: true });
```

Think of it like pressing a **remote button** that the list is already listening for.

### Quick reference

```params-table
{"headers":["Hook","Where","What it does"],"htmlColumns":[0,1,2],"rows":[["<code>useState(initial)</code>","<code>render()</code>","Local instance state — returns [value, setter], rerenders only this component"],["<code>useShared(key, default?)</code>","<code>render()</code>","Subscribe to global state — returns [value, setter], rerenders on change. If <code>onState</code> is also called for the same key, <code>onState</code> wins and no rerender fires."],["<code>onState(key, fn)</code>","<code>onMount()</code>","Callback on global state change — no rerender, patches existing DOM. Cancels any <code>useShared</code> rerender subscription for the same key."],["<code>createState</code>","<code>static {}</code> or app startup","Creates a shared value"],["<code>getState</code> / <code>updateState</code>","Anywhere","Read or change a shared value"],["<code>static { this.useState('key') }</code>","Class <code>static {}</code>","Redraw component when key changes (classic API)"],["<code>useState('key', callback)</code>","<code>onMount</code>","DOM tweaks on change — no rerender (deprecated, prefer onState)"],["<code>useEffect(fn, deps)</code>","<code>effects()</code>","Watch keys, run side effects, optional cleanup return"],["<code>useScreenFocus(fn)</code>","<code>effects()</code>","Run when this screen is the active route (keep-alive safe)"],["<code>useRef(this)</code>","<code>onMount</code>","FlatList scroll methods (scrollToEnd, scrollToIndex, etc.)"],["<code>this.listener()</code>","<code>onMount</code>","Attach click/input handlers"],["<code>this.addOnDestroy(fn)</code>","<code>onMount</code>","Clean up when component is removed"]]}
```

### Remember

- **`useState(initial)`** and **`useShared(key)`** go in **`render()`** — call them in the same order every render.
- Store setters on `this` (`this._setX = setX`) so `onMount` handlers and async methods can call them.
- **`onState`** goes in **`onMount()`** — subscriptions are deduped per key, safe to call on every rerender.
- **One strategy per key:** use `useShared` (rerender) or `onState` (callback) for a given key — not both. If you call both, `onState` wins and cancels the rerender.
- **`useEffect`** goes in **`effects()`** — `onMount` is for `listener()`, `useRef(this)`, and `onState()`
- **`[]` deps** = run once. Do **not** put states you update inside the effect into the same deps array
- **Fetch / loader** → `fetchData()` updates state; reactive hooks rerender the component. Effect deps = `['activeRoute']`, not the loading/data keys
- **FlatList** — no `super.onMount()`. Use `useRef(this)` or action states to scroll
