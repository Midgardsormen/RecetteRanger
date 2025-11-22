/**
 * ListItem Actions
 * Event handlers and business logic for the ListItem component
 */

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle list item click
 */
export function handleClick(onClick?: () => void): void {
  if (onClick) {
    onClick();
  }
}

/**
 * Handle edit button click with event propagation stop
 */
export function handleEdit(e: Event, onEdit?: () => void): void {
  e.stopPropagation();
  if (onEdit) {
    onEdit();
  }
}

/**
 * Handle delete button click with event propagation stop
 */
export function handleDelete(e: Event, onDelete?: () => void): void {
  e.stopPropagation();
  if (onDelete) {
    onDelete();
  }
}

/**
 * Handle checkbox change with event propagation stop
 */
export function handleCheck(e: Event, onCheck?: (checked: boolean) => void): void {
  e.stopPropagation();
  if (onCheck) {
    const target = e.target as HTMLInputElement;
    onCheck(target.checked);
  }
}
