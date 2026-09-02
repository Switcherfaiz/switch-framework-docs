export const hooksUseStateCode = {
  title: 'useState (React-style)',
  language: 'javascript',
  code: `render() {
  const [count, setCount] = useState(0);
  this._setCount = setCount;   // expose for onMount handlers
  return \`<button id="inc">Count: \${count}</button>\`;
}

onMount() {
  this.listener('#inc', 'click', () => this._setCount(n => n + 1));
}`
};

export const hooksUseSharedCode = {
  title: 'useShared',
  language: 'javascript',
  code: `render() {
  const [pins, setPins] = useShared('pins', []);
  this._setPins = setPins;
  return pins.map(p => \`<tw-pin-card data="\${createProps(p)}"></tw-pin-card>\`).join('');
}`
};

export const hooksOnStateCode = {
  title: 'onState',
  language: 'javascript',
  code: `onMount() {
  // Patch DOM without triggering a full rerender
  onState('liked', (liked) => {
    const heart = this.select('.heart');
    if (!heart) return;
    heart.classList.remove('pop');
    void heart.offsetWidth;
    heart.classList.add('pop');
  });
}`
};

export const hooksUseStateCallbackCode = {
  title: 'useState with callback (deprecated)',
  language: 'javascript',
  code: `// Deprecated — prefer onState() instead
const [value, unsub] = useState('my-state', (newValue) => {
  // Fine-grained DOM update, no rerender
});
this.addOnDestroy(unsub);`
};

export const hooksUseEffectCode = {
  title: 'useEffect',
  language: 'javascript',
  code: `effects() {
  useEffect(() => {
    // runs on mount and when deps change
    return () => { /* cleanup */ };
  }, ['activeRoute']);
}`
};
