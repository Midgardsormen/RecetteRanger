/**
 * Title Configuration
 * Constants and default values for the Title component
 */

import type { TitleLevel, TitleAlign } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const TITLE_DEFAULTS = {
  level: 1 as TitleLevel,
  align: 'left' as TitleAlign,
  gradient: false,
} as const;
