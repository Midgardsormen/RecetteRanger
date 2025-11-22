/**
 * Link Configuration
 * Constants and default values for the Link component
 */

import type { LinkVariant, ButtonSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const LINK_DEFAULTS = {
  variant: 'primary' as LinkVariant,
  buttonSize: 'medium' as ButtonSize,
  fullWidth: false,
} as const;
