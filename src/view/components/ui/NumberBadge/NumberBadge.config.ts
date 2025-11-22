/**
 * NumberBadge Configuration
 * Constants and default values for the NumberBadge component
 */

import type { NumberBadgeSize, NumberBadgeVariant, NumberBadgeColor, NumberBadgeShape } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const NUMBER_BADGE_DEFAULTS = {
  size: 'medium' as NumberBadgeSize,
  variant: 'filled' as NumberBadgeVariant,
  color: 'primary' as NumberBadgeColor,
  shape: 'circle' as NumberBadgeShape,
} as const;

// ============================================
// SIZES
// ============================================

export const NUMBER_BADGE_SIZES = {
  small: {
    width: '24px',
    height: '24px',
  },
  medium: {
    width: '36px',
    height: '36px',
  },
  large: {
    width: '48px',
    height: '48px',
  },
} as const;

// ============================================
// SHAPES
// ============================================

export const NUMBER_BADGE_SHAPES = {
  circle: '50%',
  rounded: '6px',
  square: '0',
} as const;
