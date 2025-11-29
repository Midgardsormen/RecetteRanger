<script lang="ts">
  import type { ButtonProps } from '../../types';

  let {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children,
    element = 'button',
    href,
    target,
    rel
  }: ButtonProps = $props();
</script>

{#if element === 'a'}
  <a
    {href}
    {target}
    {rel}
    class="button button--{variant} button--{size}"
    class:button--full-width={fullWidth}
    class:button--disabled={disabled}
    onclick={onclick}
  >
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
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
{/if}

<style lang="scss">
  @use '../../styles/variables' as *;

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
    text-decoration: none;

    // Par défaut 100% sur mobile, largeur max au-delà de sm
    width: 100%;
    

    @media (min-width: $breakpoint-sm) {
      max-width: 300px;
      width: auto;
    }

    &:disabled,
    &--disabled {
      opacity: $opacity-50;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:focus-visible {
      outline: $outline-width solid $brand-primary;
      outline-offset: $outline-offset;
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
      border: $border-width-base solid $color-button-primary-border;
      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-primary-hover-background;
        color: $color-button-primary-hover-text;
        border: $border-width-base solid $color-button-primary-hover-border;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-primary-active-background;
        color: $color-button-primary-hover-text;
      }
    }

    // PRIMARY INVERSE - Pour fonds foncés
    &--primary-inverse {
      background: $color-button-primary-inverse-background;
      color: $color-button-primary-inverse-text;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-primary-inverse-hover-background;
        color: $color-button-primary-inverse-hover-text;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-primary-inverse-active-background;
        color: $color-button-primary-inverse-hover-text;
      }
    }

    // SECONDARY - Pour fonds clairs
    &--secondary {
      background: $color-button-secondary-background;
      color: $color-button-secondary-text;
      border: $border-width-base solid $color-button-secondary-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-secondary-hover-background;
        color: $color-button-secondary-hover-text;
        border-color: $color-button-secondary-hover-border;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-secondary-active-background;
        color: $color-button-secondary-active-text;
        border-color: $color-button-secondary-active-border;
      }
    }

    // SECONDARY INVERSE - Pour fonds foncés
    &--secondary-inverse {
      background: $color-button-secondary-inverse-background;
      color: $color-button-secondary-inverse-text;
      border: $border-width-base solid $color-button-secondary-inverse-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-secondary-inverse-hover-background;
        color: $color-button-secondary-inverse-hover-text;
        border-color: $color-button-secondary-inverse-hover-border;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-secondary-inverse-active-background;
        color: $color-button-secondary-inverse-active-text;
        border-color: $color-button-secondary-inverse-active-border;
      }
    }

    // OUTLINED - Pour fonds clairs
    &--outlined {
      background: $color-button-outlined-background;
      color: $color-button-outlined-text;
      border: $border-width-base solid $color-button-outlined-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-outlined-hover-background;
        color: $color-button-outlined-hover-text;
        border-color: $color-button-outlined-hover-border;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-outlined-active-background;
        color: $color-button-outlined-active-text;
      }
    }

    // OUTLINED INVERSE - Pour fonds foncés
    &--outlined-inverse {
      background: $color-button-outlined-inverse-background;
      color: $color-button-outlined-inverse-text;
      border: $border-width-base solid $color-button-outlined-inverse-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-outlined-inverse-hover-background;
      }
    }

    // GHOST - Pour fonds clairs
    &--ghost {
      background: $color-button-ghost-background;
      color: $color-button-ghost-text;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-ghost-hover-background;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-ghost-active-background;
      }
    }

    // GHOST INVERSE - Pour fonds foncés
    &--ghost-inverse {
      background: $color-button-ghost-inverse-background;
      color: $color-button-ghost-inverse-text;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-ghost-inverse-hover-background;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-ghost-inverse-active-background;
      }
    }

    // DANGER - Pour fonds clairs
    &--danger {
      background: $color-button-danger-background;
      color: $color-button-danger-text;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-danger-hover-background;
      }
    }

    // DANGER INVERSE - Pour fonds foncés
    &--danger-inverse {
      background: $color-button-danger-inverse-background;
      color: $color-button-danger-inverse-text;
      border: $border-width-base solid $color-button-danger-inverse-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-danger-inverse-hover-background;
        color: $color-button-danger-inverse-hover-text;
        border-color: $color-button-danger-inverse-hover-border;
      }
    }

    // SUCCESS - Pour fonds clairs
    &--success {
      background: $color-button-success-background;
      color: $color-button-success-text;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-success-hover-background;
      }
    }

    // SUCCESS INVERSE - Pour fonds foncés
    &--success-inverse {
      background: $color-button-success-inverse-background;
      color: $color-button-success-inverse-text;
      border: $border-width-base solid $color-button-success-inverse-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-success-inverse-hover-background;
        color: $color-button-success-inverse-hover-text;
        border-color: $color-button-success-inverse-hover-border;
      }
    }

    // TERTIARY - Pour fonds clairs avec fond crème
    &--tertiary {
      background: $color-button-tertiary-background;
      color: $color-button-tertiary-text;
      border: $border-width-base solid $color-button-tertiary-border;

      &:hover:not(:disabled):not(.button--disabled) {
        background: $color-button-tertiary-hover-background;
        color: $color-button-tertiary-hover-text;
        border-color: $color-button-tertiary-hover-border;
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: $color-button-tertiary-active-background;
        color: $color-button-tertiary-active-text;
      }
    }

    &--full-width {
      width: 100%;
      max-width: none;
    }
  }
</style>
