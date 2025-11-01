// Entry point for pages (used by SSR server and dynamic loading)
// Dynamic imports for code splitting
export const pages = {
  Home: () => import('./pages/Home.svelte'),
  Recettes: () => import('./pages/Recettes.svelte'),
  Plannings: () => import('./pages/Plannings.svelte'),
  ShoppingLists: () => import('./pages/ShoppingLists.svelte'),
  Login: () => import('./pages/Login.svelte'),
  Register: () => import('./pages/Register.svelte')
};

// Static imports for SSR (server-side rendering)
export { default as Home } from './pages/Home.svelte';
export { default as Recettes } from './pages/Recettes.svelte';
export { default as Plannings } from './pages/Plannings.svelte';
export { default as ShoppingLists } from './pages/ShoppingLists.svelte';
export { default as Login } from './pages/Login.svelte';
export { default as Register } from './pages/Register.svelte';
