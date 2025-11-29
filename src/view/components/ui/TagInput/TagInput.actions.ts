/**
 * TagInput Actions
 *
 * Logique métier et gestionnaires d'événements pour TagInput
 */

/**
 * Ajoute un nouvel élément à la liste s'il est valide
 */
export function addItem(
  value: string,
  items: string[],
  onUpdate: (items: string[]) => void
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return value; // Retourne la valeur inchangée si vide
  }

  if (items.includes(trimmed)) {
    return value; // Retourne la valeur inchangée si déjà présent
  }

  onUpdate([...items, trimmed]);
  return ''; // Reset la valeur
}

/**
 * Supprime un élément de la liste par son index
 */
export function removeItem(
  index: number,
  items: string[],
  onUpdate: (items: string[]) => void
): void {
  const updated = [...items];
  updated.splice(index, 1);
  onUpdate(updated);
}

/**
 * Gère la touche Enter pour ajouter un élément
 */
export function handleKeydown(
  event: KeyboardEvent,
  value: string,
  items: string[],
  onUpdate: (items: string[]) => void,
  onValueChange: (value: string) => void
): void {
  if (event.key === 'Enter') {
    event.preventDefault();
    const newValue = addItem(value, items, onUpdate);
    onValueChange(newValue);
  }
}
