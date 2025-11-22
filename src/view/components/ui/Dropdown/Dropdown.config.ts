/**
 * Dropdown Configuration
 * Constants and default values for the Dropdown component
 */

import type { DropdownAlign } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const DROPDOWN_DEFAULTS = {
  align: 'left' as DropdownAlign,
  isOpen: false,
  minWidth: '200px',
  maxHeight: '400px',
} as const;

// ============================================
// KEYS
// ============================================

export const DROPDOWN_KEYS = {
  escape: 'Escape',
} as const;
