/**
 * Filter Configuration
 * Constants and default values for the Filter component
 */

import type { FilterDisplayMode } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const FILTER_DEFAULTS = {
  mode: 'pills' as FilterDisplayMode,
  multiple: false,
  showCounts: false,
  isAccordionOpen: false,
  isDropdownOpen: false,
} as const;

// ============================================
// LABELS
// ============================================

export const FILTER_LABELS = {
  defaultPlaceholder: 'Sélectionner...',
  clearAll: 'Effacer tout',
  clear: 'Effacer',
  accordionTitle: 'Filtrer',
  checkMark: '✓',
  clearIcon: '✕',
} as const;

// ============================================
// SIZES
// ============================================

export const FILTER_SIZES = {
  dropdownMaxWidth: '400px',
  dropdownMinWidth: '250px',
} as const;
