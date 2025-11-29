<script lang="ts">
  import type { SectionTitleProps } from '../../../types/ui.types';
  import { SECTION_TITLE_DEFAULTS } from './SectionTitle.config';

  let {
    level = SECTION_TITLE_DEFAULTS.level,
    variant = SECTION_TITLE_DEFAULTS.variant,
    children,
  }: SectionTitleProps = $props();

  // Determine tag name based on level
  const tag = $derived(`h${level}` as 'h2' | 'h3' | 'h4');
</script>

<svelte:element
  this={tag}
  class="section-title"
  class:section-title--inverse={variant === 'inverse'}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .section-title {
    margin: 0 0 $spacing-base 0;
    font-family: $font-family-heading;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;

    // Mobile first - base styles
    font-size: $font-size-lg;

    // Tablet and up
    @media (min-width: $breakpoint-sm) {
      font-size: $font-size-xl;
    }

    // Variant inverse (for dark backgrounds)
    &--inverse {
      color: $color-text-inverse;
    }
  }
</style>
