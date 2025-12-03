import { apiService } from '../../services/api.service';
import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../types/meal-plan.types';
import { getDateRangeForView } from '../../utils/date-range.utils';

/**
 * Charge les données du planning (jours et configurations)
 */
export async function loadMealPlanData(
  userId: string,
  currentDate: Date,
  view: CalendarView
): Promise<{ days: MealPlanDay[]; configs: MealSlotConfig[] }> {
  // Calculer la plage de dates en fonction de la vue
  const { fromDate, toDate } = getDateRangeForView(currentDate, view);

  // Charger les plannings et les configs en parallèle
  const [days, configs] = await Promise.all([
    apiService.getMealPlanDays({
      userId,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString()
    }),
    apiService.getMealSlotConfigs(userId)
  ]);

  // Si pas de configs, initialiser les configs par défaut
  if (configs.length === 0) {
    await apiService.initializeDefaultMealSlotConfigs(userId);
    const newConfigs = await apiService.getMealSlotConfigs(userId);
    return { days, configs: newConfigs };
  }

  return { days, configs };
}

/**
 * Supprime un item de repas
 */
export async function deleteMealPlanItem(itemId: string): Promise<void> {
  await apiService.deleteMealPlanItem(itemId);
}

/**
 * Trouve le MealPlanDay correspondant à un item
 */
export function findMealPlanDayForItem(
  mealPlanDays: MealPlanDay[],
  itemId: string
): MealPlanDay | undefined {
  return mealPlanDays.find(d => d.items.some(i => i.id === itemId));
}
