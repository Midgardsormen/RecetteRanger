/**
 * FormDrawer Configuration
 * Constants and default values for the FormDrawer component
 */

import type { FormDrawerProps } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const FORM_DRAWER_DEFAULTS = {
  isOpen: false,
  mode: 'create' as NonNullable<FormDrawerProps['mode']>,
  saving: false,
  errors: {},
  duplicates: [],
  checkingDuplicates: false,
} as const;

// ============================================
// LABELS
// ============================================

export const FORM_DRAWER_LABELS = {
  createButton: 'Créer',
  saveButton: 'Sauvegarder',
  cancelButton: 'Annuler',
  savingText: 'Enregistrement...',
  duplicateWarningTitle: 'Articles similaires trouvés',
  duplicateWarningMessage: 'Des articles similaires existent déjà. Voulez-vous continuer ?',
  checkingDuplicates: 'Vérification des doublons...',
} as const;
