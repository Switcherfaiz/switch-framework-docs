import { replace } from 'switch-framework/router';

export function normalizeDocRoute(route) {
  return String(route || '').replace(/^\//, '').replace(/\/$/, '');
}

export function isDocRoute(route) {
  const r = normalizeDocRoute(route);
  return r === 'docs' || r.startsWith('docs/');
}

/** Navigate to a docs route using router replace (no history stack noise). */
export function navigateDoc(route, params = {}) {
  const normalized = normalizeDocRoute(route);
  const target = normalized === 'docs' ? 'docs/introduction' : normalized;
  return replace(target, params);
}
