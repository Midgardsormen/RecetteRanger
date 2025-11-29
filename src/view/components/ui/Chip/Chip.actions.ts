/**
 * Actions pour le composant Chip
 */

/**
 * Gère la suppression d'un chip
 */
export function handleRemove(onRemove?: () => void): void {
  if (onRemove) {
    onRemove();
  }
}

/**
 * Gère le clic sur un chip
 */
export function handleClick(event: MouseEvent, onClick?: () => void): void {
  if (onClick) {
    event.stopPropagation();
    onClick();
  }
}
