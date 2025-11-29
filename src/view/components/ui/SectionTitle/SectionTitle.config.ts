/**
 * SectionTitle Configuration
 * Constants and default values for the SectionTitle component
 */

import type { SectionTitleProps } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const SECTION_TITLE_DEFAULTS = {
  level: 2 as NonNullable<SectionTitleProps['level']>,
  variant: 'default' as NonNullable<SectionTitleProps['variant']>,
} as const;
