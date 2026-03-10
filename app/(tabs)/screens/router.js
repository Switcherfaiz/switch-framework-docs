import { encodeData } from '/switch-framework/index.js';

export const screen = {
  name: 'router',
  path: '/docs/router',
  title: 'Router',
  tag: 'sw-router-screen',
  layout: 'tabs'
};

export class SwRouterScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="container">
        <h1>Router</h1>
        <p class="description">
          The Switch Framework router provides powerful client-side routing with support for static and dynamic routes, 
          parameter extraction, and navigation controls.
        </p>

        <section>
          <h2>Route Prioritization</h2>
          <p>
            Static routes are prioritized over dynamic routes to ensure predictable behavior. 
            For example, <code>/home/create</code> will match before <code>/home/:id</code>.
          </p>
          <div class="example">
            <h3>Example Route Registration</h3>
            <code-block data="${encodeData(`
// Static route - higher priority
export const screen = {
  name: 'homecreate',
  path: '/home/create',
  title: 'Create',
  tag: 'tw-homecreate-screen',
  layout: 'tabs'
};

// Dynamic route - lower priority
export const tab = {
  name: 'home',
  path: '/home/:id',
  title: 'Home',
  icon: 'home'
};
            `)}"></code-block>
          </div>
        </section>

        <section>
          <h2>Route Parameters</h2>
          <p>
            Use the <code>useParams()</code> hook to access route parameters (<code>:id</code> style) 
            and <code>useSearchParams()</code> for query parameters (<code>?key=value</code> style).
          </p>
          <div class="example">
            <h3>Using Route Parameters</h3>
            <code-block data="${encodeData(`
import { useParams, useSearchParams } from 'switch-framework/router';

export class UserProfileScreen extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    // Get route parameters (:id)
    const params = useParams();
    const userId = params.id;
    
    // Get search parameters (?tab=settings)
    const searchParams = useSearchParams();
    const activeTab = searchParams.tab;

    this.innerHTML = \`
      <div>
        <h1>User Profile: \${userId}</h1>
        <div>Active Tab: \${activeTab || 'profile'}</div>
      </div>
    \`;
  }
}
            `)}"></code-block>
          </div>
        </section>

        <section>
          <h2>Navigation Functions</h2>
          <p>
            Import navigation functions from <code>switch-framework/router</code> to handle programmatic navigation.
          </p>
          <div class="example">
            <h3>Navigation Examples</h3>
            <code-block data="${encodeData(`
import { navigate, goBack, redirect, replace, reload } from 'switch-framework/router';

// Navigate to a new route
navigate('/user/123');

// Go back to previous route
goBack();

// Redirect to another route
redirect('/login');

// Replace current route in history
replace('/dashboard');

// Reload the current page
reload();
            `)}"></code-block>
          </div>
        </section>

        <section>
          <h2>Screen Registration</h2>
          <p>
            Register your screens in the <code>routes.js</code> file and import them in <code>register.js</code>.
          </p>
          <div class="example">
            <h3>Route Registration</h3>
            <code-block data="${encodeData(`
// app/routes.js
import { screen as home } from './(tabs)/home/index.js';
import { screen as homecreate } from './(tabs)/homecreate/homecreate.js';

export const screens = [home, homecreate];

// app/register.js
export async function appRegisters() {
  await Promise.all([
    import('./(tabs)/home/index.js'),
    import('./(tabs)/homecreate/homecreate.js')
  ]);
}
            `)}"></code-block>
          </div>
        </section>

        <section>
          <h2>Route Matching</h2>
          <p>
            The router automatically sorts routes by specificity - routes with fewer dynamic segments 
            have higher priority. This ensures that more specific routes match before general ones.
          </p>
          <div class="example">
            <h3>Route Priority Order</h3>
            <ol>
              <li><code>/home/create</code> (static - highest priority)</li>
              <li><code>/home/:id</code> (dynamic with 1 parameter)</li>
              <li><code>/user/:id/profile</code> (dynamic with 1 parameter, longer path)</li>
              <li><code>/user/:id/:action</code> (dynamic with 2 parameters - lowest priority)</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>Layout Integration</h2>
          <p>
            Routes can be integrated with different layouts like <code>Stack</code> and <code>Tabs</code>.
          </p>
          <div class="example">
            <h3>Layout Configuration</h3>
            <code-block data="${encodeData(`
import { Tabs, Stack } from 'switch-framework/router';

// Tabs layout
export const tab = {
  name: 'home',
  path: '/home/:id',
  title: 'Home',
  icon: 'home'
};

// Stack layout
export const screen = {
  name: 'profile',
  path: '/profile/:id',
  title: 'Profile',
  tag: 'tw-profile-screen',
  layout: 'stack'
};
            `)}"></code-block>
          </div>
        </section>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
        }

        * {
          box-sizing: border-box;
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }

        h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .description {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        section {
          margin-bottom: 3rem;
        }

        code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875rem;
          color: #1f2937;
        }

        .example {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        ol {
          padding-left: 1.5rem;
        }

        li {
          margin-bottom: 0.5rem;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          h2 {
            font-size: 1.5rem;
          }
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-router-screen')) {
  customElements.define('sw-router-screen', SwRouterScreen);
}
