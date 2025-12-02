<script lang="ts">
  import type { IconButtonProps } from '../../../types/ui.types';
  import { ICON_BUTTON_DEFAULTS } from './IconButton.config';

  let {
    variant = ICON_BUTTON_DEFAULTS.variant,
    size = ICON_BUTTON_DEFAULTS.size,
    shape = ICON_BUTTON_DEFAULTS.shape,
    disabled = ICON_BUTTON_DEFAULTS.disabled,
    type = ICON_BUTTON_DEFAULTS.type,
    title,
    onclick,
    ariaLabel,
    children
  }: IconButtonProps = $props();
</script>

<button
  class="icon-button icon-button--{variant} icon-button--{size} icon-button--{shape}"
  {type}
  {disabled}
  {onclick}
  {title}
  aria-label={ariaLabel || title}
>
  {@render children?.()}
</button>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    line-height: 1;
    font-family: inherit;

    &:disabled {
      opacity: $opacity-40;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:focus-visible {
      outline: $outline-width solid $brand-primary;
      outline-offset: $outline-offset;
    }

    // Sizes
    &--small {
      width: 28px;
      height: 28px;
      font-size: $font-size-sm;
    }

    &--medium {
      width: 36px;
      height: 36px;
      font-size: $font-size-base;
    }

    &--large {
      width: 44px;
      height: 44px;
      font-size: $font-size-lg;
    }

    &--x-large {
      width: 56px;
      height: 56px;
      font-size: $font-size-xl;
    }

    &--2x-large {
      width: 64px;
      height: 64px;
      font-size: $font-size-2xl;
    }

    // Shapes
    &--circle {
      border-radius: 50%;
    }

    &--square {
      border-radius: $radius-md;
    }

    &--rectangle {
      border-radius: $radius-md;

      &.icon-button--small {
        width: 36px;
      }

      &.icon-button--medium {
        width: 48px;
      }

      &.icon-button--large {
        width: 56px;
      }

      &.icon-button--x-large {
        width: 72px;
      }

      &.icon-button--2x-large {
        width: 80px;
      }
    }

    // Variants
    &--primary {
      color: $color-white;
      background: $brand-primary;
      border: 2px solid $brand-primary;

      &:hover:not(:disabled) {
        background: darken($brand-primary, 10%);
        border-color: darken($brand-primary, 10%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: darken($brand-primary, 15%);
        transform: $transform-scale-active;
      }
    }

    &--primary-inverse {
      color: $brand-primary;
      background: $color-white;
      border: 2px solid $brand-primary;

      &:hover:not(:disabled) {
        background: lighten($brand-primary, 55%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: lighten($brand-primary, 50%);
        transform: $transform-scale-active;
      }
    }

    &--secondary {
      color: $color-white;
      background: $brand-secondary;
      border: 2px solid $brand-secondary;

      &:hover:not(:disabled) {
        background: darken($brand-secondary, 10%);
        border-color: darken($brand-secondary, 10%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: darken($brand-secondary, 15%);
        transform: $transform-scale-active;
      }
    }

    &--secondary-inverse {
      color: $brand-secondary;
      background: $color-white;
      border: 2px solid $brand-secondary;

      &:hover:not(:disabled) {
        background: lighten($brand-secondary, 45%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: lighten($brand-secondary, 40%);
        transform: $transform-scale-active;
      }
    }

    &--tertiary {
      color: $brand-cream;
      background: $brand-tertiary;
      border: 2px solid $brand-cream;

      &:hover:not(:disabled) {
        background: lighten($brand-tertiary, 10%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: lighten($brand-tertiary, 5%);
        transform: $transform-scale-active;
      }
    }

    &--tertiary-inverse {
      color: $brand-tertiary;
      background: $brand-cream;
      border: 2px solid $brand-tertiary;

      &:hover:not(:disabled) {
        background: darken($brand-cream, 5%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: darken($brand-cream, 10%);
        transform: $transform-scale-active;
      }
    }

    &--accent {
      color: $color-white;
      background: $brand-red;
      border: 2px solid $brand-red;

      &:hover:not(:disabled) {
        background: darken($brand-red, 10%);
        border-color: darken($brand-red, 10%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: darken($brand-red, 15%);
        transform: $transform-scale-active;
      }
    }

    &--accent-inverse {
      color: $brand-red;
      background: $color-white;
      border: 2px solid $brand-red;

      &:hover:not(:disabled) {
        background: lighten($brand-red, 45%);
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        background: lighten($brand-red, 40%);
        transform: $transform-scale-active;
      }
    }

    &--special {
      color: $brand-red;
      background: $brand-cream;
      border: 2px solid $brand-cream;
      box-shadow:
        1px 1px 0 $brand-red,
        2px 2px 0 $brand-red,
        3px 3px 0 $brand-red,
        4px 4px 0 $brand-red;

      &:hover:not(:disabled) {
        transform: $transform-scale-hover;
        box-shadow:
          1px 1px 0 darken($brand-red, 10%),
          2px 2px 0 darken($brand-red, 10%),
          3px 3px 0 darken($brand-red, 10%),
          4px 4px 0 darken($brand-red, 10%);
      }

      &:active:not(:disabled) {
        transform: $transform-scale-active;
      }
    }

    // Anciens variants conservés pour compatibilité
    &--default {
      color: $color-text-secondary;
      background: $color-black-alpha-05;

      &:hover:not(:disabled) {
        background: $color-black-alpha-10;
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        transform: $transform-scale-active;
      }
    }

    &--danger {
      color: $color-danger;
      background: $color-danger-alpha-10;

      &:hover:not(:disabled) {
        background: $color-danger-alpha-20;
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        transform: $transform-scale-active;
      }
    }

    &--success {
      color: $color-success;
      background: $color-success-alpha-10;

      &:hover:not(:disabled) {
        background: $color-success-alpha-20;
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        transform: $transform-scale-active;
      }
    }

    &--ghost {
      color: $color-text-tertiary;
      background: transparent;

      &:hover:not(:disabled) {
        color: $color-text-secondary;
        background: $color-black-alpha-05;
      }

      &:active:not(:disabled) {
        background: $color-black-alpha-10;
      }
    }

    &--ghost-inverse {
      color: $color-white;
      background: $color-white-alpha-10;

      &:hover:not(:disabled) {
        color: $color-white;
        background: $color-white-alpha-20;
      }

      &:active:not(:disabled) {
        background: $color-white-alpha-30;
      }
    }

    &--outlined-inverse {
      color: $color-white;
      background: transparent;
      border: 2px solid $color-white-alpha-30;

      &:hover:not(:disabled) {
        background: $color-white-alpha-10;
        border-color: $color-white;
      }

      &:active:not(:disabled) {
        background: $color-white-alpha-20;
      }
    }
  }
</style>
