import type { Unit } from '../../types/ingredient.types';

export interface ValidationErrors {
  label?: string;
  units?: string;
  imageUrl?: string;
}

/**
 * Valide le nom de l'ingrédient
 */
export function validateLabel(label: string): string | null {
  const trimmedLabel = label.trim();

  if (trimmedLabel.length < 2) {
    return 'Le nom doit contenir au moins 2 caractères';
  }

  return null;
}

/**
 * Valide les unités sélectionnées
 */
export function validateUnits(units: Set<Unit>): string | null {
  if (units.size === 0) {
    return 'Veuillez sélectionner au moins une unité';
  }

  return null;
}

/**
 * Valide une URL (accepte les URLs complètes et les chemins relatifs)
 */
export function isValidUrl(url: string): boolean {
  // Accepter les chemins relatifs qui commencent par /
  if (url.startsWith('/')) {
    return true;
  }

  // Valider les URLs complètes
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valide l'URL de l'image
 */
export function validateImageUrl(imageUrl: string): string | null {
  if (!imageUrl) {
    return null; // L'image est optionnelle
  }

  if (!isValidUrl(imageUrl)) {
    return 'URL invalide';
  }

  return null;
}

/**
 * Valide tous les champs du formulaire
 */
export function validateIngredientForm(
  label: string,
  selectedUnits: Set<Unit>,
  imageUrl: string
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const labelError = validateLabel(label);
  if (labelError) errors.label = labelError;

  const unitsError = validateUnits(selectedUnits);
  if (unitsError) errors.units = unitsError;

  const imageUrlError = validateImageUrl(imageUrl);
  if (imageUrlError) errors.imageUrl = imageUrlError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
