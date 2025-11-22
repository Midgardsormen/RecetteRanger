/**
 * Dropdown Actions
 * Business logic and event handlers for the Dropdown component
 */

import { DROPDOWN_KEYS } from './Dropdown.config';

// ============================================
// STATE MANAGEMENT
// ============================================

/**
 * Toggle the dropdown open/close state
 */
export function createToggleHandler(
  isOpenState: () => boolean,
  setIsOpen: (value: boolean) => void
): () => void {
  return () => {
    setIsOpen(!isOpenState());
  };
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle clicks outside the dropdown to close it
 */
export function createClickOutsideHandler(
  dropdownRef: HTMLDivElement,
  setIsOpen: (value: boolean) => void
): (event: MouseEvent) => void {
  return (event: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
}

/**
 * Handle keyboard events (ESC key to close)
 */
export function createKeydownHandler(
  isOpenState: () => boolean,
  setIsOpen: (value: boolean) => void,
  triggerRef: HTMLButtonElement | null
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === DROPDOWN_KEYS.escape && isOpenState()) {
      setIsOpen(false);
      triggerRef?.focus();
    }
  };
}

// ============================================
// EFFECT HELPERS
// ============================================

/**
 * Setup event listeners for click outside and keyboard events
 */
export function setupEventListeners(
  isOpen: boolean,
  clickOutsideHandler: (event: MouseEvent) => void,
  keydownHandler: (e: KeyboardEvent) => void
): () => void {
  if (isOpen) {
    document.addEventListener('click', clickOutsideHandler);
    document.addEventListener('keydown', keydownHandler);
  } else {
    document.removeEventListener('click', clickOutsideHandler);
    document.removeEventListener('keydown', keydownHandler);
  }

  // Cleanup function
  return () => {
    document.removeEventListener('click', clickOutsideHandler);
    document.removeEventListener('keydown', keydownHandler);
  };
}
