// Entry point for pages (used by SSR server and dynamic loading)
// Dynamic imports for code splitting - export les fragments autonomes
export const pages = {
  Home: () => import('./features/home/Home.svelte'),
  Recettes: () => import('./features/recettes/Recettes.svelte'),
  Ingredients: () => import('./features/ingredients/Ingredients.svelte'),
  Plannings: () => import('./features/plannings/Plannings.svelte'),
  ShoppingLists: () => import('./features/shopping-lists/ShoppingLists.svelte'),
  Login: () => import('./features/auth/Login.svelte'),
  Register: () => import('./features/auth/Register.svelte')
};

// Static imports for SSR (server-side rendering) - export les fragments autonomes
export { default as Home } from './features/home/Home.svelte';
export { default as Recettes } from './features/recettes/Recettes.svelte';
export { default as Ingredients } from './features/ingredients/Ingredients.svelte';
export { default as Plannings } from './features/plannings/Plannings.svelte';
export { default as ShoppingLists } from './features/shopping-lists/ShoppingLists.svelte';
export { default as Login } from './features/auth/Login.svelte';
export { default as Register } from './features/auth/Register.svelte';
