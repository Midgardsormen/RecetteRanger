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
 * Compensate for scrollbar width to prevent layout shift
 */
export function disableBodyScroll(): void {
  // Calculer la largeur de la scrollbar avant de la masquer
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  // Bloquer le scroll
  document.body.style.overflow = 'hidden';

  // Compenser la disparition de la scrollbar pour éviter le flickering
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

/**
 * Enable body scroll when modal is closed
 * Restore original scroll and padding
 */
export function enableBodyScroll(): void {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
