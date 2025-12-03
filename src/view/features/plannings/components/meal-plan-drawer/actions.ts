import { apiService } from '../../../../services/api.service';
import type { Recipe } from '../../../../types/recipe.types';
import type { CreateMealPlanItemDto, MealPlanDay } from '../../../../types/meal-plan.types';

/**
 * Charge les recettes correspondant à la recherche
 */
export async function loadRecipes(
  searchQuery: string,
  userId: string
): Promise<Recipe[]> {
  if (searchQuery.length < 2) {
    return [];
  }

  try {
    const result = await apiService.searchRecipes({
      search: searchQuery,
      limit: 20,
      userId: userId
    });
    return result.items || result.data || [];
  } catch (err) {
    console.error('Erreur lors du chargement des recettes:', err);
    return [];
  }
}

/**
 * Valide les données du formulaire
 */
export function validateForm(
  isExceptional: boolean,
  customSlotName: string,
  servings: number
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (isExceptional && !customSlotName.trim()) {
    errors.customSlotName = 'Veuillez donner un nom au repas exceptionnel';
    isValid = false;
  }

  if (servings < 1) {
    errors.servings = 'Le nombre de personnes doit être au moins 1';
    isValid = false;
  }

  return { isValid, errors };
}

/**
 * Crée ou met à jour un item de meal plan
 */
export async function submitMealPlanItem(
  editingItem: any | null,
  mealPlanDay: MealPlanDay | null,
  userId: string,
  selectedDate: Date,
  formData: {
    selectedSlot: string;
    customSlotName: string;
    isExceptional: boolean;
    selectedRecipe: Recipe | null;
    servings: number;
    note: string;
  }
): Promise<void> {
  if (editingItem) {
    // Mode édition : mettre à jour l'item existant
    const updateData = {
      slot: formData.selectedSlot,
      customSlotName: formData.isExceptional ? formData.customSlotName : undefined,
      isExceptional: formData.isExceptional,
      recipeId: formData.selectedRecipe?.id,
      servings: formData.servings,
      note: formData.note || undefined
    };

    await apiService.updateMealPlanItem(editingItem.id, updateData);
  } else {
    // Mode ajout : créer un nouvel item
    // S'assurer qu'on a un mealPlanDay
    let dayId = mealPlanDay?.id;

    if (!dayId) {
      // Essayer de créer le jour s'il n'existe pas
      try {
        const createdDay = await apiService.createMealPlanDay({
          userId,
          date: selectedDate.toISOString(),
          items: []
        });
        dayId = createdDay.id;
      } catch (error: any) {
        // Si le jour existe déjà, le récupérer
        if (error.message?.includes('existe déjà')) {
          const days = await apiService.getMealPlanDays({
            userId,
            startDate: selectedDate.toISOString(),
            endDate: selectedDate.toISOString()
          });
          if (days.length > 0) {
            dayId = days[0].id;
          } else {
            throw new Error('Impossible de créer ou récupérer le jour de planification');
          }
        } else {
          throw error;
        }
      }
    }

    // Créer l'item
    const itemData: CreateMealPlanItemDto = {
      slot: formData.selectedSlot as any,
      customSlotName: formData.isExceptional ? formData.customSlotName : undefined,
      isExceptional: formData.isExceptional,
      recipeId: formData.selectedRecipe?.id,
      servings: formData.servings,
      note: formData.note || undefined,
      order: mealPlanDay?.items.filter(i => i.slot === formData.selectedSlot).length || 0
    };

    await apiService.createMealPlanItem(dayId, itemData);
  }
}
