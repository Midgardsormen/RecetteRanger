/**
 * API centralisée pour les notifications admin
 * Gère tous les compteurs de données incomplètes ou en attente
 */

import { DEFAULT_NOTIFICATION_COUNTS } from './admin-notifications.config';

export interface AdminNotificationCounts {
  pendingUsers: number;
  incompleteIngredients: number;
  // Pour futures implémentations :
  // incompleteRecipes: number;
  // incompleteStores: number;
}

/**
 * Récupère le nombre d'utilisateurs en attente de validation
 */
export async function fetchPendingUsersCount(isAdmin: boolean): Promise<number> {
  if (!isAdmin) {
    return 0;
  }

  try {
    const response = await fetch('/api/users/pending/count');
    if (response.ok) {
      const data = await response.json();
      return data.count || 0;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'utilisateurs en attente:', error);
  }

  return 0;
}

/**
 * Récupère le nombre d'ingrédients incomplets (sans image ou unités)
 */
export async function fetchIncompleteIngredientsCount(isAdmin: boolean): Promise<number> {
  if (!isAdmin) {
    return 0;
  }

  try {
    const response = await fetch('/api/ingredients/incomplete/count');
    if (response.ok) {
      const data = await response.json();
      return data.count || 0;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'ingrédients incomplets:', error);
  }

  return 0;
}

/**
 * Récupère tous les compteurs de notifications admin en une seule fois
 */
export async function fetchAllAdminNotifications(isAdmin: boolean): Promise<AdminNotificationCounts> {
  if (!isAdmin) {
    return { ...DEFAULT_NOTIFICATION_COUNTS };
  }

  // Exécuter toutes les requêtes en parallèle pour optimiser les performances
  const [pendingUsers, incompleteIngredients] = await Promise.all([
    fetchPendingUsersCount(isAdmin),
    fetchIncompleteIngredientsCount(isAdmin),
  ]);

  return {
    pendingUsers,
    incompleteIngredients,
  };
}

/**
 * Calcule le total de toutes les notifications admin
 */
export function getTotalNotificationsCount(counts: AdminNotificationCounts): number {
  return counts.pendingUsers + counts.incompleteIngredients;
}
