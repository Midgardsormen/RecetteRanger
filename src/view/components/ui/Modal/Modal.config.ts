/**
 * Modal Configuration
 * Constants and default values for the Modal component
 */

import type { ModalSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const MODAL_DEFAULTS: {
  isOpen: boolean;
  title: string;
  size: ModalSize;
  showCloseButton: boolean;
} = {
  isOpen: false,
  title: '',
  size: 'medium',
  showCloseButton: true,
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const MODAL_ARIA_LABELS = {
  close: 'Fermer',
  loading: 'Chargement...',
} as const;

// ============================================
// CONSTANTS
// ============================================

/**
 * Modal max widths by size variant
 */
export const MODAL_MAX_WIDTHS = {
  small: '400px',
  medium: '600px',
  large: '900px',
} as const;
