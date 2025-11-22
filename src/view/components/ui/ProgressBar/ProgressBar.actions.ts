/**
 * ProgressBar Actions
 * Business logic and calculations for the ProgressBar component
 */

// ============================================
// CALCULATIONS
// ============================================

/**
 * Calculate the percentage value based on current value and max
 * Ensures the result is between 0 and 100
 * @param value - Current progress value
 * @param max - Maximum progress value
 * @returns Percentage value between 0 and 100
 */
export function calculatePercentage(value: number, max: number): number {
  return Math.min(Math.max((value / max) * 100, 0), 100);
}

// ============================================
// FORMATTERS
// ============================================

/**
 * Get the display label for the progress bar
 * Uses custom label if provided, otherwise shows percentage
 * @param customLabel - Optional custom label
 * @param percentage - The calculated percentage
 * @returns The label to display
 */
export function getDisplayLabel(customLabel: string | undefined, percentage: number): string {
  if (customLabel) {
    return customLabel;
  }
  return `${Math.round(percentage)}%`;
}
