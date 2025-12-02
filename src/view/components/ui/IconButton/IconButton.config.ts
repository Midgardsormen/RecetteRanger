/**
 * IconButton Configuration
 * Constants and default values for the IconButton component
 */

import type { IconButtonVariant, IconButtonSize, IconButtonShape } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const ICON_BUTTON_DEFAULTS = {
  variant: 'default' as IconButtonVariant,
  size: 'medium' as IconButtonSize,
  shape: 'square' as IconButtonShape,
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
  'x-large': {
    width: '56px',
    height: '56px',
  },
  '2x-large': {
    width: '64px',
    height: '64px',
  },
} as const;
