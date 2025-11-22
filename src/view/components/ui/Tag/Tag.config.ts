/**
 * Tag Configuration
 * Constants and default values for the Tag component
 */

import type { TagColorVariant, TagSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const TAG_DEFAULTS = {
  variant: 'neutral' as TagColorVariant,
  size: 'medium' as TagSize,
  removable: false,
} as const;

// ============================================
// ICON SIZES
// ============================================

export const TAG_ICON_SIZES = {
  xs: 12,
  small: 14,
  medium: 16,
  large: 18,
} as const;

// ============================================
// REMOVE BUTTON SIZES
// ============================================

export const TAG_REMOVE_BUTTON_SIZES = {
  xs: {
    width: 12,
    height: 12,
    fontSize: 8,
  },
  small: {
    width: 14,
    height: 14,
    fontSize: 10,
  },
  medium: {
    width: 16,
    height: 16,
    fontSize: 12,
  },
  large: {
    width: 18,
    height: 18,
    fontSize: 14,
  },
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const TAG_ARIA = {
  removeLabel: 'Supprimer',
} as const;
