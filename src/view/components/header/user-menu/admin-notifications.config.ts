/**
 * Configuration pour les notifications admin
 */

/**
 * Intervalle de rafraîchissement des notifications (en millisecondes)
 * Par défaut : 30 secondes
 */
export const NOTIFICATIONS_REFRESH_INTERVAL = 30000;

/**
 * Événements personnalisés pour les notifications admin
 */
export const NOTIFICATION_EVENTS = {
  USER_STATUS_CHANGED: 'user-status-changed',
  INGREDIENT_DATA_CHANGED: 'ingredient-data-changed',
} as const;

/**
 * Valeurs par défaut pour les compteurs de notifications
 */
export const DEFAULT_NOTIFICATION_COUNTS = {
  pendingUsers: 0,
  incompleteIngredients: 0,
} as const;
