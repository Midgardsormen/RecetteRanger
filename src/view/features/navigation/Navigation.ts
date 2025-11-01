import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Navigation from './Navigation.svelte';

/**
 * Hydrate the Navigation component
 * This file controls whether and how the Navigation component is hydrated on the client
 */
export function hydrateNavigation() {
  whenReady(() => {
    hydrateComponent({
      component: Navigation,
      target: '#navigation',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydrateNavigation();
