<script lang="ts">
  /**
   * Modal Component
   *
   * A fully accessible modal dialog with focus trap, backdrop, and customizable actions.
   * Supports primary, secondary, and danger actions with loading states.
   */

  import type { ModalProps } from '../../../types/ui.types';
  import { createFocusTrap, type FocusTrap } from '../../../utils';
  import Button from '../Button.svelte';
  import Spinner from '../Spinner';
  import { X } from 'lucide-svelte';
  import { MODAL_DEFAULTS, MODAL_ARIA_LABELS } from './Modal.config';
  import { handleOverlayClick, disableBodyScroll, enableBodyScroll } from './Modal.actions';

  let {
    isOpen = MODAL_DEFAULTS.isOpen,
    title = MODAL_DEFAULTS.title,
    size = MODAL_DEFAULTS.size,
    showCloseButton = MODAL_DEFAULTS.showCloseButton,
    onClose,
    primaryAction,
    secondaryAction,
    dangerAction,
    children
  }: ModalProps = $props();

  let modalElement: HTMLDivElement;
  let focusTrap: FocusTrap | null = null;

  // Gestion du focus trap
  $effect(() => {
    if (isOpen && modalElement) {
      if (!focusTrap) {
        focusTrap = createFocusTrap({
          element: modalElement,
          onEscape: onClose,
          autoFocus: true
        });
      } else {
        focusTrap.updateElement(modalElement);
      }
      focusTrap.activate();
    } else if (focusTrap) {
      focusTrap.deactivate();
    }

    return () => {
      if (focusTrap) {
        focusTrap.deactivate();
      }
    };
  });

  // Bloquer le scroll du body quand la modal est ouverte
  $effect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    return () => {
      enableBodyScroll();
    };
  });
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    onclick={(e) => handleOverlayClick(e, onClose)}
    role="presentation"
  >
    <div
      class="modal modal--{size}"
      class:modal--open={isOpen}
      bind:this={modalElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <!-- Header -->
      {#if title || showCloseButton}
        <div class="modal__header">
          {#if title}
            <h2 id="modal-title" class="modal__title">{title}</h2>
          {/if}

          {#if showCloseButton}
            <button
              class="modal__close"
              onclick={onClose}
              type="button"
              aria-label={MODAL_ARIA_LABELS.close}
            >
              <X size={24} />
            </button>
          {/if}
        </div>
      {/if}

      <!-- Body avec slot -->
      <div class="modal__body">
        {@render children?.()}
      </div>

      <!-- Footer avec actions -->
      {#if primaryAction || secondaryAction || dangerAction}
        <div class="modal__footer">
          {#if secondaryAction}
            <Button
              variant="secondary"
              onclick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </Button>
          {/if}

          {#if dangerAction}
            <Button
              variant="danger"
              onclick={dangerAction.onClick}
              disabled={dangerAction.disabled}
            >
              {dangerAction.label}
            </Button>
          {/if}

          {#if primaryAction}
            <Button
              variant="primary"
              onclick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
            >
              {#if primaryAction.loading}
                <Spinner size="sm" variant="white" />
                {MODAL_ARIA_LABELS.loading}
              {:else}
                {primaryAction.label}
              {/if}
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $color-background-overlay;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: $z-index-modal;
    padding: $spacing-base;
    animation: fadeIn $transition-slow ease;

    // Mobile: no padding
    @media (max-width: $breakpoint-sm) {
      padding: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: $opacity-0;
    }
    to {
      opacity: $opacity-100;
    }
  }

  .modal {
    background: $color-white;
    border-radius: $radius-xl;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    box-shadow: 0 10px 40px $color-black-alpha-30;
    opacity: $opacity-0;
    transform: scale(0.9) translateY(-20px);
    animation: scaleIn $transition-slow ease forwards;

    // Mobile: full screen
    @media (max-width: $breakpoint-sm) {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
    }

    &--open {
      opacity: $opacity-100;
      transform: scale(1) translateY(0);
    }

    // Tailles
    &--small {
      width: 100%;
      max-width: 400px;

      @media (max-width: $breakpoint-sm) {
        max-width: 100%;
      }
    }

    &--medium {
      width: 100%;
      max-width: 600px;

      @media (max-width: $breakpoint-sm) {
        max-width: 100%;
      }
    }

    &--large {
      width: 100%;
      max-width: 900px;

      @media (max-width: $breakpoint-sm) {
        max-width: 100%;
      }
    }
  }

  @keyframes scaleIn {
    from {
      opacity: $opacity-0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: $opacity-100;
      transform: scale(1) translateY(0);
    }
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: $border-width-thin solid $color-border-primary;
    gap: $spacing-base;
  }

  .modal__title {
    flex: 1;
    margin: 0;
    color: $color-text-primary;
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
  }

  .modal__close {
    background: none;
    border: none;
    font-size: $font-size-2xl;
    color: $color-text-secondary;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    transition: all $transition-base;
    flex-shrink: 0;

    &:hover {
      background: $color-danger-alpha-20;
      color: $color-danger;
    }

    &:focus {
      outline: $border-width-base solid $color-danger;
      outline-offset: $border-width-base;
    }
  }

  .modal__body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: $spacing-sm;
    }

    &::-webkit-scrollbar-track {
      background: $color-gray-100;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-gray-200;
      border-radius: $radius-sm;

      &:hover {
        background: $color-gray-400;
      }
    }

    // Firefox scrollbar
    scrollbar-width: thin;
    scrollbar-color: $color-gray-200 $color-gray-100;
  }

  .modal__footer {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-lg;
    border-top: $border-width-thin solid $color-border-primary;
    justify-content: flex-end;

    // Mobile: stack buttons vertically
    @media (max-width: $breakpoint-sm) {
      flex-direction: column-reverse;

      :global(button) {
        width: 100%;
      }
    }
  }
</style>
