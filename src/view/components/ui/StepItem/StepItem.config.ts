/**
 * StepItem Configuration
 * Constants and default values for the StepItem component
 */

import type { NumberBadgeColor, NumberBadgeSize, NumberBadgeVariant, NumberBadgeShape } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const STEP_ITEM_DEFAULTS = {
  badgeColor: 'quaternary' as NumberBadgeColor,
  badgeSize: 'medium' as NumberBadgeSize,
  badgeVariant: 'filled' as NumberBadgeVariant,
  badgeShape: 'circle' as NumberBadgeShape,
} as const;

// ============================================
// ICON SIZES
// ============================================

export const STEP_ITEM_ICON_SIZES = {
  clock: 16,
} as const;
