<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'default',
    backgroundImage,
    backgroundColor,
    overlay = true,
    overlayOpacity = 0.85,
    textAlign = 'center',
    padding,
    children
  }: {
    variant?: 'default' | 'grid' | 'compact';
    backgroundImage?: string;
    backgroundColor?: string;
    overlay?: boolean;
    overlayOpacity?: number;
    textAlign?: 'left' | 'center' | 'right';
    padding?: string;
    children?: Snippet;
  } = $props();

  const style = $derived.by(() => {
    const styles: string[] = [];

    if (backgroundImage) {
      styles.push(`background-image: url('${backgroundImage}')`);
    }

    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor}`);
      styles.push(`--overlay-color: ${backgroundColor}`);
    }

    if (padding) {
      styles.push(`padding: ${padding}`);
    }

    if (overlay && overlayOpacity) {
      styles.push(`--overlay-opacity: ${overlayOpacity}`);
    }

    return styles.join('; ');
  });
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
  @use '../../styles/variables' as *;

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
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);

      @media (min-width: $breakpoint-md) {
        padding: 8rem $spacing-md $spacing-xl;
      }
      @media (min-width: $breakpoint-lg) {
        padding: 8rem $spacing-lg $spacing-2xl;
      }
    }

    // Variant: grid (recipe detail style)
    &--grid {
      @include retro-grain(0.3);
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2.5rem;
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      padding: 2.5rem;
      box-shadow: 0 2px 12px $color-black-alpha-08;

      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }
    }

    // Variant: compact (page headers - adapts to content)
    &--compact {
      @include retro-grain(0.3);
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      color: $color-white;
      padding: $spacing-lg $spacing-sm;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);
      margin-bottom: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        padding: 2rem $spacing-md;
      }

      @media (min-width: $breakpoint-lg) {
        padding: 2rem $spacing-lg;
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
