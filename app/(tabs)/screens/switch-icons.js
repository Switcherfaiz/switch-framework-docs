import { SwitchComponent, encodeData } from '/switch-framework/index.js';

const DOC_STYLES = `
  :host { display: block; width: 100%; font-family: 'Montserrat', sans-serif; }
  * { box-sizing: border-box; }
  .doc-section { padding: 32px; max-width: 900px; margin: 0 auto; }
  .section-title { font-size: 32px; font-weight: 800; color: var(--main_text); margin: 0 0 16px; letter-spacing: -0.02em; }
  .section-desc { font-size: 15px; line-height: 1.7; color: var(--sub_text); margin: 0 0 20px; }
  .subsection { font-size: 18px; font-weight: 700; color: var(--main_text); margin: 28px 0 12px; }
  .feature-list { list-style: none; padding: 0; margin: 16px 0; }
  .feature-list li { font-size: 14px; line-height: 1.6; color: var(--sub_text); padding-left: 20px; position: relative; margin-bottom: 8px; }
  .feature-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }
  code { background: var(--surface_2); padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', monospace; font-size: 13px; color: var(--main_text); }
  .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin: 24px 0; }
  .icon-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--surface_2); border-radius: 8px; }
  .icon-item span:first-child { font-size: 28px; color: var(--main_text); }
  .icon-item code { font-size: 11px; word-break: break-all; text-align: center; }
`;

export class SwDocsSwitchIconsScreen extends SwitchComponent {
  static screenName = 'docs/switch-icons';
  static path = '/docs/switch-icons';
  static title = 'Switch Icons';
  static tag = 'sw-docs-switch-icons-screen';
  static layout = 'tabs';

  render() {
    const commonIcons = [
      { name: 'switch_icon_github', label: 'GitHub' },
      { name: 'switch_icon_chevron_right', label: 'Chevron right' },
      { name: 'switch_icon_house', label: 'House / Home' },
      { name: 'switch_icon_gear', label: 'Gear / Settings' },
      { name: 'switch_icon_description', label: 'Description / Docs' },
      { name: 'switch_icon_compass', label: 'Compass' },
      { name: 'switch_icon_check', label: 'Check' },
      { name: 'switch_icon_code', label: 'Code' },
      { name: 'switch_icon_angle_right', label: 'Angle right' },
      { name: 'switch_icon_arrow_right', label: 'Arrow right' }
    ];

    return `
      <div class="doc-section">
        <h2 class="section-title" id="overview">Switch Icons</h2>
        <p class="section-desc">
          Switch Framework includes an icon font from <code>/assets/icons/style.css</code>. Icons are used via CSS classes in the format <code>switch_icon_&lt;name&gt;</code>. Import the stylesheet and use a <code>&lt;span&gt;</code> with the icon class.
        </p>
        <h3 class="subsection" id="usage">Usage</h3>
        <p class="section-desc">
          Import the icon stylesheet in your component's <code>styleSheet()</code>, then add a span with the icon class:
        </p>
        <sw-codeblock data="${encodeData({
          title: 'Using Switch Icons',
          language: 'html',
          code: `@import '/assets/icons/style.css';

/* In your template: */
<span class="switch_icon_github"></span>
<span class="switch_icon_chevron_right"></span>`
        })}"></sw-codeblock>
        <h3 class="subsection" id="common-icons">Common Icons</h3>
        <p class="section-desc">
          A selection of frequently used icons in the docs and framework:
        </p>
        <div class="icon-grid">
          ${commonIcons.map(({ name, label }) => `
            <div class="icon-item">
              <span class="${name}"></span>
              <code>${name}</code>
            </div>
          `).join('')}
        </div>
        <p class="section-desc">
          The icon font includes hundreds of icons. Browse <code>/assets/icons/style.css</code> for the full list of available <code>switch_icon_*</code> classes.
        </p>
        <sw-docs-pagination></sw-docs-pagination>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';
        ${DOC_STYLES}
      </style>
    `;
  }
}
