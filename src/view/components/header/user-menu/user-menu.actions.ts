import type { authStore } from '../../../stores/auth.store';
import type { apiService } from '../../../services/api.service';

/**
 * Gère la déconnexion de l'utilisateur
 */
export async function logout(
  authStoreInstance: typeof authStore,
  apiServiceInstance: typeof apiService
): Promise<void> {
  try {
    // Supprimer le cookie côté serveur
    await apiServiceInstance.logout();
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    // Toujours nettoyer le store local même si l'appel API échoue
    authStoreInstance.logout();
    window.location.href = '/';
  }
}

/**
 * Redirige vers la page de connexion
 */
export function navigateToLogin(): void {
  window.location.href = '/login';
}

/**
 * Redirige vers la page d'inscription
 */
export function navigateToRegister(): void {
  window.location.href = '/register';
}

/**
 * Configure le listener pour fermer le dropdown au clic extérieur
 */
export function setupClickOutsideListener(
  menuElement: HTMLElement,
  closeDropdown: () => void
): () => void {
  function handleClickOutside(event: MouseEvent): void {
    if (menuElement && !menuElement.contains(event.target as Node)) {
      closeDropdown();
    }
  }

  document.addEventListener('click', handleClickOutside);

  // Retourne la fonction de cleanup
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}
