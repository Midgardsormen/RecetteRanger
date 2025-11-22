/**
 * Modal Actions
 * Event handlers and business logic for the Modal component
 */

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle overlay click - close modal only if clicking the overlay itself
 */
export function handleOverlayClick(e: MouseEvent, onClose: () => void): void {
  if (e.target === e.currentTarget) {
    onClose();
  }
}

// ============================================
// BODY SCROLL MANAGEMENT
// ============================================

/**
 * Disable body scroll when modal is open
 */
export function disableBodyScroll(): void {
  document.body.style.overflow = 'hidden';
}

/**
 * Enable body scroll when modal is closed
 */
export function enableBodyScroll(): void {
  document.body.style.overflow = '';
}
