/**
 * Récupère le nombre d'utilisateurs en attente de validation (pour les admins)
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
 * Configure un intervalle pour rafraîchir périodiquement le nombre d'utilisateurs en attente
 */
export function setupPendingCountRefresh(
  isAdmin: boolean,
  onUpdate: (count: number) => void,
  intervalMs: number = 30000
): () => void {
  // Fetch initial
  fetchPendingUsersCount(isAdmin).then(onUpdate);

  // Setup interval
  const interval = setInterval(async () => {
    const count = await fetchPendingUsersCount(isAdmin);
    onUpdate(count);
  }, intervalMs);

  // Retourne la fonction de cleanup
  return () => {
    clearInterval(interval);
  };
}

/**
 * Configure le listener pour rafraîchir le compteur lors d'un changement de statut utilisateur
 */
export function setupUserStatusListener(
  isAdmin: boolean,
  onUpdate: (count: number) => void
): () => void {
  async function handleUserStatusChanged() {
    const count = await fetchPendingUsersCount(isAdmin);
    onUpdate(count);
  }

  window.addEventListener('user-status-changed', handleUserStatusChanged);

  // Retourne la fonction de cleanup
  return () => {
    window.removeEventListener('user-status-changed', handleUserStatusChanged);
  };
}
