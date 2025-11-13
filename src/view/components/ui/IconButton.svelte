<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'danger' | 'success' | 'primary' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    title?: string;
    onclick?: (e: MouseEvent) => void;
    ariaLabel?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'medium',
    disabled = false,
    type = 'button',
    title,
    onclick,
    ariaLabel,
    children
  }: Props = $props();
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
  @use '../../styles/variables' as *;

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
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:focus-visible {
      outline: 2px solid $brand-primary;
      outline-offset: 2px;
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
      background: rgba(0, 0, 0, 0.05);

      &:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }

    &--danger {
      color: $color-danger;
      background: rgba($color-danger, 0.1);

      &:hover:not(:disabled) {
        background: rgba($color-danger, 0.2);
        transform: scale(1.05);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }

    &--success {
      color: $color-success;
      background: rgba($color-success, 0.1);

      &:hover:not(:disabled) {
        background: rgba($color-success, 0.2);
        transform: scale(1.05);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }

    &--primary {
      color: $brand-primary;
      background: rgba($brand-primary, 0.1);

      &:hover:not(:disabled) {
        background: rgba($brand-primary, 0.2);
        transform: scale(1.05);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }

    &--ghost {
      color: $color-text-tertiary;
      background: transparent;

      &:hover:not(:disabled) {
        color: $color-text-secondary;
        background: rgba(0, 0, 0, 0.05);
      }

      &:active:not(:disabled) {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
