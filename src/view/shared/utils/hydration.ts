import { hydrate, type Component } from 'svelte';

/**
 * Options for hydrating a component
 */
export interface HydrationOptions<Props extends Record<string, any> = {}> {
  /** The component to hydrate */
  component: Component<Props>;
  /** CSS selector for the target element */
  target: string;
  /** Props to pass to the component (optional, will try to read from data attributes) */
  props?: Props;
  /** Whether to recover from errors during hydration */
  recover?: boolean;
}

/**
 * Hydrates a Svelte component on a specific DOM element
 *
 * @param options - Hydration configuration
 * @returns The hydrated component instance or null if target not found
 */
export function hydrateComponent<Props extends Record<string, any> = {}>(
  options: HydrationOptions<Props>
) {
  const { component, target: targetSelector, props = {} as Props, recover = true } = options;

  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    console.warn(`[Hydration] Target element not found: ${targetSelector}`);
    return null;
  }

  try {
    // Try to read props from data-props attribute if not provided
    const finalProps = Object.keys(props).length > 0
      ? props
      : readPropsFromElement(targetElement);

    const instance = hydrate(component, {
      target: targetElement as HTMLElement,
      props: finalProps,
      recover
    });

    console.log(`[Hydration] Successfully hydrated component at ${targetSelector}`);
    return instance;
  } catch (error) {
    console.error(`[Hydration] Error hydrating component at ${targetSelector}:`, error);
    return null;
  }
}

/**
 * Reads props from a DOM element's data-props attribute
 */
function readPropsFromElement(element: Element): Record<string, any> {
  const propsAttr = element.getAttribute('data-props');
  if (propsAttr) {
    try {
      return JSON.parse(propsAttr);
    } catch (e) {
      console.warn('[Hydration] Failed to parse data-props:', e);
    }
  }
  return {};
}

/**
 * Hydrates multiple components at once
 *
 * @param componentsToHydrate - Array of hydration options
 */
export function hydrateComponents(componentsToHydrate: HydrationOptions[]) {
  const instances: Array<ReturnType<typeof hydrate> | null> = [];

  for (const options of componentsToHydrate) {
    const instance = hydrateComponent(options);
    instances.push(instance);
  }

  return instances;
}

/**
 * Utility to check if we're in the browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Utility to check if hydration should run
 * Only runs in browser and when DOM is ready
 */
export function shouldHydrate(): boolean {
  return isBrowser && document.readyState !== 'loading';
}

/**
 * Waits for DOM to be ready before hydrating
 */
export function whenReady(callback: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}
