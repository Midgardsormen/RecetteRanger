/**
 * List Management Utilities
 *
 * Utilitaires réutilisables pour la gestion de listes (add, remove, update, move)
 */

/**
 * Ajoute un élément au début de la liste
 */
export function addToList<T>(
  newItem: T,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  onUpdate([newItem, ...items]);
}

/**
 * Ajoute un élément à la fin de la liste
 */
export function appendToList<T>(
  newItem: T,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  onUpdate([...items, newItem]);
}

/**
 * Supprime un élément de la liste par son index
 */
export function removeFromList<T>(
  index: number,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  const updated = [...items];
  updated.splice(index, 1);
  onUpdate(updated);
}

/**
 * Met à jour un élément de la liste par son index
 */
export function updateInList<T>(
  index: number,
  updates: Partial<T>,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  const updated = [...items];
  updated[index] = { ...updated[index], ...updates };
  onUpdate(updated);
}

/**
 * Déplace un élément vers le haut dans la liste
 */
export function moveUpInList<T>(
  index: number,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  if (index <= 0) return;

  const updated = [...items];
  [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
  onUpdate(updated);
}

/**
 * Déplace un élément vers le bas dans la liste
 */
export function moveDownInList<T>(
  index: number,
  items: T[],
  onUpdate: (items: T[]) => void
): void {
  if (index >= items.length - 1) return;

  const updated = [...items];
  [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
  onUpdate(updated);
}

/**
 * Vérifie si un élément existe déjà dans la liste (par propriété)
 */
export function existsInList<T>(
  item: T,
  items: T[],
  keyExtractor: (item: T) => any
): boolean {
  const key = keyExtractor(item);
  return items.some(i => keyExtractor(i) === key);
}

/**
 * Trouve l'index d'un élément dans la liste (par propriété)
 */
export function findIndexInList<T>(
  item: T,
  items: T[],
  keyExtractor: (item: T) => any
): number {
  const key = keyExtractor(item);
  return items.findIndex(i => keyExtractor(i) === key);
}
