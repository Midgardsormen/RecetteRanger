/**
 * StoreAutocomplete Configuration
 * Constants and default values for the StoreAutocomplete component
 */

// ============================================
// DEFAULT VALUES
// ============================================

export const STORE_AUTOCOMPLETE_DEFAULTS = {
  id: 'store-autocomplete',
  placeholder: 'Sélectionnez une enseigne...',
  disabled: false,
  value: '',
} as const;

// ============================================
// SEARCH CONFIGURATION
// ============================================

export const STORE_AUTOCOMPLETE_SEARCH = {
  debounceDelay: 300,
  minSearchLength: 1,
  limit: 10,
  blurDelay: 200,
} as const;

// ============================================
// UI CONFIGURATION
// ============================================

export const STORE_AUTOCOMPLETE_UI = {
  logoSize: 32,
  maxDropdownHeight: 300,
} as const;

// ============================================
// MESSAGES
// ============================================

export const STORE_AUTOCOMPLETE_MESSAGES = {
  noResults: (searchValue: string) => `Aucune enseigne trouvée pour "${searchValue}"`,
  createNew: (searchValue: string) => `Créer l'enseigne "${searchValue}"`,
  clearButton: 'Retirer l\'enseigne',
} as const;
