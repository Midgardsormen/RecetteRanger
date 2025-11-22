<script lang="ts">
  import type { LinkProps } from '../../../types/ui.types';
  import Button from '../Button.svelte';
  import { LINK_DEFAULTS } from './Link.config';

  let {
    href,
    variant = LINK_DEFAULTS.variant,
    buttonVariant,
    buttonSize = LINK_DEFAULTS.buttonSize,
    fullWidth = LINK_DEFAULTS.fullWidth,
    target,
    rel,
    children,
    ...rest
  }: LinkProps = $props();

  const isButtonLike = !!buttonVariant;
</script>

{#if isButtonLike}
  <Button
    element="a"
    {href}
    {target}
    {rel}
    variant={buttonVariant}
    size={buttonSize}
    {fullWidth}
    {...rest}
  >
    {@render children?.()}
  </Button>
{:else}
  <a {href} {target} {rel} class="link link--{variant}" {...rest}>
    {@render children?.()}
  </a>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-family: $font-family-heading;
    font-weight: $font-weight-bold;
    font-size: $font-size-base;
    text-decoration: underline;
    text-transform: none;
    transition: all $transition-base;

    &--primary {
      color: $brand-primary;

      &:hover {
        color: $brand-secondary;
        text-decoration: none;
      }
    }

    &--secondary {
      color: $brand-secondary;

      &:hover {
        color: $brand-primary;
        text-decoration: none;
      }
    }

    &--inverse {
      color: $color-text-inverse;

      &:hover {
        color: $brand-cream;
        text-decoration: none;
      }
    }
  }
</style>
