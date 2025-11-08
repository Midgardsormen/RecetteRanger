// Entry point for pages (used by SSR server and dynamic loading)
// Dynamic imports for code splitting - export les fragments autonomes
export const pages = {
  Home: () => import('./features/home/Home.svelte'),
  Recipes: () => import('./features/recipes/Recipes.svelte'),
  Recettes: () => import('./features/recettes/Recettes.svelte'),
  RecipeDetail: () => import('./pages/RecipeDetail.svelte'),
  Ingredients: () => import('./features/ingredients/Ingredients.svelte'),
  Plannings: () => import('./features/plannings/Plannings.svelte'),
  MealPlanning: () => import('./pages/MealPlanning.svelte'),
  MealPlanningSettings: () => import('./pages/MealPlanningSettings.svelte'),
  ShoppingLists: () => import('./features/shopping-lists/ShoppingLists.svelte'),
  Login: () => import('./features/auth/Login.svelte'),
  Register: () => import('./features/auth/Register.svelte')
};

// Static imports for SSR (server-side rendering) - export les fragments autonomes
export { default as Home } from './features/home/Home.svelte';
export { default as Recipes } from './features/recipes/Recipes.svelte';
export { default as Recettes } from './features/recettes/Recettes.svelte';
export { default as RecipeDetail } from './pages/RecipeDetail.svelte';
export { default as Ingredients } from './features/ingredients/Ingredients.svelte';
export { default as Plannings } from './features/plannings/Plannings.svelte';
export { default as MealPlanning } from './pages/MealPlanning.svelte';
export { default as MealPlanningSettings } from './pages/MealPlanningSettings.svelte';
export { default as ShoppingLists } from './features/shopping-lists/ShoppingLists.svelte';
export { default as Login } from './features/auth/Login.svelte';
export { default as Register } from './features/auth/Register.svelte';
