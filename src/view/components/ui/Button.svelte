<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'primary-inverse' | 'secondary' | 'secondary-inverse' | 'outlined' | 'outlined-inverse' | 'ghost' | 'ghost-inverse' | 'danger' | 'danger-inverse' | 'success' | 'success-inverse';
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
    // PRIMARY - Pour fonds clairs
    &--primary {
      background: $color-button-primary-background;
      color: $color-button-primary-text;
      border: 2px solid $color-button-primary-border;
      &:hover:not(:disabled) {
        background: $color-button-primary-hover-background;
        color: $color-button-primary-hover-text;
        border: 2px solid $color-button-primary-hover-border;
      }

      &:active:not(:disabled) {
        background: $color-button-primary-active-background;
        color: $color-button-primary-hover-text;
      }
    }

    // PRIMARY INVERSE - Pour fonds foncés
    &--primary-inverse {
      background: $color-button-primary-inverse-background;
      color: $color-button-primary-inverse-text;

      &:hover:not(:disabled) {
        background: $color-button-primary-inverse-hover-background;
        color: $color-button-primary-inverse-hover-text;
      }

      &:active:not(:disabled) {
        background: $color-button-primary-inverse-active-background;
        color: $color-button-primary-inverse-hover-text;
      }
    }

    // SECONDARY - Pour fonds clairs
    &--secondary {
      background: $color-button-secondary-background;
      color: $color-button-secondary-text;
      border: 2px solid $color-button-secondary-border;

      &:hover:not(:disabled) {
        background: $color-button-secondary-hover-background;
        color: $color-button-secondary-hover-text;
        border-color: $color-button-secondary-hover-border;
      }

      &:active:not(:disabled) {
        background: $color-button-secondary-active-background;
        color: $color-button-secondary-active-text;
        border-color: $color-button-secondary-active-border;
      }
    }

    // SECONDARY INVERSE - Pour fonds foncés
    &--secondary-inverse {
      background: $color-button-secondary-inverse-background;
      color: $color-button-secondary-inverse-text;
      border: 2px solid $color-button-secondary-inverse-border;

      &:hover:not(:disabled) {
        background: $color-button-secondary-inverse-hover-background;
        color: $color-button-secondary-inverse-hover-text;
        border-color: $color-button-secondary-inverse-hover-border;
      }

      &:active:not(:disabled) {
        background: $color-button-secondary-inverse-active-background;
        color: $color-button-secondary-inverse-active-text;
        border-color: $color-button-secondary-inverse-active-border;
      }
    }

    // OUTLINED - Pour fonds clairs
    &--outlined {
      background: $color-button-outlined-background;
      color: $color-button-outlined-text;
      border: 2px solid $color-button-outlined-border;

      &:hover:not(:disabled) {
        background: $color-button-outlined-hover-background;
        color: $color-button-outlined-hover-text;
        border-color: $color-button-outlined-hover-border;
      }

      &:active:not(:disabled) {
        background: $color-button-outlined-active-background;
        color: $color-button-outlined-active-text;
      }
    }

    // OUTLINED INVERSE - Pour fonds foncés
    &--outlined-inverse {
      background: $color-button-outlined-inverse-background;
      color: $color-button-outlined-inverse-text;
      border: 2px solid $color-button-outlined-inverse-border;

      &:hover:not(:disabled) {
        background: $color-button-outlined-inverse-hover-background;
      }

      &:active:not(:disabled) {
      }
    }

    // GHOST - Pour fonds clairs
    &--ghost {
      background: $color-button-ghost-background;
      color: $color-button-ghost-text;

      &:hover:not(:disabled) {
        background: $color-button-ghost-hover-background;
      }

      &:active:not(:disabled) {
        background: $color-button-ghost-active-background;
      }
    }

    // GHOST INVERSE - Pour fonds foncés
    &--ghost-inverse {
      background: $color-button-ghost-inverse-background;
      color: $color-button-ghost-inverse-text;

      &:hover:not(:disabled) {
        background: $color-button-ghost-inverse-hover-background;
      }

      &:active:not(:disabled) {
        background: $color-button-ghost-inverse-active-background;
      }
    }

    // DANGER - Pour fonds clairs
    &--danger {
      background: $color-button-danger-background;
      color: $color-button-danger-text;

      &:hover:not(:disabled) {
        background: $color-button-danger-hover-background;
      }

      &:active:not(:disabled) {
      }
    }

    // DANGER INVERSE - Pour fonds foncés
    &--danger-inverse {
      background: $color-button-danger-inverse-background;
      color: $color-button-danger-inverse-text;
      border: 2px solid $color-button-danger-inverse-border;

      &:hover:not(:disabled) {
        background: $color-button-danger-inverse-hover-background;
        color: $color-button-danger-inverse-hover-text;
        border-color: $color-button-danger-inverse-hover-border;
      }

      &:active:not(:disabled) {
      }
    }

    // SUCCESS - Pour fonds clairs
    &--success {
      background: $color-button-success-background;
      color: $color-button-success-text;

      &:hover:not(:disabled) {
        background: $color-button-success-hover-background;
      }

      &:active:not(:disabled) {
      }
    }

    // SUCCESS INVERSE - Pour fonds foncés
    &--success-inverse {
      background: $color-button-success-inverse-background;
      color: $color-button-success-inverse-text;
      border: 2px solid $color-button-success-inverse-border;

      &:hover:not(:disabled) {
        background: $color-button-success-inverse-hover-background;
        color: $color-button-success-inverse-hover-text;
        border-color: $color-button-success-inverse-hover-border;
      }

      &:active:not(:disabled) {
      }
    }

    &--full-width {
      width: 100%;
      max-width: none;
    }
  }
</style>
