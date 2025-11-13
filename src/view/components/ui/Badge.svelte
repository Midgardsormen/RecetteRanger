<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
    size?: 'small' | 'medium' | 'large';
    pill?: boolean;
    dot?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'neutral',
    size = 'medium',
    pill = false,
    dot = false,
    children
  }: Props = $props();
</script>

<span
  class="badge"
  class:badge--primary={variant === 'primary'}
  class:badge--secondary={variant === 'secondary'}
  class:badge--success={variant === 'success'}
  class:badge--danger={variant === 'danger'}
  class:badge--warning={variant === 'warning'}
  class:badge--info={variant === 'info'}
  class:badge--neutral={variant === 'neutral'}
  class:badge--small={size === 'small'}
  class:badge--medium={size === 'medium'}
  class:badge--large={size === 'large'}
  class:badge--pill={pill}
  class:badge--dot={dot}
>
  {#if dot}
    <span class="badge__dot"></span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</span>

<style lang="scss">
  @use '../../styles/variables' as *;

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    font-family: $font-family-base;
    font-weight: $font-weight-semibold;
    line-height: 1;
    white-space: nowrap;
    border-radius: $radius-md;
    transition: all $transition-base $transition-ease;

    // Sizes
    &--small {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;
    }

    &--medium {
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-sm;
    }

    &--large {
      padding: $spacing-md $spacing-base;
      font-size: $font-size-base;
    }

    // Variants
    &--primary {
      background: $brand-primary;
      color: $color-white;
    }

    &--secondary {
      background: $brand-secondary;
      color: $color-white;
    }

    &--success {
      background: $color-success;
      color: $color-white;
    }

    &--danger {
      background: $color-danger;
      color: $color-white;
    }

    &--warning {
      background: $color-warning;
      color: $color-white;
    }

    &--info {
      background: $color-info;
      color: $color-white;
    }

    &--neutral {
      background: $color-gray-200;
      color: $color-text-primary;
    }

    // Modifiers
    &--pill {
      border-radius: $radius-full;
    }

    &--dot {
      padding-left: $spacing-xs;
    }
  }

  .badge__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }
</style>
