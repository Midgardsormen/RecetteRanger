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
    // PRIMARY
    &--primary {
      background: $brand-primary;
      color: $color-white;
      border: $border-width-base solid $brand-primary;

      &:hover:not(:disabled):not(.button--disabled) {
        background: darken($brand-primary, 10%);
        border-color: darken($brand-primary, 10%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: darken($brand-primary, 15%);
      }
    }

    // PRIMARY INVERSE
    &--primary-inverse {
      background: $color-white;
      color: $brand-primary;
      border: $border-width-base solid $brand-primary;

      &:hover:not(:disabled):not(.button--disabled) {
        background: lighten($brand-primary, 55%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: lighten($brand-primary, 50%);
      }
    }

    // SECONDARY
    &--secondary {
      background: $brand-secondary;
      color: $color-white;
      border: $border-width-base solid $brand-secondary;

      &:hover:not(:disabled):not(.button--disabled) {
        background: darken($brand-secondary, 10%);
        border-color: darken($brand-secondary, 10%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: darken($brand-secondary, 15%);
      }
    }

    // SECONDARY INVERSE
    &--secondary-inverse {
      background: $color-white;
      color: $brand-secondary;
      border: $border-width-base solid $brand-secondary;

      &:hover:not(:disabled):not(.button--disabled) {
        background: lighten($brand-secondary, 45%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: lighten($brand-secondary, 40%);
      }
    }

    // TERTIARY
    &--tertiary {
      background: $brand-tertiary;
      color: $brand-cream;
      border: $border-width-base solid $brand-cream;

      &:hover:not(:disabled):not(.button--disabled) {
        background: lighten($brand-tertiary, 10%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: lighten($brand-tertiary, 5%);
      }
    }

    // TERTIARY INVERSE
    &--tertiary-inverse {
      background: $brand-cream;
      color: $brand-tertiary;
      border: $border-width-base solid $brand-tertiary;

      &:hover:not(:disabled):not(.button--disabled) {
        background: darken($brand-cream, 5%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: darken($brand-cream, 10%);
      }
    }

    // ACCENT
    &--accent {
      background: $brand-red;
      color: $color-white;
      border: $border-width-base solid $brand-red;

      &:hover:not(:disabled):not(.button--disabled) {
        background: darken($brand-red, 10%);
        border-color: darken($brand-red, 10%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: darken($brand-red, 15%);
      }
    }

    // ACCENT INVERSE
    &--accent-inverse {
      background: $color-white;
      color: $brand-red;
      border: $border-width-base solid $brand-red;

      &:hover:not(:disabled):not(.button--disabled) {
        background: lighten($brand-red, 45%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        background: lighten($brand-red, 40%);
      }
    }

    // SPECIAL
    &--special {
      background: $brand-cream;
      color: $brand-red;
      border: $border-width-base solid $brand-cream;
      box-shadow:
        1px 1px 0 $brand-red,
        2px 2px 0 $brand-red,
        3px 3px 0 $brand-red,
        4px 4px 0 $brand-red;
      font-weight: $font-weight-bold;

      &:hover:not(:disabled):not(.button--disabled) {
        transform: scale(1.05);
        box-shadow:
          1px 1px 0 darken($brand-red, 10%),
          2px 2px 0 darken($brand-red, 10%),
          3px 3px 0 darken($brand-red, 10%),
          4px 4px 0 darken($brand-red, 10%);
      }

      &:active:not(:disabled):not(.button--disabled) {
        transform: scale(0.98);
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



    &--full-width {
      width: 100%;
      max-width: none;
    }
  }
</style>
