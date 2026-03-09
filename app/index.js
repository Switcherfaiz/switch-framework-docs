import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'index',
  path: '/',
  title: 'Welcome',
  tag: 'sw-index-screen',
  layout: 'stack'
};

export class SwIndexScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    const getStarted = this.shadowRoot.querySelector('#get_started');
    const talkToUs = this.shadowRoot.querySelector('#talk_to_us');
    
    if (getStarted) {
      getStarted.addEventListener('click', () => {
        const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
        if (typeof navigate === 'function') navigate('/docs');
      });
    }

    if (talkToUs) {
      talkToUs.addEventListener('click', () => {
        console.log('Talk to us clicked');
      });
    }
  }

  render() {
    const codeData = {
      title: 'app.js',
      language: 'javascript',
      code: `import { Button } from '@switch/ui';

// A clean, accessible button component
export default function ActionCenter() {
  return (
    <Button 
      variant="primary" 
      size="lg"
      onClick={() => dispatch('INITIALIZE')}
    >
      Deploy Application
    </Button>
  );
}`
    };

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="wrap">
        <sw-topbar></sw-topbar>

        <main class="main">
          <section class="hero">
            <div class="bg-blob blob-1"></div>
            <div class="bg-blob blob-2"></div>
            <div class="bg-blob blob-3"></div>
            
            <div class="hero-content">
              <div class="badge">
                <span class="badge-new">New</span>
                <span class="badge-text">Introducing: Switch Agent</span>
                <svg class="badge-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <h1 class="hero-title">
                Build faster with<br class="desktop-break"/>
                <span class="hero-title-highlight">Switch Framework</span>
              </h1>

              <p class="hero-subtitle">
                Transform your documentation into a connected knowledge system — one that learns, optimizes, and improves itself intelligently
              </p>

              <div class="hero-actions">
                <button id="get_started" class="btn-primary">
                  Start for free
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button id="talk_to_us" class="btn-secondary">Talk to us</button>
              </div>

              <div class="command-line">
                <div class="command-prompt">
                  <span class="prompt-symbol">❯</span>
                </div>
                <code class="command-text">npx create-switch-framework-app my-app</code>
                <button class="copy-btn" aria-label="Copy to clipboard">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="hero-visual">
              <div class="browser-window">
                <div class="browser-header">
                  <div class="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div class="browser-content">
                  <div class="browser-sidebar">
                    <div class="sidebar-item"></div>
                    <div class="sidebar-item small"></div>
                    <div class="sidebar-item medium"></div>
                  </div>
                  <div class="browser-main">
                    <h4 class="content-title">Welcome to Switch</h4>
                    <sw-codeblock data="${encodeData(codeData)}"></sw-codeblock>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="features-section">
            <div class="features-header">
              <div class="features-header-content">
                <h2 class="section-label">Why Switch Framework?</h2>
                <h3 class="section-title">Everything you need to build great apps.</h3>
              </div>
              <a href="#" class="explore-link">
                Explore all features
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

            <div class="features-grid">
              ${this.renderFeatureCard('accessibility_new', 'Accessible by default', 'Built with WAI-ARIA patterns for maximum accessibility. Screen reader support and keyboard navigation right out of the box.', '#3b82f6')}
              ${this.renderFeatureCard('palette', 'Themable', 'Easily customize the look and feel with CSS variables or Tailwind utility classes. Supports dark mode natively.', '#a855f7')}
              ${this.renderFeatureCard('bolt', 'Lightweight', 'Zero runtime overhead. Components are tree-shakeable so you only ship what you actually use.', '#14b8a6')}
              ${this.renderFeatureCard('data_object', 'Type Safe', 'Written in TypeScript with extensive type definitions. Get autocomplete and validation in your IDE.', '#6366f1')}
              ${this.renderFeatureCard('devices', 'Responsive', 'Designed for every screen size. Mobile-first architecture ensures your UI looks perfect on phones, tablets, and desktops.', '#ec4899')}
              ${this.renderFeatureCard('communities', 'Community Driven', 'Open source and backed by a vibrant community. Regular updates, extensive docs, and active support channels.', '#f97316')}
            </div>
          </section>

          <section class="trusted-section">
            <p class="trusted-label">Trusted by development teams at</p>
            <div class="trusted-logos">
              <div class="logo-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor"/>
                </svg>
                ACME Corp
              </div>
              <div class="logo-item mono">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                </svg>
                Globex
              </div>
              <div class="logo-item serif">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="2"/>
                </svg>
                Soylent
              </div>
              <div class="logo-item condensed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                </svg>
                Massive Dynamic
              </div>
              <div class="logo-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
                </svg>
                Initech
              </div>
            </div>
          </section>

          <section class="cta-section">
            <div class="cta-card">
              <div class="cta-blob cta-blob-1"></div>
              <div class="cta-blob cta-blob-2"></div>
              <div class="cta-content">
                <h2 class="cta-title">Ready to start building?</h2>
                <p class="cta-subtitle">Join thousands of developers building the future with Switch Framework today.</p>
                <div class="cta-actions">
                  <button class="cta-btn-primary">Get Started Now</button>
                  <button class="cta-btn-secondary">Read Documentation</button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer class="footer">
          <div class="footer-content">
            <div class="footer-grid">
              <div class="footer-brand">
                <div class="footer-logo">
                  <div class="footer-logo-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7H7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13H17C18.6569 13 20 14.3431 20 16C20 17.6569 18.6569 19 17 19H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="7" cy="10" r="2" fill="currentColor"/>
                      <circle cx="17" cy="16" r="2" fill="currentColor"/>
                    </svg>
                  </div>
                  <span class="footer-logo-text">Switch Framework</span>
                </div>
                <p class="footer-description">
                  Making web development easier, faster, and more accessible for everyone. Open source and MIT licensed.
                </p>
                <div class="footer-social">
                  <a href="#" class="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                  <a href="#" class="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                  <a href="#" class="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="5" cy="19" r="1" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div class="footer-column">
                <h4 class="footer-column-title">Product</h4>
                <ul class="footer-links">
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Components</a></li>
                  <li><a href="#">Resources</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>

              <div class="footer-column">
                <h4 class="footer-column-title">Resources</h4>
                <ul class="footer-links">
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Examples</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href="#">Help Center</a></li>
                </ul>
              </div>

              <div class="footer-column">
                <h4 class="footer-column-title">Legal</h4>
                <ul class="footer-links">
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">License</a></li>
                </ul>
              </div>
            </div>

            <div class="footer-bottom">
              <p class="footer-copyright">© 2024 Switch Framework. All rights reserved.</p>
              <div class="footer-status">
                <span class="status-dot"></span>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  renderFeatureCard(icon, title, description, color) {
    return `
      <div class="feature-card">
        <div class="feature-icon" style="background: ${color}15; color: ${color};">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${this.getIconPath(icon)}
          </svg>
        </div>
        <h4 class="feature-title">${title}</h4>
        <p class="feature-description">${description}</p>
      </div>
    `;
  }

  getIconPath(icon) {
    const icons = {
      'accessibility_new': '<path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 7l4 13M16 7l-4 13M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      'palette': '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="currentColor" stroke-width="2"/>',
      'bolt': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      'data_object': '<path d="M16 3h3v18h-3M8 3H5v18h3M12 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      'devices': '<rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      'communities': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    return icons[icon] || '';
  }

  styleSheet() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          font-family: 'Montserrat', sans-serif;
          background: #ffffff;
          color: #111827;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .wrap {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Hero Section */
        .hero {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 40px 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(247, 248, 250, 0) 0%, rgba(247, 248, 250, 0.5) 100%);
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          pointer-events: none;
        }

        .blob-1 {
          width: 800px;
          height: 800px;
          background: #3713ec;
          bottom: -200px;
          right: -200px;
        }

        .blob-2 {
          width: 600px;
          height: 600px;
          background: #3713ec;
          top: 50%;
          left: -200px;
          opacity: 0.05;
        }

        .blob-3 {
          width: 500px;
          height: 300px;
          background: #3713ec;
          top: 160px;
          right: 25%;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1000px;
          width: 100%;
          margin-bottom: 48px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: rgba(55, 19, 236, 0.1);
          border: 1px solid rgba(55, 19, 236, 0.2);
          border-radius: 9999px;
          margin-bottom: 32px;
        }

        .badge-new {
          background: #f97316;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .badge-text {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .badge-arrow {
          color: #9ca3af;
        }

        .hero-title {
          font-size: 80px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #111827;
          margin-bottom: 24px;
        }

        .desktop-break {
          display: none;
        }

        .hero-title-highlight {
          color: #3713ec;
        }

        .hero-subtitle {
          font-size: 20px;
          font-weight: 400;
          line-height: 1.6;
          color: #6b7280;
          max-width: 800px;
          margin: 0 auto 40px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 48px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          height: 48px;
          background: #111827;
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
          background: #000000;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 12px 32px;
          height: 48px;
          background: #f3f4f6;
          color: #111827;
          border: none;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .command-line {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 4px 16px 4px 4px;
          background: #111827;
          border: 1px solid #374151;
          border-radius: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          margin-bottom: 48px;
          max-width: 100%;
          overflow: hidden;
        }

        .command-prompt {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-right: 1px solid #374151;
        }

        .prompt-symbol {
          color: #3713ec;
          font-family: monospace;
          font-size: 16px;
        }

        .command-text {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 14px;
          color: #f3f4f6;
          padding: 8px 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-btn {
          margin-left: auto;
          padding: 6px;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .hero-visual {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1000px;
        }

        .browser-window {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          aspect-ratio: 16 / 9;
        }

        .browser-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          height: 40px;
        }

        .browser-dots {
          display: flex;
          gap: 6px;
        }

        .browser-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d1d5db;
        }

        .browser-content {
          display: flex;
          height: calc(100% - 40px);
        }

        .browser-sidebar {
          width: 256px;
          padding: 16px;
          border-right: 1px solid #e5e7eb;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-item {
          height: 12px;
          background: #f3f4f6;
          border-radius: 4px;
        }

        .sidebar-item.small {
          width: 80%;
        }

        .sidebar-item.medium {
          width: 85%;
        }

        .browser-main {
          flex: 1;
          padding: 32px;
          background: white;
          overflow: hidden;
        }

        .content-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        /* Features Section */
        .features-section {
          width: 100%;
          max-width: 1200px;
          padding: 80px 40px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .features-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
        }

        .features-header-content {
          max-width: 600px;
        }

        .section-label {
          color: #3713ec;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .section-title {
          font-size: 40px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .explore-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .explore-link:hover {
          color: #3713ec;
        }

        .explore-link svg {
          transition: transform 0.2s;
        }

        .explore-link:hover svg {
          transform: translateX(4px);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          padding: 24px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: white;
          box-shadow: 0 10px 30px rgba(55, 19, 236, 0.05);
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: transform 0.3s;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .feature-description {
          font-size: 16px;
          line-height: 1.6;
          color: #6b7280;
        }

        /* Trusted Section */
        .trusted-section {
          width: 100%;
          max-width: 1200px;
          padding: 80px 40px;
        }

        .trusted-label {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 32px;
        }

        .trusted-logos {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 48px;
          opacity: 0.6;
          filter: grayscale(100%);
          transition: all 0.5s;
        }

        .trusted-logos:hover {
          opacity: 1;
          filter: grayscale(0%);
        }

        .logo-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #111827;
          font-size: 20px;
          font-weight: 900;
        }

        .logo-item.mono {
          font-family: 'Courier New', monospace;
        }

        .logo-item.serif {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 700;
        }

        .logo-item.condensed {
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        /* CTA Section */
        .cta-section {
          width: 100%;
          max-width: 1200px;
          padding: 80px 40px;
        }

        .cta-card {
          position: relative;
          background: #3713ec;
          border-radius: 24px;
          padding: 64px 48px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(55, 19, 236, 0.3);
        }

        .cta-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }

        .cta-blob-1 {
          width: 256px;
          height: 256px;
          background: rgba(255, 255, 255, 0.1);
          top: -128px;
          left: -128px;
        }

        .cta-blob-2 {
          width: 384px;
          height: 384px;
          background: rgba(99, 102, 241, 0.2);
          bottom: -192px;
          right: -192px;
        }

        .cta-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .cta-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
        }

        .cta-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .cta-btn-primary {
          padding: 14px 32px;
          background: white;
          color: #3713ec;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .cta-btn-primary:hover {
          background: #f9fafb;
        }

        .cta-btn-secondary {
          padding: 14px 32px;
          background: rgba(99, 102, 241, 1);
          color: white;
          border: 1px solid rgba(147, 197, 253, 0.3);
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-btn-secondary:hover {
          background: rgba(79, 70, 229, 1);
        }

        /* Footer */
        .footer {
          width: 100%;
          border-top: 1px solid #e5e7eb;
          background: white;
          padding: 64px 0;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand {
          max-width: 320px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .footer-logo-icon {
          width: 24px;
          height: 24px;
          background: #3713ec;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .footer-description {
          font-size: 14px;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .footer-social {
          display: flex;
          gap: 16px;
        }

        .social-link {
          color: #9ca3af;
          transition: color 0.2s;
        }

        .social-link:hover {
          color: #3713ec;
        }

        .footer-column-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-links a {
          font-size: 14px;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #3713ec;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 32px;
          border-top: 1px solid #e5e7eb;
        }

        .footer-copyright {
          font-size: 14px;
          color: #6b7280;
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .desktop-break {
            display: block;
          }
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: 56px;
          }

          .browser-sidebar {
            display: none;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 24px 120px;
          }

          .hero-title {
            font-size: 40px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .command-line {
            width: 100%;
          }

          .features-section,
          .trusted-section,
          .cta-section {
            padding: 60px 24px;
          }

          .section-title {
            font-size: 32px;
          }

          .features-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }

          .cta-card {
            padding: 48px 24px;
          }

          .cta-title {
            font-size: 32px;
          }

          .cta-actions {
            flex-direction: column;
            width: 100%;
          }

          .cta-btn-primary,
          .cta-btn-secondary {
            width: 100%;
          }

          .footer-content {
            padding: 0 24px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .browser-window {
            aspect-ratio: 1 / 1;
          }

          .browser-main {
            padding: 16px;
          }

          .content-title {
            font-size: 18px;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-index-screen')) {
  customElements.define('sw-index-screen', SwIndexScreen);
}