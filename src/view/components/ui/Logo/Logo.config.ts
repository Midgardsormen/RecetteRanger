/**
 * Logo Configuration
 * Constants and default values for the Logo component
 */

import type { LogoVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const LOGO_DEFAULTS: {
  variant: LogoVariant;
  href: string;
} = {
  variant: 'default',
  href: '/',
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const LOGO_ALT_TEXT = 'RecetteRanger';
export const LOGO_ARIA_LABEL = 'RecetteRanger';
