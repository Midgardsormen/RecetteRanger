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

/**
 * Retourne le début de la semaine pour une date donnée (lundi)
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Retourne le début du mois pour une date donnée
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Retourne la fin du mois pour une date donnée
 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Ajoute un nombre de jours à une date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Ajoute un nombre de semaines à une date
 */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * Ajoute un nombre de mois à une date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Vérifie si deux dates sont le même jour
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Formate une date en français
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'long') {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/**
 * Formate le nom du jour en français
 */
export function formatDayName(date: Date, format: 'short' | 'narrow' = 'short'): string {
  return date.toLocaleDateString('fr-FR', { weekday: format });
}

/**
 * Formate le mois et l'année en français
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}
