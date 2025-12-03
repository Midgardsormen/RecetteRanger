import type { CalendarView } from '../types/meal-plan.types';

/**
 * Calcule la plage de dates en fonction de la vue du calendrier
 */
export function getDateRangeForView(
  currentDate: Date,
  view: CalendarView
): { fromDate: Date; toDate: Date } {
  const from = new Date(currentDate);
  const to = new Date(currentDate);

  if (view === 'day') {
    // Même jour
    return { fromDate: from, toDate: to };
  } else if (view === 'week') {
    // Début et fin de semaine
    const day = from.getDay();
    const diff = from.getDate() - day + (day === 0 ? -6 : 1);
    from.setDate(diff);
    to.setDate(from.getDate() + 6);
  } else {
    // Mois entier + quelques jours avant/après pour remplir le calendrier
    from.setDate(1);
    from.setDate(from.getDate() - 7);
    to.setMonth(to.getMonth() + 1);
    to.setDate(0);
    to.setDate(to.getDate() + 7);
  }

  return { fromDate: from, toDate: to };
}
