/**
 * PageHero Configuration
 * Constants and default values for the PageHero component
 */

import type { HeroVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const PAGE_HERO_DEFAULTS = {
  showSearch: false,
  searchPlaceholder: 'Rechercher...',
} as const;

// ============================================
// HERO CONFIGURATION
// ============================================

/**
 * Default Hero configuration for PageHero
 * These values are passed to the Hero component wrapper
 */
export const PAGE_HERO_CONFIG = {
  variant: 'compact' as HeroVariant,
  backgroundImage: '/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png',
  backgroundColor: 'var(--brand-quaternary)',
  overlay: true,
  overlayOpacity: 0.85,
  textAlign: 'left' as const,
} as const;
