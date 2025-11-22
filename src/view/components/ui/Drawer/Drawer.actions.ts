/**
 * Drawer Actions
 * Business logic and event handlers for the Drawer component
 */

import { createFocusTrap, type FocusTrap } from '../../../utils';

// ============================================
// FOCUS TRAP MANAGEMENT
// ============================================

/**
 * Setup and manage focus trap for drawer accessibility
 */
export function setupFocusTrap(
  isOpen: boolean,
  drawerElement: HTMLDivElement | undefined,
  onClose: () => void,
  currentFocusTrap: FocusTrap | null
): { focusTrap: FocusTrap | null; cleanup: () => void } {
  let focusTrap = currentFocusTrap;

  if (isOpen && drawerElement) {
    if (!focusTrap) {
      focusTrap = createFocusTrap({
        element: drawerElement,
        onEscape: onClose,
        autoFocus: true
      });
    } else {
      focusTrap.updateElement(drawerElement);
    }
    focusTrap.activate();
  } else if (focusTrap) {
    focusTrap.deactivate();
  }

  const cleanup = () => {
    if (focusTrap) {
      focusTrap.deactivate();
    }
  };

  return { focusTrap, cleanup };
}

// ============================================
// BODY SCROLL MANAGEMENT
// ============================================

/**
 * Block body scroll when drawer is open
 */
export function setupBodyScrollLock(isOpen: boolean): () => void {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  // Cleanup function
  return () => {
    document.body.style.overflow = '';
  };
}
