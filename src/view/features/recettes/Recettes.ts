import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Recettes from './Recettes.svelte';

/**
 * Hydrate the Recettes component
 * This file controls whether and how the Recettes component is hydrated on the client
 */
export function hydrateRecettes() {
  whenReady(() => {
    hydrateComponent({
      component: Recettes,
      target: '#recettes',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydrateRecettes();
