/**
 * DropdownMenu Configuration
 * Constants and default values for the DropdownMenu component
 */

import type { DropdownAlign } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const DROPDOWN_MENU_DEFAULTS = {
  align: 'right' as DropdownAlign,
  isOpen: false,
  minWidth: '200px',
  iconButton: false,
  autoAlign: true,
} as const;
