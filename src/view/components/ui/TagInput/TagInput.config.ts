/**
 * TagInput Configuration
 *
 * Configuration et constantes pour le composant TagInput
 */

export const TAG_INPUT_DEFAULTS = {
  variant: 'default' as 'default' | 'inverse',
  placeholder: '',
  addButtonLabel: '+ Ajouter',
  tagVariant: 'neutral' as const,
  tagSize: 'medium' as const
};

export const TAG_INPUT_ARIA = {
  addButton: 'Ajouter un élément',
  removeItem: 'Supprimer'
};
