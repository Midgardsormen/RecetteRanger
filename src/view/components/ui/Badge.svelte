<script lang="ts">
  import type { BadgeProps } from '../../types';

  let {
    variant = 'neutral',
    size = 'medium',
    pill = false,
    dot = false,
    children
  }: BadgeProps = $props();
</script>

<span
  class="badge badge--{variant}"
  class:badge--xs={size === 'xs'}
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
    transition: all $transition-base $transition-ease;

    // Sizes
    &--xs {
      padding: $spacing-2xs $spacing-xs-plus;
      font-size: $font-size-2xs;
      border-radius: $radius-sm;
    }

    &--small {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-xs;
      border-radius: $radius-sm;
    }

    &--medium {
      padding: $spacing-sm $spacing-md;
      font-size: $font-size-sm;
      border-radius: $radius-md;
    }

    &--large {
      padding: $spacing-md $spacing-base;
      font-size: $font-size-base;
      border-radius: $radius-lg;
    }

    // Variants - Semantic colors
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

    // Extended color palette
    &--red {
      background: $brand-red-600;
      color: $color-white;
    }

    &--orange {
      background: $color-orange-600;
      color: $color-white;
    }

    &--amber {
      background: $color-amber-600;
      color: $color-white;
    }

    &--yellow {
      background: $color-yellow-600;
      color: $color-white;
    }

    &--lime {
      background: $color-lime-600;
      color: $color-white;
    }

    &--green {
      background: $color-green-600;
      color: $color-white;
    }

    &--emerald {
      background: $color-emerald-600;
      color: $color-white;
    }

    &--teal {
      background: $color-teal-600;
      color: $color-white;
    }

    &--cyan {
      background: $color-cyan-600;
      color: $color-white;
    }

    &--sky {
      background: $color-sky-600;
      color: $color-white;
    }

    &--blue {
      background: $color-blue-600;
      color: $color-white;
    }

    &--indigo {
      background: $color-indigo-600;
      color: $color-white;
    }

    &--violet {
      background: $color-violet-600;
      color: $color-white;
    }

    &--purple {
      background: $color-purple-600;
      color: $color-white;
    }

    &--fuchsia {
      background: $color-fuchsia-600;
      color: $color-white;
    }

    &--pink {
      background: $color-pink-600;
      color: $color-white;
    }

    &--rose {
      background: $color-rose-600;
      color: $color-white;
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
    width: $size-dot;
    height: $size-dot;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }
</style>
