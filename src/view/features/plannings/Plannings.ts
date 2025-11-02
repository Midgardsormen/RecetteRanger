import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Plannings from './Plannings.svelte';

/**
 * Hydrate the Plannings component
 * This file controls whether and how the Plannings component is hydrated on the client
 */
export function hydratePlannings() {
  whenReady(() => {
    hydrateComponent({
      component: Plannings,
      target: '#plannings',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydratePlannings();
