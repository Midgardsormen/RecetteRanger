/**
 * Utilitaires pour la manipulation de texte
 */

/**
 * Génère un texte avec pluralisation correcte en français
 * @param count - Le nombre d'éléments
 * @param singular - La forme au singulier
 * @param plural - La forme au pluriel (optionnel, par défaut ajoute 's')
 * @returns Le texte avec la bonne forme
 *
 * @example
 * pluralize(0, 'pomme') // "0 pomme"
 * pluralize(1, 'pomme') // "1 pomme"
 * pluralize(2, 'pomme') // "2 pommes"
 * pluralize(2, 'cheval', 'chevaux') // "2 chevaux"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const form = count <= 1 ? singular : (plural || `${singular}s`);
  return `${count} ${form}`;
}

/**
 * Génère un texte de notification pour les demandes d'inscription
 * @param count - Nombre de demandes
 * @returns Texte formaté ou null si count === 0
 */
export function formatPendingUsersNotification(count: number): string | null {
  if (count === 0) return null;
  return pluralize(count, 'demande d\'inscription', 'demandes d\'inscription');
}

/**
 * Génère un texte de notification pour les ingrédients incomplets
 * @param count - Nombre d'ingrédients incomplets
 * @returns Texte formaté ou null si count === 0
 */
export function formatIncompleteIngredientsNotification(count: number): string | null {
  if (count === 0) return null;
  return pluralize(count, 'ingrédient incomplet', 'ingrédients incomplets');
}

/**
 * Génère un texte de notification agrégé pour l'admin
 * Combine les utilisateurs en attente et les ingrédients incomplets
 * @param pendingUsers - Nombre d'utilisateurs en attente
 * @param incompleteIngredients - Nombre d'ingrédients incomplets
 * @returns Texte formaté avec séparateur ' • ' ou chaîne vide
 */
export function formatAggregatedAdminNotification(
  pendingUsers: number,
  incompleteIngredients: number
): string {
  const notifications = [
    formatPendingUsersNotification(pendingUsers),
    formatIncompleteIngredientsNotification(incompleteIngredients),
  ].filter(Boolean);

  return notifications.join(' • ');
}
