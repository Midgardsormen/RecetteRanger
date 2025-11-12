<script lang="ts">
  type LinkVariant = 'primary' | 'secondary' | 'inverse';

  let {
    href,
    variant = 'primary',
    children,
    ...rest
  }: {
    href: string;
    variant?: LinkVariant;
    children: any;
    [key: string]: any;
  } = $props();
</script>

<a {href} class="link link--{variant}" {...rest}>
  {@render children()}
</a>

<style lang="scss">
  @import '../../styles/variables';

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
</style>
