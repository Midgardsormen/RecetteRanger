<script lang="ts">
  import { onMount } from 'svelte';
  import { createFocusTrap, type FocusTrap } from '../../utils';
  import type { Snippet } from 'svelte';

  interface Props {
    isOpen?: boolean;
    title?: string;
    size?: 'small' | 'medium' | 'large';
    showCloseButton?: boolean;
    onClose: () => void;
    primaryAction?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
      loading?: boolean;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    };
    dangerAction?: {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    };
    children?: Snippet;
  }

  let {
    isOpen = false,
    title = '',
    size = 'medium',
    showCloseButton = true,
    onClose,
    primaryAction,
    secondaryAction,
    dangerAction,
    children
  }: Props = $props();

  let modalElement: HTMLDivElement;
  let focusTrap: FocusTrap | null = null;

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

{#if isOpen}
  <div
    class="modal-overlay"
    onclick={handleOverlayClick}
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
              aria-label="Fermer"
            >
              ✕
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
            <button
              class="modal__btn modal__btn--secondary"
              onclick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              type="button"
            >
              {secondaryAction.label}
            </button>
          {/if}

          {#if dangerAction}
            <button
              class="modal__btn modal__btn--danger"
              onclick={dangerAction.onClick}
              disabled={dangerAction.disabled}
              type="button"
            >
              {dangerAction.label}
            </button>
          {/if}

          {#if primaryAction}
            <button
              class="modal__btn modal__btn--primary"
              onclick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
              type="button"
            >
              {primaryAction.loading ? 'Chargement...' : primaryAction.label}
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @import '../../styles/variables';

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
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    background: $color-white;
    border-radius: $radius-xl;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
    animation: scaleIn $transition-slow ease forwards;

    &--open {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    // Tailles
    &--small {
      width: 100%;
      max-width: 400px;
    }

    &--medium {
      width: 100%;
      max-width: 600px;
    }

    &--large {
      width: 100%;
      max-width: 900px;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $color-border-primary;
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
    font-size: 2rem;
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
      background: rgba(245, 101, 101, 0.2);
      color: $color-danger;
    }

    &:focus {
      outline: 2px solid $color-danger;
      outline-offset: 2px;
    }
  }

  .modal__body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;

      &:hover {
        background: #a8a8a8;
      }
    }

    // Firefox scrollbar
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }

  .modal__footer {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-base * 1.5;
    border-top: 1px solid $color-border-primary;
    justify-content: flex-end;
  }

  .modal__btn {
    padding: $spacing-base * 0.75 $spacing-base * 1.5;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 100px;

    &:focus {
      outline: 2px solid $brand-primary;
      outline-offset: 2px;
    }

    &--secondary {
      background: rgba(102, 102, 102, 0.1);
      color: $color-text-secondary;

      &:hover:not(:disabled) {
        background: rgba(102, 102, 102, 0.2);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &--primary {
      @include brand-gradient;
      color: $color-white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }

    &--danger {
      background: $color-danger;
      color: $color-white;

      &:hover:not(:disabled) {
        background: #e03e3e;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  @media (max-width: 768px) {
    .modal {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;

      &--small,
      &--medium,
      &--large {
        max-width: 100%;
      }
    }

    .modal-overlay {
      padding: 0;
    }
  }
</style>
