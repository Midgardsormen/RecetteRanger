/**
 * Focus Trap Utility
 *
 * Gère le piégeage du focus dans un élément (modal, drawer, etc.)
 * pour l'accessibilité (a11y)
 */

export interface FocusTrapOptions {
  /** Élément conteneur dans lequel piéger le focus */
  element: HTMLElement;
  /** Callback appelé quand Escape est pressé */
  onEscape?: () => void;
  /** Focus automatiquement le premier élément à l'activation */
  autoFocus?: boolean;
}

export class FocusTrap {
  private element: HTMLElement;
  private onEscape?: () => void;
  private autoFocus: boolean;
  private previousActiveElement: HTMLElement | null = null;
  private isActive = false;

  constructor(options: FocusTrapOptions) {
    this.element = options.element;
    this.onEscape = options.onEscape;
    this.autoFocus = options.autoFocus ?? true;
  }

  /**
   * Récupère tous les éléments focusables dans le conteneur
   */
  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
      this.element.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }

  /**
   * Gère l'événement keydown pour le trap focus
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isActive) return;

    // Fermer avec Escape
    if (e.key === 'Escape' && this.onEscape) {
      this.onEscape();
      return;
    }

    // Trap focus avec Tab
    if (e.key === 'Tab') {
      const focusableElements = this.getFocusableElements();

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab : si on est sur le premier, aller au dernier
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab : si on est sur le dernier, aller au premier
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  };

  /**
   * Active le trap focus
   */
  activate(): void {
    if (this.isActive) return;

    this.isActive = true;

    // Sauvegarder l'élément actuellement focusé
    this.previousActiveElement = document.activeElement as HTMLElement;

    // Focus automatique sur le premier élément focusable
    if (this.autoFocus) {
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length > 0) {
        // Petit délai pour laisser le DOM se mettre à jour
        setTimeout(() => {
          focusableElements[0]?.focus();
        }, 50);
      }
    }

    // Écouter les événements clavier
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Désactive le trap focus
   */
  deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;

    // Retirer l'écouteur d'événements
    document.removeEventListener('keydown', this.handleKeyDown);

    // Restaurer le focus sur l'élément précédent
    if (this.previousActiveElement) {
      setTimeout(() => {
        this.previousActiveElement?.focus();
      }, 50);
      this.previousActiveElement = null;
    }
  }

  /**
   * Met à jour l'élément conteneur
   */
  updateElement(element: HTMLElement): void {
    this.element = element;
  }
}

/**
 * Hook-like function pour utiliser facilement le focus trap dans Svelte
 */
export function createFocusTrap(options: FocusTrapOptions): FocusTrap {
  return new FocusTrap(options);
}
