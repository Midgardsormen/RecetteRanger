/**
 * IconButton Configuration
 * Constants and default values for the IconButton component
 */

import type { IconButtonVariant, IconButtonSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const ICON_BUTTON_DEFAULTS = {
  variant: 'default' as IconButtonVariant,
  size: 'medium' as IconButtonSize,
  disabled: false,
  type: 'button' as const,
} as const;

// ============================================
// SIZES
// ============================================

export const ICON_BUTTON_SIZES = {
  small: {
    width: '28px',
    height: '28px',
  },
  medium: {
    width: '36px',
    height: '36px',
  },
  large: {
    width: '44px',
    height: '44px',
  },
} as const;
