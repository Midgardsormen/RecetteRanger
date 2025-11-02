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
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.08);
  $shadow-primary: rgba(102, 126, 234, 0.3);
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .tile {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base * 1.25;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    transition: all $transition-duration ease;

    &--clickable {
      cursor: pointer;

      &:hover:not(&--disabled) {
        border-color: $primary-color;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $shadow-light;
      }

      &:active:not(&--disabled) {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid $primary-color;
        outline-offset: 2px;
      }
    }

    &--selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);

      &:hover:not(&--disabled) {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      }
    }

    &--disabled {
      opacity: 0.5;
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
    font-size: 2rem;
    line-height: 1;
  }

  .tile__content {
    flex: 1;
    min-width: 0;
  }

  .tile__title {
    margin: 0 0 $spacing-base * 0.25 0;
    font-size: 1rem;
    font-weight: 600;
    color: $text-dark;
    line-height: 1.3;
  }

  .tile__subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: $text-gray;
    line-height: 1.4;
  }
</style>
