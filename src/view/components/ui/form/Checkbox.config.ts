/**
 * Configuration pour le composant Checkbox
 */

export type CheckboxVariant = 'default' | 'inverse';
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxConfig {
  variant: CheckboxVariant;
  size: CheckboxSize;
  disabled: boolean;
}

export const defaultCheckboxConfig: CheckboxConfig = {
  variant: 'default',
  size: 'md',
  disabled: false,
};

/**
 * Classes CSS pour les différentes variantes
 */
export const checkboxVariantClasses: Record<CheckboxVariant, string> = {
  default: 'checkbox--default',
  inverse: 'checkbox--inverse',
};

/**
 * Classes CSS pour les différentes tailles
 */
export const checkboxSizeClasses: Record<CheckboxSize, string> = {
  sm: 'checkbox--sm',
  md: 'checkbox--md',
  lg: 'checkbox--lg',
};
