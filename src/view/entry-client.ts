import { mount } from 'svelte';
import { pages } from './entry-pages';
import './styles/_global.scss';

/**
 * Client-side entry point
 *
 * In development mode: Client-side rendering (no SSR)
 * In production mode: Hydration of server-rendered HTML
 */

// Get initial data from the server
const initialData = (window as any).__INITIAL_DATA__ || {};
const { pageName, props = {} } = initialData;

/**
 * Initialize client-side rendering
 */
async function initializeClient() {
  if (!pageName) {
    console.warn('[Client] No page name found in initial data');
    return;
  }

  console.log(`[Client] Initializing page: ${pageName}`);

  try {
    // Get the page component loader
    const pageLoader = pages[pageName as keyof typeof pages];

    if (!pageLoader) {
      console.error(`[Client] Page not found: ${pageName}`);
      return;
    }

    // Load the page component
    const pageModule = await pageLoader();
    const PageComponent = pageModule.default;

    // Get the app container
    const appElement = document.getElementById('app');
    if (!appElement) {
      console.error('[Client] App container not found');
      return;
    }

    // Mount the page component
    mount(PageComponent, {
      target: appElement,
      props: props
    });

    console.log(`[Client] Page ${pageName} mounted successfully`);
  } catch (error) {
    console.error('[Client] Error during initialization:', error);
  }
}

// Start client initialization
initializeClient();
