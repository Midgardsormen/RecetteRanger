/**
 * ProgressBar Configuration
 * Constants and default values for the ProgressBar component
 */

import type { ProgressBarSize, ProgressBarVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const PROGRESS_BAR_DEFAULTS = {
  max: 100,
  size: 'medium' as ProgressBarSize,
  variant: 'primary' as ProgressBarVariant,
  showLabel: false,
  animated: true,
} as const;

// ============================================
// SIZES
// ============================================

export const PROGRESS_BAR_SIZES = {
  small: {
    height: '6px',
  },
  medium: {
    height: '8px',
  },
  large: {
    height: '12px',
  },
} as const;
