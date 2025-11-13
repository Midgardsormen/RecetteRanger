<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    subtitle?: string;
    icon?: string;
    clickable?: boolean;
    selected?: boolean;
    disabled?: boolean;
    onclick?: () => void;
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    icon,
    clickable = false,
    selected = false,
    disabled = false,
    onclick,
    children
  }: Props = $props();

  function handleClick() {
    if (!disabled && clickable && onclick) {
      onclick();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!disabled && clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }
</script>

<div
  class="tile"
  class:tile--clickable={clickable}
  class:tile--selected={selected}
  class:tile--disabled={disabled}
  role={clickable ? 'button' : undefined}
  tabindex={clickable && !disabled ? 0 : undefined}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  {#if icon}
    <div class="tile__icon">{icon}</div>
  {/if}

  <div class="tile__content">
    {#if title}
      <h4 class="tile__title">{title}</h4>
    {/if}
    {#if subtitle}
      <p class="tile__subtitle">{subtitle}</p>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .tile {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-lg;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-xl;
    transition: all $transition-base $transition-ease;

    &--clickable {
      cursor: pointer;

      &:hover:not(&--disabled) {
        border-color: $brand-primary;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $shadow-md;
      }

      &:active:not(&--disabled) {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid $brand-primary;
        outline-offset: 2px;
      }
    }

    &--selected {
      background: rgba($brand-primary, 0.1);
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;

      &:hover:not(&--disabled) {
        background: rgba($brand-primary, 0.15);
      }
    }

    &--disabled {
      opacity: $opacity-50;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .tile__icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-2xl;
    line-height: 1;
  }

  .tile__content {
    flex: 1;
    min-width: 0;
  }

  .tile__title {
    margin: 0 0 $spacing-xs 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  .tile__subtitle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-normal;
  }
</style>
