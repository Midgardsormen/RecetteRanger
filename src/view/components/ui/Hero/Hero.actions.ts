/**
 * Hero Actions
 * Business logic for the Hero component
 */

// ============================================
// STYLE GENERATION
// ============================================

/**
 * Generate inline styles for the Hero component
 */
export function generateHeroStyles(
  backgroundImage?: string,
  backgroundColor?: string,
  padding?: string,
  overlay?: boolean,
  overlayOpacity?: number
): string {
  const styles: string[] = [];

  if (backgroundImage) {
    styles.push(`background-image: url('${backgroundImage}')`);
  }

  if (backgroundColor) {
    styles.push(`background-color: ${backgroundColor}`);
    styles.push(`--overlay-color: ${backgroundColor}`);
  }

  if (padding) {
    styles.push(`padding: ${padding}`);
  }

  if (overlay && overlayOpacity !== undefined) {
    styles.push(`--overlay-opacity: ${overlayOpacity}`);
  }

  return styles.join('; ');
}
