<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    isOpen?: boolean;
    children?: Snippet;
  }

  let {
    title,
    isOpen = $bindable(false),
    children
  }: Props = $props();

  function toggle() {
    isOpen = !isOpen;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div class="accordion">
  <button
    class="accordion__header"
    class:accordion__header--open={isOpen}
    onclick={toggle}
    onkeydown={handleKeydown}
    type="button"
    aria-expanded={isOpen}
  >
    <span class="accordion__title">{title}</span>
    <span class="accordion__icon" class:accordion__icon--open={isOpen}>
      ▼
    </span>
  </button>

  {#if isOpen}
    <div class="accordion__content">
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
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .accordion {
    border: 2px solid $border-color;
    border-radius: 8px;
    background: $white;
    overflow: hidden;
  }

  .accordion__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    background: $white;
    border: none;
    cursor: pointer;
    transition: all $transition-duration ease;
    text-align: left;

    &:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    &:focus-visible {
      outline: 2px solid $primary-color;
      outline-offset: -2px;
    }

    &--open {
      border-bottom: 1px solid $border-color;
    }
  }

  .accordion__title {
    font-weight: 600;
    color: $text-dark;
    font-size: 0.95rem;
  }

  .accordion__icon {
    color: $text-gray;
    font-size: 0.75rem;
    transition: transform $transition-duration ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  .accordion__content {
    padding: $spacing-base;
    animation: slideDown $transition-duration ease;
  }

  @keyframes slideDown {
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
