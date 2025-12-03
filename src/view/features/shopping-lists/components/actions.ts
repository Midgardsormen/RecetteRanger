import { apiService } from '../../../services/api.service';

/**
 * Actions pour le GenerateShoppingListDrawer
 */

interface GenerateFormData {
  fromDate: string;
  toDate: string;
  customName: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Initialise les dates du formulaire (aujourd'hui + 7 jours)
 */
export function initializeDates(): { fromDate: string; toDate: string } {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return {
    fromDate: today.toISOString().split('T')[0],
    toDate: nextWeek.toISOString().split('T')[0]
  };
}

/**
 * Valide les données du formulaire de génération de liste
 */
export function validateGenerateForm(formData: GenerateFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.fromDate || !formData.toDate) {
    errors.general = 'Veuillez sélectionner les dates de début et de fin';
    return { isValid: false, errors };
  }

  const from = new Date(formData.fromDate);
  const to = new Date(formData.toDate);

  if (from > to) {
    errors.general = 'La date de début doit être avant la date de fin';
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {} };
}

/**
 * Génère une liste de courses depuis l'API
 */
export async function generateShoppingList(formData: GenerateFormData): Promise<void> {
  await apiService.generateShoppingList({
    fromDate: new Date(formData.fromDate).toISOString(),
    toDate: new Date(formData.toDate).toISOString(),
    name: formData.customName || undefined
  });
}
