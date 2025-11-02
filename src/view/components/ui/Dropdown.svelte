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
  $primary-color: #667eea;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.1);
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-base * 0.5;
    padding: $spacing-base * 0.75;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    color: $text-dark;
    cursor: pointer;
    transition: all $transition-duration ease;
    min-width: 200px;

    &:hover {
      border-color: $primary-color;
    }

    &:focus-visible {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &--open {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .dropdown__arrow {
    font-size: 0.75rem;
    color: $text-gray;
    transition: transform $transition-duration ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  .dropdown__content {
    position: absolute;
    top: calc(100% + 4px);
    z-index: 1000;
    min-width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 8px;
    box-shadow: 0 4px 20px $shadow-light;
    animation: dropdownSlide $transition-duration ease;

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
      background: #f1f1f1;
      border-radius: 4px;
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
