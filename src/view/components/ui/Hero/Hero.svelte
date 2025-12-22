<script lang="ts">
  import type { HeroProps } from '../../../types/ui.types';
  import { HERO_DEFAULTS, HERO_Z_INDEX, HERO_OVERLAY } from './Hero.config';
  import { generateHeroStyles } from './Hero.actions';

  let {
    variant = HERO_DEFAULTS.variant,
    backgroundImage,
    backgroundColor,
    overlay = HERO_DEFAULTS.overlay,
    overlayOpacity = HERO_DEFAULTS.overlayOpacity,
    textAlign = HERO_DEFAULTS.textAlign,
    padding,
    children
  }: HeroProps = $props();

  const style = $derived(
    generateHeroStyles(backgroundImage, backgroundColor, padding, overlay, overlayOpacity)
  );
</script>

<div
  class="hero"
  class:hero--default={variant === 'default'}
  class:hero--grid={variant === 'grid'}
  class:hero--compact={variant === 'compact'}
  class:hero--overlay={overlay}
  class:hero--center={textAlign === 'center'}
  class:hero--left={textAlign === 'left'}
  class:hero--right={textAlign === 'right'}
  style={style}
>
  {@render children?.()}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .hero {
    position: relative;
    border-radius: $radius-2xl;

    // Variant: default (landing page style)
    &--default {
      @include retro-grain(0.3);
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      color: $color-white;
      padding: $spacing-4xl $spacing-sm $spacing-lg;
      box-shadow: $shadow-hero-default;

      @media (min-width: $breakpoint-md) {
        // Padding-top augmenté pour le logo plus grand (200px) + marge
        padding: 220px $spacing-md $spacing-xl;
      }
      @media (min-width: $breakpoint-lg) {
        // Padding-top augmenté pour le logo encore plus grand (220px) + marge
        padding: 240px $spacing-lg $spacing-2xl;
      }
    }

    // Variant: grid (recipe detail style)
    &--grid {
      @include retro-grain(0.3);
      display: grid;
      grid-template-columns: 1fr; // Mobile first: single column
      gap: $spacing-lg;
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      padding: $spacing-md $spacing-sm;
      box-shadow: $shadow-hero-grid;

      // Tablet and up: two columns
      @media (min-width: $breakpoint-md) {
        grid-template-columns: 1fr 1.5fr;
        gap: $spacing-2xl;
        padding: $spacing-2xl;
      }
    }

    // Variant: compact (page headers - adapts to content)
    &--compact {
      @include retro-grain(0.3);
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      color: $color-white;
      padding: $spacing-lg $spacing-sm $spacing-md;
      box-shadow: $shadow-hero-default;
      margin-bottom: $spacing-md;

      @media (min-width: $breakpoint-md) {
        padding: $spacing-xl $spacing-md;
        margin-bottom: $spacing-lg;
      }

      @media (min-width: $breakpoint-lg) {
        padding: $spacing-xl $spacing-lg;
      }
    }

    // Overlay for all variants with overlay enabled
    &--overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-color, $brand-quaternary);
      opacity: var(--overlay-opacity, 0.85);
      border-radius: $radius-2xl;
      z-index: 0;
    }

    // Ensure content is above overlay
    &--overlay > :global(*) {
      position: relative;
      z-index: 1;
    }

    // Text alignment
    &--center {
      text-align: center;
    }

    &--left {
      text-align: left;
    }

    &--right {
      text-align: right;
    }
  }
</style>
