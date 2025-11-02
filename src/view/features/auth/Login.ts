import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Login from './Login.svelte';

/**
 * Hydrate the Login component
 * This file controls whether and how the Login component is hydrated on the client
 */
export function hydrateLogin() {
  whenReady(() => {
    hydrateComponent({
      component: Login,
      target: '#login',
      recover: true
    });
  });
}

// Auto-hydrate when this module is imported
hydrateLogin();
