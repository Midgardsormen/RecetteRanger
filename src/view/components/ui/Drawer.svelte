<script lang="ts">
  import { createFocusTrap, type FocusTrap } from '../../utils';
  import Button from './Button.svelte';

  interface Props {
    isOpen?: boolean;
    title?: string;
    showBackButton?: boolean;
    onClose: () => void;
    onBack?: () => void;
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
  }

  let {
    isOpen = false,
    title = '',
    showBackButton = false,
    onClose,
    onBack,
    primaryAction,
    secondaryAction
  }: Props = $props();

  let drawerElement: HTMLDivElement;
  let focusTrap: FocusTrap | null = null;

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  // Gestion du focus trap
  $effect(() => {
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

    return () => {
      if (focusTrap) {
        focusTrap.deactivate();
      }
    };
  });

  // Bloquer le scroll du body quand le drawer est ouvert
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
    class="drawer-overlay"
    onclick={handleOverlayClick}
    role="presentation"
  >
    <div
      class="drawer"
      class:drawer--open={isOpen}
      bind:this={drawerElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <!-- Header -->
      <div class="drawer__header">
        {#if showBackButton && onBack}
          <button
            class="drawer__back"
            onclick={onBack}
            type="button"
            aria-label="Retour"
          >
            ←
          </button>
        {/if}

        <h2 id="drawer-title" class="drawer__title">{title}</h2>

        <button
          class="drawer__close"
          onclick={onClose}
          type="button"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <!-- Body avec slot -->
      <div class="drawer__body">
        <slot />
      </div>

      <!-- Footer avec actions -->
      {#if primaryAction || secondaryAction}
        <div class="drawer__footer">
          {#if secondaryAction}
            <Button
              variant="ghost"
              fullWidth
              onclick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </Button>
          {/if}

          {#if primaryAction}
            <Button
              variant="primary"
              fullWidth
              onclick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
            >
              {primaryAction.loading ? 'Chargement...' : primaryAction.label}
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.1);
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 1000;
    animation: fadeIn $transition-duration ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .drawer {
    background: $white;
    width: 100%;
    max-width: 600px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 24px $shadow-light;
    transform: translateX(100%);
    animation: slideIn $transition-duration ease forwards;

    &--open {
      transform: translateX(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .drawer__header {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base * 1.5;
    border-bottom: 1px solid $border-color;
    background: $white;
    position: sticky;
    top: 0;
    z-index: 10;
    min-height: 72px;
  }

  .drawer__back {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: $text-gray;
    cursor: pointer;
    padding: $spacing-base * 0.5;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: $primary-color;
    }

    &:focus {
      outline: 2px solid $primary-color;
      outline-offset: 2px;
    }
  }

  .drawer__title {
    flex: 1;
    margin: 0;
    color: $text-dark;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .drawer__close {
    background: none;
    border: none;
    font-size: 2rem;
    color: $text-gray;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: rgba(245, 101, 101, 0.2);
      color: $danger-color;
    }

    &:focus {
      outline: 2px solid $danger-color;
      outline-offset: 2px;
    }
  }

  .drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-base * 1.5;

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

  .drawer__footer {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-base * 1.5;
    border-top: 1px solid $border-color;
    background: $white;
    position: sticky;
    bottom: 0;
  }

  @media (max-width: 768px) {
    .drawer {
      max-width: 100%;
    }
  }
</style>
