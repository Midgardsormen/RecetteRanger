/**
 * Tile Actions
 * Business logic for the Tile component
 */

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle tile click
 * Only triggers if not disabled, clickable, and onclick callback is provided
 * @param disabled - Whether the tile is disabled
 * @param clickable - Whether the tile is clickable
 * @param onclick - Callback to execute when clicked
 */
export function handleClick(disabled: boolean, clickable: boolean, onclick?: () => void): void {
  if (!disabled && clickable && onclick) {
    onclick();
  }
}

/**
 * Handle keyboard navigation
 * Triggers click on Enter or Space key
 * @param e - Keyboard event
 * @param disabled - Whether the tile is disabled
 * @param clickable - Whether the tile is clickable
 * @param onclick - Callback to execute when activated
 */
export function handleKeydown(
  e: KeyboardEvent,
  disabled: boolean,
  clickable: boolean,
  onclick?: () => void
): void {
  if (!disabled && clickable && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    handleClick(disabled, clickable, onclick);
  }
}
