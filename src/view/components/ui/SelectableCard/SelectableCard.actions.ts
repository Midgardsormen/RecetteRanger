/**
 * Actions pour le composant SelectableCard
 */

/**
 * Gère la suppression d'une carte sélectionnable
 */
export function handleRemove(onRemove?: () => void): void {
  if (onRemove) {
    onRemove();
  }
}
