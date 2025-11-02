import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Register from './Register.svelte';

/**
 * Hydrate the Register component
 * This file controls whether and how the Register component is hydrated on the client
 */
export function hydrateRegister() {
  whenReady(() => {
    hydrateComponent({
      component: Register,
      target: '#register',
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
hydrateRegister();
