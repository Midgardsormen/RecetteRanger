/**
 * Tag Actions
 * Business logic for the Tag component
 */

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle remove button click
 * Stops event propagation and calls the onRemove callback
 * @param e - Mouse event
 * @param onRemove - Callback to execute when remove is clicked
 */
export function handleRemoveClick(e: MouseEvent, onRemove?: () => void): void {
  e.stopPropagation();
  onRemove?.();
}
