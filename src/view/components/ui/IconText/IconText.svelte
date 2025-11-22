<script lang="ts">
  /**
   * IconText Component
   *
   * Generic reusable component to display an icon with title and optional description
   * Use cases: feature lists, benefits, steps, categories, notifications, etc.
   */

  import type { IconTextProps } from '../../../types/ui.types';
  import { ICON_TEXT_DEFAULTS } from './IconText.config';

  let {
    icon,
    title,
    description,
    variant = ICON_TEXT_DEFAULTS.variant,
    size = ICON_TEXT_DEFAULTS.size,
    disabled = ICON_TEXT_DEFAULTS.disabled,
    class: className = ''
  }: IconTextProps = $props();
</script>

<div
  class="icon-text icon-text--{variant} icon-text--{size} {className}"
  class:icon-text--disabled={disabled}
>
  <span class="icon-text__icon">
    {@render icon()}
  </span>
  <div class="icon-text__content">
    <strong class="icon-text__title">{title}</strong>
    {#if description}
      <small class="icon-text__description">{description}</small>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .icon-text {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex: 1;

    &--disabled {
      opacity: $opacity-60;
      cursor: not-allowed;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $radius-full;
      color: $color-white;
      font-weight: $font-weight-bold;
      flex-shrink: 0;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
    }

    &__title {
      display: block;
      color: $color-text-primary;
      font-weight: $font-weight-semibold;
    }

    &__description {
      display: block;
      color: $color-text-secondary;
    }

    // Sizes
    &--small {
      .icon-text__icon {
        width: $size-icon-md;
        height: $size-icon-md;
        font-size: $font-size-xs;
      }

      .icon-text__title {
        font-size: $font-size-xs;
      }

      .icon-text__description {
        font-size: $font-size-2xs;
      }
    }

    &--medium {
      .icon-text__icon {
        width: $size-icon-md-plus;
        height: $size-icon-md-plus;
        font-size: $font-size-sm;
      }

      .icon-text__title {
        font-size: $font-size-sm;
      }

      .icon-text__description {
        font-size: $font-size-xs;
      }
    }

    &--large {
      .icon-text__icon {
        width: $size-icon-xl;
        height: $size-icon-xl;
        font-size: $font-size-base;
      }

      .icon-text__title {
        font-size: $font-size-base;
      }

      .icon-text__description {
        font-size: $font-size-sm;
      }
    }

    // Variants
    &--primary {
      .icon-text__icon {
        background: $brand-primary;
      }
    }

    &--secondary {
      .icon-text__icon {
        background: $brand-secondary;
      }
    }

    &--success {
      .icon-text__icon {
        background: $color-success;
      }
    }

    &--danger {
      .icon-text__icon {
        background: $color-danger;
      }
    }

    &--warning {
      .icon-text__icon {
        background: $color-warning;
      }
    }

    &--info {
      .icon-text__icon {
        background: $color-info;
      }
    }

    &--neutral {
      .icon-text__icon {
        background: $color-gray-500;
      }
    }
  }
</style>
