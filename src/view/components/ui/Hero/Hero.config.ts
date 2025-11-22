/**
 * Hero Configuration
 * Constants and default values for the Hero component
 */

import type { HeroVariant, HeroTextAlign } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const HERO_DEFAULTS = {
  variant: 'default' as HeroVariant,
  overlay: true,
  overlayOpacity: 0.85,
  textAlign: 'center' as HeroTextAlign,
} as const;

// ============================================
// PADDING VALUES
// ============================================

export const HERO_PADDING = {
  // Default variant
  defaultMobile: '5rem 0.5rem 1.5rem',
  defaultTablet: '8rem 0.75rem 2rem',
  defaultDesktop: '8rem 1.5rem 3rem',

  // Grid variant
  gridDesktop: '2.5rem',
  gridMobile: '1.5rem',

  // Compact variant
  compactMobile: '1.5rem 0.5rem',
  compactTablet: '2rem 0.75rem',
  compactDesktop: '2rem 1.5rem',
} as const;

// ============================================
// GAP VALUES
// ============================================

export const HERO_GAP = {
  grid: '2.5rem',
} as const;

// ============================================
// Z-INDEX
// ============================================

export const HERO_Z_INDEX = {
  overlay: 0,
  content: 1,
} as const;

// ============================================
// OVERLAY
// ============================================

export const HERO_OVERLAY = {
  defaultOpacity: 0.85,
  grainOpacity: 0.3,
} as const;
