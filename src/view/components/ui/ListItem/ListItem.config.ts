/**
 * ListItem Configuration
 * Constants and default values for the ListItem component
 */

// ============================================
// DEFAULT VALUES
// ============================================

export const LIST_ITEM_DEFAULTS = {
  draggable: false,
  checkable: false,
  checked: false,
  showThumbnail: true,
  metadata: [],
  layout: 'row' as const,
  size: 'default' as const,
} as const;

// ============================================
// CONSTANTS
// ============================================

export const LIST_ITEM_METADATA_LIMIT = 5;

export const LIST_ITEM_ARIA_LABELS = {
  edit: 'Modifier',
  delete: 'Supprimer',
} as const;
