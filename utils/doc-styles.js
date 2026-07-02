export const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; width: 100%; }
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
      padding: 16px;
      max-width: 100%;
    }
    .doc-mount.is-loading {
      min-height: min(75vh, calc(100dvh - 120px));
      padding: 16px;
    }
  }
  .doc-load-error {
    color: var(--sub_text);
    font-size: 15px;
    text-align: center;
    padding: 48px 24px;
  }
  sw-codeblock, sw-docs-params-table, sw-live-code-preview {
    display: block;
    margin: 16px 0 24px;
  }
`;
