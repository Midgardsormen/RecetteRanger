/**
 * SearchBar Configuration
 * Constants and default values for the SearchBar component
 */

// ============================================
// DEFAULT VALUES
// ============================================

export const SEARCH_BAR_DEFAULTS = {
  placeholder: 'Rechercher...',
  disabled: false,
  value: '',
} as const;

// ============================================
// ICON SIZES
// ============================================

export const SEARCH_BAR_ICON_SIZES = {
  search: 20,
  clear: 18,
} as const;

// ============================================
// CLEAR BUTTON
// ============================================

export const SEARCH_BAR_CLEAR_BUTTON = {
  ariaLabel: 'Effacer la recherche',
} as const;
