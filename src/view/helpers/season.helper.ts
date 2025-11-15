import { MONTHS, MonthToSeason, SeasonColors, type TagVariant } from '../types/ingredient.types';

/**
 * Retourne les 3 premières lettres du nom du mois en français
 * @param monthNumber Numéro du mois (1-12)
 * @returns Les 3 premières lettres du mois en majuscules
 */
export function getMonthAbbreviation(monthNumber: number): string {
  if (monthNumber < 1 || monthNumber > 12) {
    return '';
  }

  const month = MONTHS.find(m => m.value === monthNumber);
  return month?.abbr || '';
}

/**
 * Retourne un tableau des abréviations de mois triées
 * @param monthNumbers Tableau des numéros de mois
 * @returns Tableau des abréviations triées par ordre chronologique
 */
export function getMonthAbbreviations(monthNumbers: number[]): string[] {
  return monthNumbers
    .filter(m => m >= 1 && m <= 12)
    .sort((a, b) => a - b)
    .map(m => getMonthAbbreviation(m));
}

/**
 * Retourne la couleur de tag appropriée pour un mois de saison
 * Utilise les couleurs de saison définies dans les design tokens
 */
export function getSeasonTagVariant(monthNumber: number): TagVariant {
  if (monthNumber < 1 || monthNumber > 12) {
    return 'neutral';
  }

  const season = MonthToSeason[monthNumber];
  return SeasonColors[season];
}
