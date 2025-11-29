import { apiService } from '../../services/api.service';
import type { CreateIngredientDto, SimilarIngredient, Ingredient } from '../../types/ingredient.types';

/**
 * Vérifie les doublons d'ingrédients
 */
export async function checkDuplicates(
  label: string,
  currentIngredientId?: string
): Promise<SimilarIngredient[]> {
  if (label.length < 2) {
    return [];
  }

  try {
    const result = await apiService.checkDuplicates(label);

    // Si on est en mode édition, exclure l'ingrédient en cours d'édition
    return result.similarIngredients.filter(
      (sim: SimilarIngredient) => sim.id !== currentIngredientId
    );
  } catch (err) {
    console.error('Erreur lors de la vérification des doublons:', err);
    throw err;
  }
}

/**
 * Sauvegarde un ingrédient (création ou modification)
 */
export async function saveIngredient(
  ingredient: Ingredient | null,
  data: CreateIngredientDto
): Promise<void> {
  try {
    if (ingredient) {
      await apiService.updateIngredient(ingredient.id, data);
    } else {
      await apiService.createIngredient(data);
    }
  } catch (err: any) {
    throw new Error(err.message || 'Erreur lors de la sauvegarde');
  }
}
