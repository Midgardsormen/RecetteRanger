/**
 * Centralized image paths for the RecetteRanger application
 * This file provides typed constants for all static images used across the app
 */

export const IMAGES = {
  // Logo
  logo: {
    // Main application logo
    main: '/assets/images/logo-recette-ranger.png',
    // Alternative logo for dark mode (if needed)
    dark: '/assets/images/logo-dark.svg',
    // Small icon version (for favicons, etc.)
    icon: '/assets/images/icon.svg',
    // Logo with text
    withText: '/assets/images/logo-text.svg',
  },

  // Placeholder images
  placeholders: {
    // Default recipe image when no image is provided
    recipe: '/assets/images/placeholders/recipe-placeholder.png',
    // Default ingredient image
    ingredient: '/assets/images/placeholders/ingredient-placeholder.png',
    // Default user avatar
    avatar: '/assets/images/placeholders/avatar-placeholder.png',
    // Generic image placeholder
    generic: '/assets/images/placeholders/placeholder.png',
  },

  // Icons for categories or features
  icons: {
    // Recipe category icons
    categories: {
      appetizer: '/assets/images/icons/categories/appetizer.svg',
      mainCourse: '/assets/images/icons/categories/main-course.svg',
      dessert: '/assets/images/icons/categories/dessert.svg',
      breakfast: '/assets/images/icons/categories/breakfast.svg',
      snack: '/assets/images/icons/categories/snack.svg',
    },
    // Feature icons
    features: {
      shoppingList: '/assets/images/icons/shopping-list.svg',
      mealPlan: '/assets/images/icons/meal-plan.svg',
      ingredients: '/assets/images/icons/ingredients.svg',
      recipes: '/assets/images/icons/recipes.svg',
    },
  },

  // Illustrations for empty states or onboarding
  illustrations: {
    // Empty state when no recipes
    noRecipes: '/assets/images/illustrations/no-recipes.svg',
    // Empty state when no ingredients
    noIngredients: '/assets/images/illustrations/no-ingredients.svg',
    // Empty state when no shopping lists
    noShoppingLists: '/assets/images/illustrations/no-shopping-lists.svg',
    // Welcome illustration for onboarding
    welcome: '/assets/images/illustrations/welcome.svg',
  },

  // Background images or decorative elements
  backgrounds: {
    // Hero section background
    hero: '/assets/images/backgrounds/hero.jpg',
    // Pattern for decorative purposes
    pattern: '/assets/images/backgrounds/pattern.svg',
  },
} as const;

// Type for all image paths
export type ImagePath = typeof IMAGES;

// Helper function to get an image path safely
export function getImage(path: string, fallback?: string): string {
  return path || fallback || IMAGES.placeholders.generic;
}

// Helper function to get a recipe image with fallback
export function getRecipeImage(imageUrl?: string | null): string {
  return getImage(imageUrl || '', IMAGES.placeholders.recipe);
}

// Helper function to get an ingredient image with fallback
export function getIngredientImage(imageUrl?: string | null): string {
  return getImage(imageUrl || '', IMAGES.placeholders.ingredient);
}

// Helper function to get a user avatar with fallback
export function getUserAvatar(avatarUrl?: string | null): string {
  return getImage(avatarUrl || '', IMAGES.placeholders.avatar);
}
