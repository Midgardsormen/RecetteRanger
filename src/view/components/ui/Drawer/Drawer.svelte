<script lang="ts">
  import { handleOverlayClick, type FocusTrap } from '../../../utils';
  import Button from '../Button.svelte';
  import IconButton from '../IconButton';
  import type { DrawerProps } from '../../../types/ui.types';
  import { DRAWER_DEFAULTS, DRAWER_LABELS, DRAWER_SIZES } from './Drawer.config';
  import { setupFocusTrap, setupBodyScrollLock } from './Drawer.actions';
  import { X, ArrowLeft } from 'lucide-svelte';

  let {
    isOpen = DRAWER_DEFAULTS.isOpen,
    title = DRAWER_DEFAULTS.title,
    showBackButton = DRAWER_DEFAULTS.showBackButton,
    position = DRAWER_DEFAULTS.position,
    variant = DRAWER_DEFAULTS.variant,
    onClose,
    onBack,
    primaryAction,
    secondaryAction,
    children
  }: DrawerProps = $props();

  let drawerElement: HTMLDivElement;
  let focusTrap: FocusTrap | null = null;

  // Gestion du focus trap
  $effect(() => {
    const result = setupFocusTrap(isOpen, drawerElement, onClose, focusTrap);
    focusTrap = result.focusTrap;
    return result.cleanup;
  });

  // Bloquer le scroll du body quand le drawer est ouvert
  $effect(() => {
    return setupBodyScrollLock(isOpen);
  });
</script>

{#if isOpen}
  <div
    class="drawer-overlay"
    class:drawer-overlay--left={position === 'left'}
    onclick={(e) => handleOverlayClick(e, onClose)}
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
      <!-- Header -->
      <div
        class:drawer__header--navigation={variant === 'navigation'}
        class="drawer__header"
      >
        <span class="drawer__back" class:drawer__back--hidden={!showBackButton || !onBack}>
          {#if showBackButton && onBack}
            <IconButton
              variant={variant === 'navigation' ? 'ghost-inverse' : 'default'}
              size="large"
              onclick={onBack}
              ariaLabel={DRAWER_LABELS.backAriaLabel}
            >
              <ArrowLeft size={24} />
            </IconButton>
          {/if}
        </span>

        {#if title}
          <h2 id="drawer-title" class="drawer__title">{title}</h2>
        {/if}
        <span class="drawer__close">
          <IconButton
            variant={variant === 'navigation' ? 'ghost-inverse' : 'default'}
            size="large"
            onclick={onClose}
            ariaLabel={DRAWER_LABELS.closeAriaLabel}
          >
            <X size={24} />
          </IconButton>
        </span>
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
              {primaryAction.loading ? DRAWER_LABELS.loadingText : primaryAction.label}
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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

  .drawer {
    background: $color-white;
    width: 100%;
    max-width: 410px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: $drawer-shadow-right $color-black-alpha-10;

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
      box-shadow: $drawer-shadow-left $color-black-alpha-10;

      &.drawer--open {
        transform: translateX(0);
      }
    }

    // Variant navigation
    &--navigation {
      background: $drawer-body-background;
      padding: 0;
      max-width: 320px; // Largeur réduite pour le menu de navigation
    }

    &__header {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-sm;
      border-bottom: 1px solid $color-border-primary;
      background: $color-white;
      position: sticky;
      top: 0;
      z-index: $z-index-drawer-header;
      min-height: $drawer-header-min-height;

      &--navigation {
        padding: $spacing-sm;
        justify-content: flex-end;
        min-height: auto;
        background: none;
        border-bottom: none;
      }
    }

    &__back {
      display: flex;
      align-items: center;
      min-width: 48px; // Réserver l'espace pour le bouton

      &--hidden {
        visibility: hidden; // Cache le bouton mais garde l'espace
      }
    }

    &__title {
      flex: 1;
      margin: 0;
      color: $color-text-primary;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
    }

    &__close {
      align-self: flex-start;
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      padding: $spacing-lg $spacing-sm;
      background-color: $drawer-body-background;

      // Réduire le padding sur mobile pour éviter le débordement des selects
      @media (min-width: $breakpoint-sm) {
        padding: $spacing-xl $spacing-sm;
      }
      // Full body variant (for navigation)
      &--full {
        padding: 0;
        height: 100%;
        overflow-y: auto; // Scroll uniquement si nécessaire
        background-color: $drawer-body-background;
      }

      // Styles inverses pour les form-fields dans le drawer
      :global(.form-field__label) {
        color: $color-text-inverse;
      }

      :global(.form-field__required) {
        color: $color-danger-light;
      }

      :global(.form-field__hint) {
        color: rgba(255, 255, 255, 0.7);
      }

      :global(.form-field__error) {
        color: $color-danger-light;
      }

      // Styles inverses pour les form-label dans le drawer
      :global(.form-label) {
        color: $color-text-inverse;
      }

      // Styles inverses pour les section-title dans le drawer
      :global(.section-title:not(.section-title--inverse)) {
        color: $color-text-inverse;
      }

      // Force le variant inverse pour ImageUpload dans le drawer
      :global(.image-upload:not(.image-upload--inverse) .image-upload__preview-img) {
        border-color: $color-white-alpha-30;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone) {
        border-color: $color-white-alpha-30;
        background: $color-white-alpha-10;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone:hover) {
        border-color: $color-white;
        background: $color-white-alpha-15;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone--dragging) {
        border-color: $color-white;
        background: $color-white-alpha-20;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone-icon) {
        color: $color-white;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone-text) {
        color: $color-white;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__dropzone-hint) {
        color: rgba(255, 255, 255, 0.7);
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__cropper-container) {
        border-color: $color-white-alpha-30;
      }

      :global(.image-upload:not(.image-upload--inverse) .image-upload__error) {
        background: rgba(220, 38, 38, 0.2);
        border-color: $color-danger-light;
        color: $color-danger-light;
      }

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: $drawer-scrollbar-width;
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

    &__footer {
      display: flex;
      gap: $spacing-base;
      padding: $spacing-lg;
      border-top: 1px solid $color-border-primary;
      background: $color-white;
      position: sticky;
      bottom: 0;
    }
  }
</style>
