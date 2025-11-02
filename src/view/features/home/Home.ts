import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Home from './Home.svelte';

/**
 * Hydrate the Home component
 * This file controls whether and how the Home component is hydrated on the client
 */
export function hydrateHome() {
  whenReady(() => {
    hydrateComponent({
      component: Home,
      target: '#home',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydrateHome();
