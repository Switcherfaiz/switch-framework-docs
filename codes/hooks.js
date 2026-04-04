export const hooksUseStateCode = {
  title: 'useState',
  language: 'javascript',
  code: `const [value, unsub] = useState('my-state', (newValue) => {
  // Runs when state changes
  this._renderToShadow();
});
// Call unsub() in disconnected()`
};

export const hooksUseEffectCode = {
  title: 'useEffect',
  language: 'javascript',
  code: `connected() {
  this.useEffect(() => this._renderToShadow(), ['activeRoute', 'routeParams']);
}`
};
