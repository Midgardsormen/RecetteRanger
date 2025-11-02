import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import ShoppingLists from './ShoppingLists.svelte';

/**
 * Hydrate the ShoppingLists component
 * This file controls whether and how the ShoppingLists component is hydrated on the client
 */
export function hydrateShoppingLists() {
  whenReady(() => {
    hydrateComponent({
      component: ShoppingLists,
      target: '#shopping-lists',
      // Props will be read from the data-props attribute on the target element
      // or you can provide them explicitly here
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
// Comment this line if you want manual control
hydrateShoppingLists();
