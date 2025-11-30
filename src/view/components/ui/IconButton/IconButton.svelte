<script lang="ts">
  import type { IconButtonProps } from '../../../types/ui.types';
  import { ICON_BUTTON_DEFAULTS } from './IconButton.config';

  let {
    variant = ICON_BUTTON_DEFAULTS.variant,
    size = ICON_BUTTON_DEFAULTS.size,
    disabled = ICON_BUTTON_DEFAULTS.disabled,
    type = ICON_BUTTON_DEFAULTS.type,
    title,
    onclick,
    ariaLabel,
    children
  }: IconButtonProps = $props();
</script>

<button
  class="icon-button icon-button--{variant} icon-button--{size}"
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
    border-radius: $radius-md;
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

    // Variants
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

    &--primary {
      color: $brand-primary;
      background: $color-primary-alpha-10;

      &:hover:not(:disabled) {
        background: $color-primary-alpha-20;
        transform: $transform-scale-hover;
      }

      &:active:not(:disabled) {
        transform: $transform-scale-active;
      }
    }

    &--secondary {
      color: $brand-secondary;
      background: $color-secondary-alpha-10;

      &:hover:not(:disabled) {
        background: $color-secondary-alpha-20;
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
