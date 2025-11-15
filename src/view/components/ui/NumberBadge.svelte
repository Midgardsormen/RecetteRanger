<script lang="ts">
  let {
    number,
    size = 'medium',
    variant = 'filled',
    color = 'primary',
    shape = 'circle'
  }: {
    number: number | string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'filled' | 'outlined' | 'ghost';
    color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
    shape?: 'circle' | 'rounded' | 'square';
  } = $props();
</script>

<div
  class="number-badge"
  class:number-badge--small={size === 'small'}
  class:number-badge--medium={size === 'medium'}
  class:number-badge--large={size === 'large'}
  class:number-badge--filled={variant === 'filled'}
  class:number-badge--outlined={variant === 'outlined'}
  class:number-badge--ghost={variant === 'ghost'}
  class:number-badge--circle={shape === 'circle'}
  class:number-badge--rounded={shape === 'rounded'}
  class:number-badge--square={shape === 'square'}
  class:number-badge--{color}={true}
>
  {number}
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .number-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: $font-weight-semibold;
    flex-shrink: 0;
    transition: all $transition-base $transition-ease;

    // Sizes
    &--small {
      width: 24px;
      height: 24px;
      font-size: $font-size-xs;
    }

    &--medium {
      width: 36px;
      height: 36px;
      font-size: $font-size-base;
    }

    &--large {
      width: 48px;
      height: 48px;
      font-size: $font-size-lg;
    }

    // Shapes
    &--circle {
      border-radius: 50%;
    }

    &--rounded {
      border-radius: $radius-md;
    }

    &--square {
      border-radius: 0;
    }

    // Variant: Filled
    &--filled {
      &.number-badge--primary {
        background: $brand-primary;
        color: $color-white;
      }

      &.number-badge--secondary {
        background: $brand-secondary;
        color: $color-white;
      }

      &.number-badge--tertiary {
        background: $brand-tertiary;
        color: $color-white;
      }

      &.number-badge--quaternary {
        background: $brand-quaternary;
        color: $color-white;
      }

      &.number-badge--success {
        background: $color-success;
        color: $color-white;
      }

      &.number-badge--danger {
        background: $color-danger;
        color: $color-white;
      }

      &.number-badge--warning {
        background: $color-warning;
        color: $color-gray-900;
      }

      &.number-badge--info {
        background: $color-info;
        color: $color-white;
      }

      &.number-badge--neutral {
        background: $color-gray-500;
        color: $color-white;
      }
    }

    // Variant: Outlined
    &--outlined {
      background: transparent;
      border: 2px solid;

      &.number-badge--primary {
        border-color: $brand-primary;
        color: $brand-primary;
      }

      &.number-badge--secondary {
        border-color: $brand-secondary;
        color: $brand-secondary;
      }

      &.number-badge--tertiary {
        border-color: $brand-tertiary;
        color: $brand-tertiary;
      }

      &.number-badge--quaternary {
        border-color: $brand-quaternary;
        color: $brand-quaternary;
      }

      &.number-badge--success {
        border-color: $color-success;
        color: $color-success;
      }

      &.number-badge--danger {
        border-color: $color-danger;
        color: $color-danger;
      }

      &.number-badge--warning {
        border-color: $color-warning;
        color: $color-warning;
      }

      &.number-badge--info {
        border-color: $color-info;
        color: $color-info;
      }

      &.number-badge--neutral {
        border-color: $color-gray-500;
        color: $color-gray-500;
      }
    }

    // Variant: Ghost
    &--ghost {
      background: transparent;
      border: none;

      &.number-badge--primary {
        color: $brand-primary;
      }

      &.number-badge--secondary {
        color: $brand-secondary;
      }

      &.number-badge--tertiary {
        color: $brand-tertiary;
      }

      &.number-badge--quaternary {
        color: $brand-quaternary;
      }

      &.number-badge--success {
        color: $color-success;
      }

      &.number-badge--danger {
        color: $color-danger;
      }

      &.number-badge--warning {
        color: $color-warning;
      }

      &.number-badge--info {
        color: $color-info;
      }

      &.number-badge--neutral {
        color: $color-gray-500;
      }
    }
  }
</style>
