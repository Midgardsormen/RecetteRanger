/**
 * Drawer Configuration
 * Constants and default values for the Drawer component
 */

import type { DrawerProps } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const DRAWER_DEFAULTS = {
  isOpen: false,
  title: '',
  showBackButton: false,
  position: 'right' as NonNullable<DrawerProps['position']>,
  variant: 'default' as NonNullable<DrawerProps['variant']>,
} as const;

// ============================================
// LABELS
// ============================================

export const DRAWER_LABELS = {
  backAriaLabel: 'Retour',
  closeAriaLabel: 'Fermer',
  loadingText: 'Chargement...',
} as const;

// ============================================
// SIZES
// ============================================

export const DRAWER_SIZES = {
  maxWidthMobile: '100%',
  maxWidthTablet: '600px',
  maxWidthDesktop: '700px',
} as const;

// ============================================
// Z-INDEX
// ============================================

export const DRAWER_Z_INDEX = {
  header: 10,
} as const;
