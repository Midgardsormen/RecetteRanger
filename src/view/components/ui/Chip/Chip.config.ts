/**
 * Configuration pour le composant Chip
 */

export type ChipVariant = 'default' | 'inverse';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipConfig {
  variant: ChipVariant;
  size: ChipSize;
  removable: boolean;
  clickable: boolean;
}

export const defaultChipConfig: ChipConfig = {
  variant: 'default',
  size: 'md',
  removable: false,
  clickable: false,
};

/**
 * Classes CSS pour les différentes variantes
 */
export const chipVariantClasses: Record<ChipVariant, string> = {
  default: 'chip--default',
  inverse: 'chip--inverse',
};

/**
 * Classes CSS pour les différentes tailles
 */
export const chipSizeClasses: Record<ChipSize, string> = {
  sm: 'chip--sm',
  md: 'chip--md',
  lg: 'chip--lg',
};
