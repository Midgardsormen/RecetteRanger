import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Ingredients from './Ingredients.svelte';

/**
 * Hydrate the Ingredients component
 * This file controls whether and how the Ingredients component is hydrated on the client
 */
export function hydrateIngredients() {
  whenReady(() => {
    hydrateComponent({
      component: Ingredients,
      target: '#ingredients',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydrateIngredients();
