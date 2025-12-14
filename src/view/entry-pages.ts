// Entry point for pages (used by SSR server and dynamic loading)
// Dynamic imports for code splitting - export les fragments autonomes
export const pages = {
  Home: () => import('./features/home/Home.svelte'),
  Recipes: () => import('./features/recipes/Recipes.svelte'),
  RecipeDetail: () => import('./features/recipes/RecipeDetail.svelte'),
  Menus: () => import('./features/menus/Menus.svelte'),
  MenuDetail: () => import('./features/menus/MenuDetail.svelte'),
  Ingredients: () => import('./features/ingredients/Ingredients.svelte'),
  Articles: () => import('./features/articles/Articles.svelte'),
  Stores: () => import('./features/stores/Stores.svelte'),
  MealPlanning: () => import('./features/plannings/MealPlanning.svelte'),
  MealPlanningSettings: () => import('./features/plannings/MealPlanningSettings.svelte'),
  ShoppingLists: () => import('./features/shopping-lists/ShoppingLists.svelte'),
  ShoppingListDetail: () => import('./features/shopping-lists/ShoppingListDetail.svelte'),
  Profile: () => import('./features/profile/Profile.svelte'),
  Users: () => import('./features/users/Users.svelte'),
  Admin: () => import('./features/admin/Admin.svelte'),
  Login: () => import('./features/auth/Login.svelte'),
  Register: () => import('./features/auth/Register.svelte'),
  PrivacyPolicy: () => import('./features/privacy/PrivacyPolicy.svelte'),
  LegalNotice: () => import('./features/legal/LegalNotice.svelte'),
  ButtonsDemo: () => import('./features/demo/ButtonsDemo.svelte')
};

// Static imports for SSR (server-side rendering) - export les fragments autonomes
export { default as Home } from './features/home/Home.svelte';
export { default as Recipes } from './features/recipes/Recipes.svelte';
export { default as RecipeDetail } from './features/recipes/RecipeDetail.svelte';
export { default as Menus } from './features/menus/Menus.svelte';
export { default as MenuDetail } from './features/menus/MenuDetail.svelte';
export { default as Ingredients } from './features/ingredients/Ingredients.svelte';
export { default as Articles } from './features/articles/Articles.svelte';
export { default as Stores } from './features/stores/Stores.svelte';
export { default as MealPlanning } from './features/plannings/MealPlanning.svelte';
export { default as MealPlanningSettings } from './features/plannings/MealPlanningSettings.svelte';
export { default as ShoppingLists } from './features/shopping-lists/ShoppingLists.svelte';
export { default as ShoppingListDetail } from './features/shopping-lists/ShoppingListDetail.svelte';
export { default as Profile } from './features/profile/Profile.svelte';
export { default as Users } from './features/users/Users.svelte';
export { default as Admin } from './features/admin/Admin.svelte';
export { default as Login } from './features/auth/Login.svelte';
export { default as Register } from './features/auth/Register.svelte';
export { default as PrivacyPolicy } from './features/privacy/PrivacyPolicy.svelte';
export { default as LegalNotice } from './features/legal/LegalNotice.svelte';
export { default as ButtonsDemo } from './features/demo/ButtonsDemo.svelte';
