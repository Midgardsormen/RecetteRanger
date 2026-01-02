/**
 * Actions pour la gestion des notifications admin
 */

import { fetchAllAdminNotifications, type AdminNotificationCounts } from './admin-notifications.api';
import { NOTIFICATIONS_REFRESH_INTERVAL, NOTIFICATION_EVENTS } from './admin-notifications.config';

/**
 * Configure un rafraîchissement périodique de tous les compteurs admin
 * @param isAdmin - Indique si l'utilisateur est admin
 * @param onUpdate - Callback appelé avec les nouveaux compteurs
 * @param intervalMs - Intervalle de rafraîchissement (par défaut : NOTIFICATIONS_REFRESH_INTERVAL)
 * @returns Fonction de nettoyage pour arrêter le rafraîchissement
 */
export function setupAdminNotificationsRefresh(
  isAdmin: boolean,
  onUpdate: (counts: AdminNotificationCounts) => void,
  intervalMs: number = NOTIFICATIONS_REFRESH_INTERVAL
): () => void {
  // Fetch initial
  fetchAllAdminNotifications(isAdmin).then(onUpdate);

  // Setup interval - rafraîchissement périodique
  const interval = setInterval(async () => {
    const counts = await fetchAllAdminNotifications(isAdmin);
    onUpdate(counts);
  }, intervalMs);

  return () => {
    clearInterval(interval);
  };
}

/**
 * Configure l'écoute des événements de changement de statut
 * Événements supportés :
 * - 'user-status-changed' : quand un utilisateur est approuvé/rejeté
 * - 'ingredient-data-changed' : quand un ingrédient est créé/modifié
 * @param isAdmin - Indique si l'utilisateur est admin
 * @param onUpdate - Callback appelé avec les nouveaux compteurs
 * @returns Fonction de nettoyage pour arrêter l'écoute
 */
export function setupAdminNotificationsListener(
  isAdmin: boolean,
  onUpdate: (counts: AdminNotificationCounts) => void
): () => void {
  async function handleNotificationEvent() {
    const counts = await fetchAllAdminNotifications(isAdmin);
    onUpdate(counts);
  }

  // Écoute de tous les événements pertinents
  window.addEventListener(NOTIFICATION_EVENTS.USER_STATUS_CHANGED, handleNotificationEvent);
  window.addEventListener(NOTIFICATION_EVENTS.INGREDIENT_DATA_CHANGED, handleNotificationEvent);

  return () => {
    window.removeEventListener(NOTIFICATION_EVENTS.USER_STATUS_CHANGED, handleNotificationEvent);
    window.removeEventListener(NOTIFICATION_EVENTS.INGREDIENT_DATA_CHANGED, handleNotificationEvent);
  };
}
