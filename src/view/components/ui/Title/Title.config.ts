/**
 * Title Configuration
 * Constants and default values for the Title component
 */

import type { TitleLevel, TitleAlign, TitleSize } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const TITLE_DEFAULTS = {
  level: 1 as TitleLevel,
  align: 'left' as TitleAlign,
  size: 'm' as TitleSize,
  gradient: false,
} as const;
