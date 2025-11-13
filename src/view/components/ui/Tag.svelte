<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
    size?: 'small' | 'medium' | 'large';
    removable?: boolean;
    onRemove?: () => void;
    onclick?: () => void;
    children?: Snippet;
  }

  let {
    variant = 'neutral',
    size = 'medium',
    removable = false,
    onRemove,
    onclick,
    children
  }: Props = $props();

  function handleRemoveClick(e: MouseEvent) {
    e.stopPropagation();
    onRemove?.();
  }
</script>

<span
  class="tag"
  class:tag--primary={variant === 'primary'}
  class:tag--secondary={variant === 'secondary'}
  class:tag--success={variant === 'success'}
  class:tag--danger={variant === 'danger'}
  class:tag--warning={variant === 'warning'}
  class:tag--info={variant === 'info'}
  class:tag--neutral={variant === 'neutral'}
  class:tag--small={size === 'small'}
  class:tag--medium={size === 'medium'}
  class:tag--large={size === 'large'}
  class:tag--clickable={!!onclick}
  class:tag--removable={removable}
  role={onclick ? 'button' : undefined}
  tabindex={onclick ? 0 : undefined}
  {onclick}
>
  <span class="tag__content">
    {#if children}
      {@render children()}
    {/if}
  </span>
  {#if removable}
    <button
      class="tag__remove"
      onclick={handleRemoveClick}
      type="button"
      aria-label="Supprimer"
    >
      ✕
    </button>
  {/if}
</span>

<style lang="scss">
  @use '../../styles/variables' as *;

  .tag {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-family: $font-family-base;
    font-weight: $font-weight-medium;
    line-height: 1;
    white-space: nowrap;
    border-radius: $radius-md;
    border: 1px solid transparent;
    transition: all $transition-base $transition-ease;
    cursor: default;

    // Sizes
    &--small {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;

      .tag__remove {
        width: 14px;
        height: 14px;
        font-size: 10px;
      }
    }

    &--medium {
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-sm;

      .tag__remove {
        width: 16px;
        height: 16px;
        font-size: 12px;
      }
    }

    &--large {
      padding: $spacing-md $spacing-base;
      font-size: $font-size-base;

      .tag__remove {
        width: 18px;
        height: 18px;
        font-size: 14px;
      }
    }

    // Variants
    &--primary {
      background: rgba($brand-primary, 0.1);
      color: $brand-primary;
      border-color: rgba($brand-primary, 0.2);

      &:hover {
        background: rgba($brand-primary, 0.15);
      }

      .tag__remove:hover {
        background: rgba($brand-primary, 0.2);
      }
    }

    &--secondary {
      background: rgba($brand-secondary, 0.1);
      color: $brand-secondary;
      border-color: rgba($brand-secondary, 0.2);

      &:hover {
        background: rgba($brand-secondary, 0.15);
      }

      .tag__remove:hover {
        background: rgba($brand-secondary, 0.2);
      }
    }

    &--success {
      background: rgba($color-success, 0.1);
      color: $color-success-dark;
      border-color: rgba($color-success, 0.2);

      &:hover {
        background: rgba($color-success, 0.15);
      }

      .tag__remove:hover {
        background: rgba($color-success, 0.2);
      }
    }

    &--danger {
      background: rgba($color-danger, 0.1);
      color: $color-danger-dark;
      border-color: rgba($color-danger, 0.2);

      &:hover {
        background: rgba($color-danger, 0.15);
      }

      .tag__remove:hover {
        background: rgba($color-danger, 0.2);
      }
    }

    &--warning {
      background: rgba($color-warning, 0.1);
      color: $color-warning-dark;
      border-color: rgba($color-warning, 0.2);

      &:hover {
        background: rgba($color-warning, 0.15);
      }

      .tag__remove:hover {
        background: rgba($color-warning, 0.2);
      }
    }

    &--info {
      background: rgba($color-info, 0.1);
      color: $color-info-dark;
      border-color: rgba($color-info, 0.2);

      &:hover {
        background: rgba($color-info, 0.15);
      }

      .tag__remove:hover {
        background: rgba($color-info, 0.2);
      }
    }

    &--neutral {
      background: $color-gray-100;
      color: $color-text-primary;
      border-color: $color-gray-200;

      &:hover {
        background: $color-gray-200;
      }

      .tag__remove:hover {
        background: $color-gray-300;
      }
    }

    // Modifiers
    &--clickable {
      cursor: pointer;

      &:hover {
        transform: translateY(-1px);
        box-shadow: $shadow-sm;
      }

      &:active {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid $brand-primary;
        outline-offset: 2px;
      }
    }

    &--removable {
      padding-right: $spacing-xs;
    }
  }

  .tag__content {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .tag__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    border-radius: 50%;
    transition: all $transition-fast $transition-ease;
    line-height: 1;
    flex-shrink: 0;

    &:hover {
      opacity: 1;
    }

    &:active {
      transform: scale(0.9);
    }
  }
</style>
