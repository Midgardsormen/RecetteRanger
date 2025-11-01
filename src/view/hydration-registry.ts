/**
 * Hydration Registry
 *
 * This file manages which components should be hydrated on each page.
 * Add or remove components from the registry to control client-side interactivity.
 *
 * Components not listed here will remain static HTML without client-side JavaScript.
 */

export type HydrationModule = {
  /** Function to import the hydration module */
  load: () => Promise<any>;
  /** Whether this component should be hydrated on all pages */
  global?: boolean;
  /** Specific pages where this component should be hydrated */
  pages?: string[];
};

/**
 * Registry of components that can be hydrated
 *
 * Each entry defines:
 * - load: Dynamic import function for the hydration module
 * - global: If true, hydrates on all pages
 * - pages: Array of page names where it should hydrate (if not global)
 */
export const hydrationRegistry: Record<string, HydrationModule> = {
  // Navigation is interactive on all pages
  navigation: {
    load: () => import('@/features/navigation/Navigation'),
    global: true
  },

  // Example: A component that only hydrates on specific pages
  // recipeForm: {
  //   load: () => import('@/components/RecipeForm'),
  //   pages: ['Recettes']
  // },
};

/**
 * Get all components that should be hydrated for a specific page
 *
 * @param pageName - Name of the current page
 * @returns Array of hydration modules to load
 */
export function getHydrationModulesForPage(pageName: string): HydrationModule[] {
  return Object.values(hydrationRegistry).filter((module) => {
    // Include global components
    if (module.global) return true;

    // Include page-specific components
    if (module.pages && module.pages.includes(pageName)) return true;

    return false;
  });
}

/**
 * Load and execute all hydration modules for a page
 *
 * @param pageName - Name of the current page
 */
export async function hydratePageComponents(pageName: string): Promise<void> {
  const modules = getHydrationModulesForPage(pageName);

  if (modules.length === 0) {
    console.log(`[Hydration] No components to hydrate for page: ${pageName}`);
    return;
  }

  console.log(`[Hydration] Loading ${modules.length} component(s) for page: ${pageName}`);

  // Load all hydration modules in parallel
  const loadPromises = modules.map((module) =>
    module.load().catch((error) => {
      console.error('[Hydration] Failed to load hydration module:', error);
      return null;
    })
  );

  await Promise.all(loadPromises);
  console.log(`[Hydration] Completed hydration for page: ${pageName}`);
}
