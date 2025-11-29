/**
 * Configuration pour le composant SelectableCard
 */

export type SelectableCardVariant = 'default' | 'inverse';

export interface SelectableCardConfig {
  variant: SelectableCardVariant;
  removable: boolean;
}

export const defaultSelectableCardConfig: SelectableCardConfig = {
  variant: 'default',
  removable: true,
};

/**
 * Classes CSS pour les différentes variantes
 */
export const selectableCardVariantClasses: Record<SelectableCardVariant, string> = {
  default: 'selectable-card--default',
  inverse: 'selectable-card--inverse',
};
