/**
 * IconText Configuration
 * Constants and default values for the IconText component
 */

import type { IconTextVariant, IconTextSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const ICON_TEXT_DEFAULTS: {
  variant: IconTextVariant;
  size: IconTextSize;
  disabled: boolean;
} = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
} as const;
