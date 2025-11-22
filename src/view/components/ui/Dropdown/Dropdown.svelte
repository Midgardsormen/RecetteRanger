<script lang="ts">
  import type { DropdownProps } from '../../../types/ui.types';
  import { DROPDOWN_DEFAULTS } from './Dropdown.config';
  import {
    createClickOutsideHandler,
    createKeydownHandler,
    setupEventListeners
  } from './Dropdown.actions';

  let {
    trigger,
    children,
    isOpen = $bindable(DROPDOWN_DEFAULTS.isOpen),
    align = DROPDOWN_DEFAULTS.align,
    minWidth = DROPDOWN_DEFAULTS.minWidth
  }: DropdownProps = $props();

  let dropdownRef: HTMLDivElement;
  let triggerRef: HTMLButtonElement;

  function toggle() {
    isOpen = !isOpen;
  }

  // Create event handlers
  const handleClickOutside = $derived(
    createClickOutsideHandler(dropdownRef, (value) => {
      isOpen = value;
    })
  );

  const handleKeydown = $derived(
    createKeydownHandler(
      () => isOpen,
      (value) => {
        isOpen = value;
      },
      triggerRef
    )
  );

  $effect(() => {
    return setupEventListeners(isOpen, handleClickOutside, handleKeydown);
  });
</script>

<div class="dropdown" bind:this={dropdownRef}>
  <button
    class="dropdown__trigger"
    class:dropdown__trigger--open={isOpen}
    style:min-width={minWidth}
    onclick={toggle}
    bind:this={triggerRef}
    type="button"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    {#if trigger}
      {@render trigger()}
    {:else}
      <span>Menu</span>
      <span class="dropdown__arrow" class:dropdown__arrow--open={isOpen}>▼</span>
    {/if}
  </button>

  {#if isOpen}
    <div class="dropdown__content dropdown__content--{align}">
      {#if children}
        {@render children()}
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    font-family: inherit;
    font-size: $font-size-sm;
    color: $color-text-primary;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      border-color: $brand-primary;
    }

    &:focus-visible {
      outline: none;
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;
    }

    &--open {
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;
    }
  }

  .dropdown__arrow {
    font-size: $font-size-xs;
    color: $color-text-secondary;
    transition: transform $transition-base $transition-ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  .dropdown__content {
    position: absolute;
    top: calc(100% + 4px);
    z-index: $z-index-dropdown;
    min-width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    box-shadow: $shadow-dropdown;
    animation: dropdownSlide $transition-base $transition-ease;

    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $color-gray-100;
      border-radius: $radius-sm;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-gray-400;
      border-radius: $radius-sm;

      &:hover {
        background: $color-gray-500;
      }
    }

    // Firefox scrollbar
    scrollbar-width: thin;
    scrollbar-color: $color-gray-400 $color-gray-100;
  }

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
