/**
 * NotificationBadge Actions
 * Business logic for the NotificationBadge component
 */

// ============================================
// FORMATTERS
// ============================================

/**
 * Format the notification count for display
 * If count exceeds max, display "max+"
 * @param count - The actual notification count
 * @param max - The maximum count to display before showing "max+"
 * @returns Formatted count string or number
 */
export function formatNotificationCount(count: number, max: number): string | number {
  if (count > max) {
    return `${max}+`;
  }
  return count;
}
