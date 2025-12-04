/**
 * Configuration for shopping list detail component
 */

/**
 * Auto-scroll configuration for drag and drop
 */
export const AUTO_SCROLL_CONFIG = {
  /** Zone size in pixels from top/bottom where auto-scroll is triggered */
  scrollZone: 100,
  /** Maximum scroll speed in pixels per frame */
  maxScrollSpeed: 15,
  /** Interval in milliseconds for scroll updates (~60fps) */
  scrollInterval: 16,
} as const;

/**
 * Animation configuration
 */
export const ANIMATION_CONFIG = {
  /** Flash animation duration when item is dropped on a store */
  flashDuration: 800,
  /** Delay before reloading data after store creation */
  storeCreationDelay: 300,
} as const;
