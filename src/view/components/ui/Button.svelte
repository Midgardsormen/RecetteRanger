<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outlined' | 'outlined-reverse';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children
  }: Props = $props();
</script>

<button
  class="button button--{variant} button--{size}"
  class:button--full-width={fullWidth}
  {type}
  {disabled}
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style lang="scss">
  @import '../../styles/variables';

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    border: none;
    border-radius: $radius-lg;
    font-family: inherit;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all $transition-slow $transition-ease;
    line-height: 1;

    // Par défaut 100% sur mobile, largeur max au-delà de sm
    width: 100%;
    max-width: 300px;

    @media (min-width: $breakpoint-sm) {
      width: auto;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:focus-visible {
      outline: 2px solid $brand-primary;
      outline-offset: 2px;
    }

    // Sizes
    &--small {
      padding: $spacing-sm $spacing-base;
      font-size: $font-size-sm;
    }

    &--medium {
      padding: $spacing-md $spacing-lg;
      font-size: $font-size-base;
    }

    &--large {
      padding: $spacing-base $spacing-xl;
      font-size: $font-size-lg;
    }

    // Variants
    &--primary {
      background: $color-button-primary-background;
      color: $color-button-primary-text;

      &:hover:not(:disabled) {
        background: $color-button-primary-hover-background;
        color: $brand-tertiary;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $color-button-primary-shadow;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
        background: $color-button-primary-active-background;
        color: $brand-tertiary;
      }
    }

    &--secondary {
      background: $color-button-secondary-background;
      color: $color-button-secondary-text;
      border: 2px solid $color-button-secondary-border;

      &:hover:not(:disabled) {
        background: $brand-primary;
        color: $color-white;
        border-color: $brand-primary;
        transform: translateY(-2px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
        background: $brand-tertiary;
        color: $color-white;
        border-color: $brand-tertiary;
      }
    }

    &--danger {
      background: $color-button-danger-background;
      color: $color-button-danger-text;

      &:hover:not(:disabled) {
        background: $color-button-danger-hover-background;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $color-button-danger-shadow;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--success {
      background: $color-button-success-background;
      color: $color-button-success-text;

      &:hover:not(:disabled) {
        background: $color-button-success-hover-background;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $color-button-success-shadow;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--ghost {
      background: $color-button-ghost-background;
      color: $color-button-ghost-text;

      &:hover:not(:disabled) {
        background: $color-button-ghost-hover-background;
      }

      &:active:not(:disabled) {
        background: rgba(0, 0, 0, 0.1);
      }
    }

    &--outlined {
      background: transparent;
      color: $brand-primary;
      border: 2px solid $brand-primary;

      &:hover:not(:disabled) {
        background: rgba($brand-primary, 0.1);
        transform: translateY(-2px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--outlined-reverse {
      background: transparent;
      color: $color-dutch-white;
      border: 2px solid $color-dutch-white;

      &:hover:not(:disabled) {
        background: rgba($color-dutch-white, 0.1);
        transform: translateY(-2px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--full-width {
      width: 100%;
      max-width: none;
    }
  }
</style>
