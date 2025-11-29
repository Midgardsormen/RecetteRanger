<script lang="ts">
  import type { TagProps } from '../../../types/ui.types';
  import { X } from 'lucide-svelte';
  import { handleRemoveClick as handleRemove } from './Tag.actions';
  import { TAG_DEFAULTS, TAG_ICON_SIZES, TAG_ARIA } from './Tag.config';

  let {
    variant = TAG_DEFAULTS.variant,
    size = TAG_DEFAULTS.size,
    removable = TAG_DEFAULTS.removable,
    onRemove,
    onclick,
    children
  }: TagProps = $props();
</script>

<span
  class="tag tag--{variant}"
  class:tag--xs={size === 'xs'}
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
      onclick={(e) => handleRemove(e, onRemove)}
      type="button"
      aria-label={TAG_ARIA.removeLabel}
    >
      <X size={TAG_ICON_SIZES[size]} />
    </button>
  {/if}
</span>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .tag {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-family: $font-family-base;
    font-weight: $font-weight-medium;
    line-height: 1;
    white-space: nowrap;
    border-radius: $radius-md;
    border: $border-width-thin solid transparent;
    transition: all $transition-base $transition-ease;
    cursor: default;

    // Sizes
    &--xs {
      padding: $spacing-2xs $spacing-xs-plus;
      font-size: $font-size-2xs;
    }

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

    // Variants - Semantic colors
    &--primary {
      background: $color-primary-alpha-10;
      color: $brand-primary;
      border-color: $color-primary-alpha-20;

      &:hover {
        background: $color-primary-alpha-15;
      }

      .tag__remove:hover {
        background: $color-primary-alpha-20;
      }
    }

    &--secondary {
      background: $color-secondary-alpha-10;
      color: $brand-secondary;
      border-color: $color-secondary-alpha-20;

      &:hover {
        background: $color-secondary-alpha-15;
      }

      .tag__remove:hover {
        background: $color-secondary-alpha-20;
      }
    }

    &--success {
      background: $color-success-alpha-10;
      color: $color-success-dark;
      border-color: $color-success-alpha-20;

      &:hover {
        background: rgba($color-success, 0.15);
      }

      .tag__remove:hover {
        background: $color-success-alpha-20;
      }
    }

    &--danger {
      background: $color-danger-alpha-10;
      color: $color-danger-dark;
      border-color: $color-danger-alpha-20;

      &:hover {
        background: rgba($color-danger, 0.15);
      }

      .tag__remove:hover {
        background: $color-danger-alpha-20;
      }
    }

    &--warning {
      background: $color-warning-alpha-10;
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
      background: $color-info-alpha-10;
      color: $color-info-dark;
      border-color: $color-info-alpha-20;

      &:hover {
        background: $color-info-alpha-15;
      }

      .tag__remove:hover {
        background: $color-info-alpha-20;
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

    // Inverse variants (for dark backgrounds)
    &--primary-inverse {
      background: $color-white-alpha-90;
      color: $brand-primary;
      border-color: $color-white;
      font-weight: $font-weight-semibold;

      &:hover {
        background: $color-white;
      }

      .tag__remove:hover {
        background: $color-primary-alpha-15;
      }
    }

    &--info-inverse {
      background: $color-white-alpha-90;
      color: $color-info-dark;
      border-color: $color-white;
      font-weight: $font-weight-semibold;

      &:hover {
        background: $color-white;
      }

      .tag__remove:hover {
        background: $color-info-alpha-15;
      }
    }

    &--success-inverse {
      background: $brand-cream;
      color: $brand-primary;
      border-color: $brand-cream;
      font-weight: $font-weight-semibold;

      &:hover {
        background: $brand-cream;
        border-color: $brand-cream;
      }

      .tag__remove:hover {
        background: $color-success-alpha-20;
      }
    }

    &--neutral-inverse {
      background: $color-white-alpha-10;
      color: $color-white-alpha-90;
      border-color: $color-white-alpha-30;
      font-weight: $font-weight-medium;

      &:hover {
        background: $color-white-alpha-20;
        border-color: $color-white-alpha-30;
      }

      .tag__remove:hover {
        background: $color-white-alpha-30;
      }
    }

    // Extended color palette (soft style with light background)
    &--red {
      background: $brand-red-50;
      color: $brand-red-700;
      border-color: $brand-red-200;

      &:hover {
        background: $brand-red-100;
      }

      .tag__remove:hover {
        background: $brand-red-200;
      }
    }

    &--orange {
      background: $color-orange-50;
      color: $color-orange-700;
      border-color: $color-orange-200;

      &:hover {
        background: $color-orange-100;
      }

      .tag__remove:hover {
        background: $color-orange-200;
      }
    }

    &--amber {
      background: $color-amber-50;
      color: $color-amber-700;
      border-color: $color-amber-200;

      &:hover {
        background: $color-amber-100;
      }

      .tag__remove:hover {
        background: $color-amber-200;
      }
    }

    &--yellow {
      background: $color-yellow-50;
      color: $color-yellow-700;
      border-color: $color-yellow-200;

      &:hover {
        background: $color-yellow-100;
      }

      .tag__remove:hover {
        background: $color-yellow-200;
      }
    }

    &--lime {
      background: $color-lime-50;
      color: $color-lime-700;
      border-color: $color-lime-200;

      &:hover {
        background: $color-lime-100;
      }

      .tag__remove:hover {
        background: $color-lime-200;
      }
    }

    &--green {
      background: $color-green-50;
      color: $color-green-700;
      border-color: $color-green-200;

      &:hover {
        background: $color-green-100;
      }

      .tag__remove:hover {
        background: $color-green-200;
      }
    }

    &--emerald {
      background: $color-emerald-50;
      color: $color-emerald-700;
      border-color: $color-emerald-200;

      &:hover {
        background: $color-emerald-100;
      }

      .tag__remove:hover {
        background: $color-emerald-200;
      }
    }

    &--teal {
      background: $color-teal-50;
      color: $color-teal-700;
      border-color: $color-teal-200;

      &:hover {
        background: $color-teal-100;
      }

      .tag__remove:hover {
        background: $color-teal-200;
      }
    }

    &--cyan {
      background: $color-cyan-50;
      color: $color-cyan-700;
      border-color: $color-cyan-200;

      &:hover {
        background: $color-cyan-100;
      }

      .tag__remove:hover {
        background: $color-cyan-200;
      }
    }

    &--sky {
      background: $color-sky-50;
      color: $color-sky-700;
      border-color: $color-sky-200;

      &:hover {
        background: $color-sky-100;
      }

      .tag__remove:hover {
        background: $color-sky-200;
      }
    }

    &--blue {
      background: $color-blue-50;
      color: $color-blue-700;
      border-color: $color-blue-200;

      &:hover {
        background: $color-blue-100;
      }

      .tag__remove:hover {
        background: $color-blue-200;
      }
    }

    &--indigo {
      background: $color-indigo-50;
      color: $color-indigo-700;
      border-color: $color-indigo-200;

      &:hover {
        background: $color-indigo-100;
      }

      .tag__remove:hover {
        background: $color-indigo-200;
      }
    }

    &--violet {
      background: $color-violet-50;
      color: $color-violet-700;
      border-color: $color-violet-200;

      &:hover {
        background: $color-violet-100;
      }

      .tag__remove:hover {
        background: $color-violet-200;
      }
    }

    &--purple {
      background: $color-purple-50;
      color: $color-purple-700;
      border-color: $color-purple-200;

      &:hover {
        background: $color-purple-100;
      }

      .tag__remove:hover {
        background: $color-purple-200;
      }
    }

    &--fuchsia {
      background: $color-fuchsia-50;
      color: $color-fuchsia-700;
      border-color: $color-fuchsia-200;

      &:hover {
        background: $color-fuchsia-100;
      }

      .tag__remove:hover {
        background: $color-fuchsia-200;
      }
    }

    &--pink {
      background: $color-pink-50;
      color: $color-pink-700;
      border-color: $color-pink-200;

      &:hover {
        background: $color-pink-100;
      }

      .tag__remove:hover {
        background: $color-pink-200;
      }
    }

    &--rose {
      background: $color-rose-50;
      color: $color-rose-700;
      border-color: $color-rose-200;

      &:hover {
        background: $color-rose-100;
      }

      .tag__remove:hover {
        background: $color-rose-200;
      }
    }

    // Modifiers
    &--clickable {
      cursor: pointer;

      &:focus-visible {
        outline: $outline-width solid $brand-primary;
        outline-offset: $outline-offset;
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
