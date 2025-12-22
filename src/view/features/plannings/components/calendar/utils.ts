import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../../../types/meal-plan.types';
import { startOfWeek, startOfMonth, endOfMonth, addDays, isSameDay } from '../../../../utils/date-range.utils';

/**
 * Trouve le MealPlanDay pour une date donnée
 */
export function getMealPlanForDate(mealPlanDays: MealPlanDay[], date: Date): MealPlanDay | undefined {
  return mealPlanDays.find(day => isSameDay(new Date(day.date), date));
}

/**
 * Trie les items d'un repas selon l'ordre des créneaux dans slotConfigs
 */
export function sortMealItems(items: any[], slotConfigs: MealSlotConfig[]): any[] {
  if (!items || items.length === 0) return [];

  return [...items].sort((a, b) => {
    // Les repas exceptionnels à la fin
    if (a.isExceptional && !b.isExceptional) return 1;
    if (!a.isExceptional && b.isExceptional) return -1;
    if (a.isExceptional && b.isExceptional) return 0;

    // Sinon, trier selon l'ordre dans slotConfigs
    const indexA = slotConfigs.findIndex(c => c.slot === a.slot);
    const indexB = slotConfigs.findIndex(c => c.slot === b.slot);

    // Si un slot n'est pas trouvé, le mettre à la fin
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

/**
 * Génère les dates à afficher selon la vue
 */
export function getDatesToDisplay(currentDate: Date, view: CalendarView): Date[] {
  if (view === 'day') {
    return [currentDate];
  } else if (view === 'week') {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  } else {
    // month
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfMonth(currentDate);
    const dates: Date[] = [];
    let current = start;

    while (current <= end || dates.length < 35) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }

    return dates;
  }
}

/**
 * Génère les dates à afficher pour le mini-calendrier
 * Spécifique au MiniCalendar avec limite de 42 jours pour 6 semaines
 */
export function getDatesToDisplayForMiniCalendar(currentDate: Date, view: CalendarView): Date[] {
  if (view === 'week') {
    // En mode semaine : afficher les 7 jours de la semaine courante
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  } else {
    // En mode mois : afficher le mois complet (max 6 semaines = 42 jours)
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfMonth(currentDate);
    const dates: Date[] = [];
    let current = start;

    while (current <= end || dates.length < 42) {
      dates.push(new Date(current));
      current = addDays(current, 1);

      // Limiter à 6 semaines (42 jours)
      if (dates.length >= 42) break;
    }

    return dates;
  }
}
