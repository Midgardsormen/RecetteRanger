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
  @import '../../styles/variables';

  .accordion {
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    background: $color-white;
    overflow: hidden;
  }

  .accordion__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    background: $color-white;
    border: none;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    text-align: left;

    &:hover {
      background: rgba($brand-primary, 0.05);
    }

    &:focus-visible {
      outline: 2px solid $brand-primary;
      outline-offset: -2px;
    }

    &--open {
      border-bottom: 1px solid $color-border-primary;
    }
  }

  .accordion__title {
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-size: $font-size-sm;
  }

  .accordion__icon {
    color: $color-text-secondary;
    font-size: $font-size-xs;
    transition: transform $transition-base $transition-ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  .accordion__content {
    padding: $spacing-base;
    animation: slideDown $transition-base $transition-ease;
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
