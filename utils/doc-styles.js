export const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: var(--font); color: var(--main_text); }
  * { box-sizing: border-box; }
  .doc-section {
    padding: 36px 40px 80px;
    max-width: 820px;
    margin: 0 auto;
    width: 100%;
  }
  .doc-page-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
  .doc-section:has(.doc-mount.is-loading) .doc-page-toolbar {
    visibility: hidden;
    pointer-events: none;
    height: 0;
    margin: 0;
    overflow: hidden;
  }
  .doc-mount {
    min-height: 0;
    width: 100%;
    max-width: 100%;
  }
  .doc-mount.is-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: min(60vh, calc(100dvh - 220px));
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 24px 16px;
    box-sizing: border-box;
  }
  .doc-mount.is-loading sw-doc-loader {
    display: flex;
    width: 100%;
    max-width: 100%;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 768px) {
    .doc-section {
      padding: 20px 18px 64px;
      max-width: 100%;
    }
    .doc-mount.is-loading {
      min-height: min(75vh, calc(100dvh - 120px));
      padding: 16px;
    }
  }
  .doc-load-error {
    color: var(--sub_text);
    font-size: 16px;
    text-align: center;
    padding: 48px 24px;
  }
  sw-codeblock, sw-docs-params-table, sw-live-code-preview, sw-doc-callout, sw-doc-divider {
    display: block;
    margin: 16px 0 24px;
  }
`;

export const SITE_PAGE_STYLES = `
  :host {
    display: block;
    width: 100%;
    min-height: 100vh;
    font-family: var(--font);
    color: var(--main_text);
    background: var(--page_background);
  }
  * { box-sizing: border-box; }
  .site-wrap { display: flex; flex-direction: column; min-height: 100vh; }
  .site-header { position: sticky; top: 0; z-index: 100; flex-shrink: 0; }
  .site-main { flex: 1; overflow-y: auto; padding: 56px 24px 0; }
  .site-section { max-width: 760px; margin: 0 auto; padding-bottom: 24px; }
  .site-kicker {
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--primary);
    margin: 0 0 10px;
  }
  .site-title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    letter-spacing: -0.035em;
    color: var(--main_text);
    margin: 0 0 16px;
    line-height: 1.15;
  }
  .site-desc {
    font-size: 16px;
    line-height: 1.75;
    color: var(--sub_text);
    margin: 0 0 18px;
  }
  .site-desc a, .site-h2 + .site-desc a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
  }
  .site-desc a:hover { text-decoration: underline; }
  .site-h2 {
    font-size: 20px;
    font-weight: 650;
    color: var(--main_text);
    margin: 32px 0 12px;
    letter-spacing: -0.02em;
  }
  .license-text {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--sub_text);
    background: var(--surface_1);
    border: 1px solid var(--border_color);
    padding: 24px;
    border-radius: 12px;
    overflow-x: auto;
    white-space: pre-wrap;
  }
`;
