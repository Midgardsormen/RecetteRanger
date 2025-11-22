/**
 * Spinner Configuration
 * Constants and default values for the Spinner component
 */

import type { SpinnerSize, SpinnerVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const SPINNER_DEFAULTS = {
  size: 'md' as SpinnerSize,
  variant: 'primary' as SpinnerVariant,
} as const;

// ============================================
// SIZES
// ============================================

export const SPINNER_SIZES = {
  sm: {
    width: '12px',
    height: '12px',
    borderWidth: '2px',
  },
  md: {
    width: '16px',
    height: '16px',
    borderWidth: '2px',
  },
  lg: {
    width: '24px',
    height: '24px',
    borderWidth: '3px',
  },
} as const;

// ============================================
// ANIMATION
// ============================================

export const SPINNER_ANIMATION = {
  duration: '0.6s',
  timing: 'linear',
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const SPINNER_ARIA = {
  role: 'status',
  label: 'Chargement',
} as const;
