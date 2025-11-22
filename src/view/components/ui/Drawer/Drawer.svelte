<script lang="ts">
  import { handleOverlayClick, type FocusTrap } from '../../../utils';
  import Button from '../Button.svelte';
  import IconButton from '../IconButton';
  import type { DrawerProps } from '../../../types/ui.types';
  import { DRAWER_DEFAULTS, DRAWER_LABELS, DRAWER_SIZES } from './Drawer.config';
  import { setupFocusTrap, setupBodyScrollLock } from './Drawer.actions';
  import { X, ChevronLeft } from 'lucide-svelte';

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
        {#if showBackButton && onBack}
          <IconButton
            variant={variant === 'navigation' ? 'ghost-inverse' : 'default'}
            size="large"
            onclick={onBack}
            ariaLabel={DRAWER_LABELS.backAriaLabel}
          >
            <ChevronLeft size={24} />
          </IconButton>
        {/if}

        {#if title}
          <h2 id="drawer-title" class="drawer__title">{title}</h2>
        {/if}

        <IconButton
          variant={variant === 'navigation' ? 'ghost-inverse' : 'danger'}
          size="large"
          onclick={onClose}
          ariaLabel={DRAWER_LABELS.closeAriaLabel}
        >
          <X size={24} />
        </IconButton>
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
    box-shadow: $drawer-shadow-right $color-black-alpha-10;

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
      box-shadow: $drawer-shadow-left $color-black-alpha-10;

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

  .drawer__title {
    flex: 1;
    margin: 0;
    color: $color-text-primary;
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
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
