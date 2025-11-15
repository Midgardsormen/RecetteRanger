<script lang="ts">
  import { createFocusTrap, type FocusTrap } from '../../utils';
  import Button from './Button.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    isOpen?: boolean;
    title?: string;
    showBackButton?: boolean;
    position?: 'left' | 'right';
    variant?: 'default' | 'navigation';
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
    children?: Snippet;
  }

  let {
    isOpen = false,
    title = '',
    showBackButton = false,
    position = 'right',
    variant = 'default',
    onClose,
    onBack,
    primaryAction,
    secondaryAction,
    children
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
    class:drawer-overlay--left={position === 'left'}
    onclick={handleOverlayClick}
    role="presentation"
  >
    <div
      class="drawer drawer--{position} drawer--{variant}"
      class:drawer--open={isOpen}
      bind:this={drawerElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
    >
      <!-- Header (only for default variant) -->

        <div
        class:drawer__header--navigation={variant=='navigation'} 
        class="drawer__header">
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

          {#if title}
            <h2 id="drawer-title" class="drawer__title">{title}</h2>
          {/if}

          <button
            class="drawer__close"
            onclick={onClose}
            type="button"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      

      <!-- Body -->
      <div class="drawer__body" class:drawer__body--full={variant === 'navigation'}>
        {@render children?.()}
      </div>

      <!-- Footer avec actions (only for default variant) -->
      {#if variant === 'default' && (primaryAction || secondaryAction)}
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
  @use '../../styles/variables' as *;

  .drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $color-background-overlay;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: $z-index-modal;
    animation: fadeIn $transition-slow ease;

    &--left {
      justify-content: flex-start;
    }
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
    background: $color-white;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 24px $color-black-alpha-10;

    @media (min-width: $breakpoint-md) {
      max-width: 600px;
    }

    @media (min-width: $breakpoint-lg) {
      max-width: 700px;
    }

    // Position variants
    &--right {
      transform: translateX(100%);
      animation: slideInRight $transition-slow ease forwards;

      &.drawer--open {
        transform: translateX(0);
      }
    }

    &--left {
      transform: translateX(-100%);
      animation: slideInLeft $transition-slow ease forwards;
      box-shadow: 4px 0 24px $color-black-alpha-10;

      &.drawer--open {
        transform: translateX(0);
      }

    }

    // Variant navigation
    &--navigation {
      background: $brand-primary;
      padding: 0;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .drawer__header {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-lg;
    border-bottom: 1px solid $color-border-primary;
    background: $color-white;
    position: sticky;
    top: 0;
    z-index: 10;
    min-height: 72px;
    &--navigation{
      padding: $spacing-sm;
      justify-content: flex-end;
      min-height: auto;
      background: none;
      border-bottom: none;
      .drawer__close{
        color:$brand-secondary
      }
    }
  }

  .drawer__back {
    background: none;
    border: none;
    font-size: $font-size-2xl;
    color: $color-text-secondary;
    cursor: pointer;
    padding: $spacing-sm;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    transition: all $transition-base;

    &:hover {
      background: rgba($brand-primary, 0.1);
      color: $brand-primary;
    }

    &:focus {
      outline: 2px solid $brand-primary;
      outline-offset: 2px;
    }
  }

  .drawer__title {
    flex: 1;
    margin: 0;
    color: $color-text-primary;
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
  }

  .drawer__close {
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

    &:hover {
      background: $color-danger-alpha-20;
      color: $color-danger;
    }

    &:focus {
      outline: 2px solid $color-danger;
      outline-offset: 2px;
    }
  }


  .drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;

    // Full body variant (for navigation)
    &--full {
      padding: 0;
      height: 100%;
      overflow-y: auto; // Scroll uniquement si nécessaire
    }

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
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

  .drawer__footer {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-lg;
    border-top: 1px solid $color-border-primary;
    background: $color-white;
    position: sticky;
    bottom: 0;
  }

</style>
