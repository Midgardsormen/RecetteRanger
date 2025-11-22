/**
 * UI Utilities
 * Fonctions utilitaires partagées pour les composants UI
 */

import type { Article } from '../types/ui.types';

// ============================================
// ARTICLE AUTOCOMPLETE UTILS
// ============================================

/**
 * Vérifie si une valeur existe déjà dans les suggestions
 */
export function isValueInSuggestions(value: string, suggestions: Article[]): boolean {
  return suggestions.some(s => s.label.toLowerCase() === value.toLowerCase());
}

/**
 * Calcule l'index maximum pour la navigation au clavier
 */
export function getMaxIndex(suggestionsLength: number, allowCreate: boolean): number {
  return suggestionsLength - 1 + (allowCreate ? 1 : 0);
}

/**
 * Détermine si l'index correspond à l'option "créer"
 */
export function isCreateIndex(index: number, suggestionsLength: number): boolean {
  return index === suggestionsLength;
}

// ============================================
// NAVIGATION UTILS
// ============================================

/**
 * Navigate to the author's profile page
 */
export function navigateToProfile(authorId: string): void {
  window.location.href = `/profile/${authorId}`;
}

/**
 * Handle keyboard navigation for accessibility
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

// ============================================
// BREADCRUMB UTILS
// ============================================

/**
 * Handle breadcrumb item click with optional custom callback
 */
export function handleBreadcrumbClick(
  onclick: (() => void) | undefined,
  e: MouseEvent
): void {
  if (onclick) {
    e.preventDefault();
    onclick();
  }
}

// ============================================
// OVERLAY UTILS
// ============================================

/**
 * Handle overlay click to close modal/drawer
 * Only triggers if the click is directly on the overlay (not on children)
 */
export function handleOverlayClick(
  e: MouseEvent,
  onClose: () => void
): void {
  if (e.target === e.currentTarget) {
    onClose();
  }
}

// ============================================
// STRING UTILS
// ============================================

/**
 * Convert a string to kebab-case (lowercase with hyphens)
 * Example: "Hello World" -> "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}
