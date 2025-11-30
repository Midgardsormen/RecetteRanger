/**
 * Actions pour le composant Checkbox
 */

/**
 * Gère le changement d'état du checkbox
 */
export function handleChange(
  checked: boolean,
  onChange?: (checked: boolean) => void
): void {
  if (onChange) {
    onChange(checked);
  }
}
