/**
 * Loader Configuration
 * Constants and default values for the Loader component
 */

import type { LoaderSize, LoaderVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const LOADER_DEFAULTS: {
  size: LoaderSize;
  variant: LoaderVariant;
  message: string;
  fullScreen: boolean;
} = {
  size: 'medium',
  variant: 'primary',
  message: '',
  fullScreen: false,
} as const;

// ============================================
// CONSTANTS
// ============================================

/**
 * Circle sizes for different loader sizes (in px)
 */
export const LOADER_CIRCLE_SIZES = {
  small: 8,
  medium: 12,
  large: 16,
} as const;

/**
 * Gap between circles (in px)
 */
export const LOADER_CIRCLE_GAP = 8;

/**
 * Animation timing values (in seconds)
 */
export const LOADER_ANIMATION = {
  duration: 1.4,
  delay1: -0.32,
  delay2: -0.16,
} as const;
