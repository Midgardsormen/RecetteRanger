<script lang="ts">
  type LinkVariant = 'primary' | 'secondary' | 'inverse';
  type ButtonVariant = 'primary' | 'primary-inverse' | 'secondary' | 'secondary-inverse' | 'outlined' | 'outlined-inverse' | 'ghost' | 'ghost-inverse' | 'danger' | 'danger-inverse' | 'success' | 'success-inverse';
  type ButtonSize = 'small' | 'medium' | 'large';

  let {
    href,
    variant = 'primary',
    buttonVariant,
    buttonSize = 'medium',
    fullWidth = false,
    children,
    ...rest
  }: {
    href: string;
    variant?: LinkVariant;
    buttonVariant?: ButtonVariant;
    buttonSize?: ButtonSize;
    fullWidth?: boolean;
    children: any;
    [key: string]: any;
  } = $props();

  const isButtonLike = !!buttonVariant;
</script>

{#if isButtonLike}
  <a
    {href}
    class="link-button link-button--{buttonVariant} link-button--{buttonSize}"
    class:link-button--full-width={fullWidth}
    {...rest}
  >
    {@render children()}
  </a>
{:else}
  <a {href} class="link link--{variant}" {...rest}>
    {@render children()}
  </a>
{/if}

<style lang="scss">
  @use '../../styles/variables' as *;

  .link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-family: $font-family-heading;
    font-weight: $font-weight-bold;
    font-size: $font-size-base;
    text-decoration: none;
    text-transform: uppercase;
    transition: all $transition-base;
    letter-spacing: 0.5px;

    &--primary {
      color: $brand-primary;

      &:hover {
        color: $brand-secondary;
        transform: translateX(4px);
      }
    }

    &--secondary {
      color: $brand-secondary;

      &:hover {
        color: $brand-primary;
        transform: translateX(4px);
      }
    }

    &--inverse {
      color: $color-text-inverse;
      text-shadow: $text-shadow-sharp-md;

      &:hover {
        color: $color-dutch-white;
        text-shadow: $text-shadow-sharp-lg;
        transform: translateX(4px);
      }
    }
  }

  // Button-like link styles (copié depuis Button.svelte)
  .link-button {
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
    max-width: 300px;

    @media (min-width: $breakpoint-sm) {
      width: auto;
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
      &:hover {
        background: $color-button-primary-hover-background;
        color: $color-button-primary-hover-text;
        border: 2px solid $color-button-primary-hover-border;
      }

      &:active {
        background: $color-button-primary-active-background;
        color: $color-button-primary-hover-text;
      }
    }

    // PRIMARY INVERSE - Pour fonds foncés
    &--primary-inverse {
      background: $color-button-primary-inverse-background;
      color: $color-button-primary-inverse-text;

      &:hover {
        background: $color-button-primary-inverse-hover-background;
        color: $color-button-primary-inverse-hover-text;
      }

      &:active {
        background: $color-button-primary-inverse-active-background;
        color: $color-button-primary-inverse-hover-text;
      }
    }

    // SECONDARY - Pour fonds clairs
    &--secondary {
      background: $color-button-secondary-background;
      color: $color-button-secondary-text;
      border: 2px solid $color-button-secondary-border;

      &:hover {
        background: $color-button-secondary-hover-background;
        color: $color-button-secondary-hover-text;
        border-color: $color-button-secondary-hover-border;
      }

      &:active {
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

      &:hover {
        background: $color-button-secondary-inverse-hover-background;
        color: $color-button-secondary-inverse-hover-text;
        border-color: $color-button-secondary-inverse-hover-border;
      }

      &:active {
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

      &:hover {
        background: $color-button-outlined-hover-background;
        color: $color-button-outlined-hover-text;
        border-color: $color-button-outlined-hover-border;
      }

      &:active {
        background: $color-button-outlined-active-background;
        color: $color-button-outlined-active-text;
      }
    }

    // OUTLINED INVERSE - Pour fonds foncés
    &--outlined-inverse {
      background: $color-button-outlined-inverse-background;
      color: $color-button-outlined-inverse-text;
      border: 2px solid $color-button-outlined-inverse-border;

      &:hover {
        background: $color-button-outlined-inverse-hover-background;
      }

      &:active {
      }
    }

    // GHOST - Pour fonds clairs
    &--ghost {
      background: $color-button-ghost-background;
      color: $color-button-ghost-text;

      &:hover {
        background: $color-button-ghost-hover-background;
      }

      &:active {
        background: $color-button-ghost-active-background;
      }
    }

    // GHOST INVERSE - Pour fonds foncés
    &--ghost-inverse {
      background: $color-button-ghost-inverse-background;
      color: $color-button-ghost-inverse-text;

      &:hover {
        background: $color-button-ghost-inverse-hover-background;
      }

      &:active {
        background: $color-button-ghost-inverse-active-background;
      }
    }

    // DANGER - Pour fonds clairs
    &--danger {
      background: $color-button-danger-background;
      color: $color-button-danger-text;

      &:hover {
        background: $color-button-danger-hover-background;
      }

      &:active {
      }
    }

    // DANGER INVERSE - Pour fonds foncés
    &--danger-inverse {
      background: $color-button-danger-inverse-background;
      color: $color-button-danger-inverse-text;
      border: 2px solid $color-button-danger-inverse-border;

      &:hover {
        background: $color-button-danger-inverse-hover-background;
        color: $color-button-danger-inverse-hover-text;
        border-color: $color-button-danger-inverse-hover-border;
      }

      &:active {
      }
    }

    // SUCCESS - Pour fonds clairs
    &--success {
      background: $color-button-success-background;
      color: $color-button-success-text;

      &:hover {
        background: $color-button-success-hover-background;
      }

      &:active {
      }
    }

    // SUCCESS INVERSE - Pour fonds foncés
    &--success-inverse {
      background: $color-button-success-inverse-background;
      color: $color-button-success-inverse-text;
      border: 2px solid $color-button-success-inverse-border;

      &:hover {
        background: $color-button-success-inverse-hover-background;
        color: $color-button-success-inverse-hover-text;
        border-color: $color-button-success-inverse-hover-border;
      }

      &:active {
      }
    }

    &--full-width {
      width: 100%;
      max-width: none;
    }
  }
</style>
