<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    trigger?: Snippet;
    children?: Snippet;
    isOpen?: boolean;
    align?: 'left' | 'right';
  }

  let {
    trigger,
    children,
    isOpen = $bindable(false),
    align = 'left'
  }: Props = $props();

  let dropdownRef: HTMLDivElement;
  let triggerRef: HTMLButtonElement;

  function toggle() {
    isOpen = !isOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      triggerRef?.focus();
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="dropdown" bind:this={dropdownRef}>
  <button
    class="dropdown__trigger"
    class:dropdown__trigger--open={isOpen}
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
  @use '../../styles/variables' as *;

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
    min-width: 200px;

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
    box-shadow: 0 4px 20px $shadow-md;
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
