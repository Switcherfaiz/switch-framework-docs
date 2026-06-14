export async function copyText(text) {
  const value = String(text ?? '');
  if (!value) return false;

  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      /* fall through to execCommand */
    }
  }

  return copyTextFallback(value);
}

/** Sync fallback — use inside click handlers when async clipboard fails on mobile. */
export function copyTextSync(text) {
  const value = String(text ?? '');
  if (!value) return false;
  return copyTextFallback(value);
}

function copyTextFallback(value) {
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('aria-hidden', 'true');
  ta.setAttribute('tabindex', '-1');
  Object.assign(ta.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '0',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    background: 'transparent',
    opacity: '0',
    fontSize: '16px',
    zIndex: '-1',
  });

  document.body.appendChild(ta);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    const range = document.createRange();
    range.selectNodeContents(ta);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    ta.setSelectionRange(0, value.length);
  } else {
    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, value.length);
  }

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }

  document.body.removeChild(ta);
  return ok;
}
