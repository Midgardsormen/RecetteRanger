<script lang="ts">
  import type { TitleProps } from '../../../types/ui.types';
  import { TITLE_DEFAULTS } from './Title.config';

  let {
    level = TITLE_DEFAULTS.level,
    as,
    align = TITLE_DEFAULTS.align,
    gradient = TITLE_DEFAULTS.gradient,
    children
  }: TitleProps = $props();

  // Si 'as' n'est pas défini, utiliser le niveau
  const tag = as || `h${level}`;
</script>

<svelte:element
  this={tag}
  class="title title--level-{level} title--align-{align}"
  class:title--gradient={gradient}
>
  {#if children}
    {@render children()}
  {/if}
</svelte:element>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .title {
    margin: 0;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: $color-text-primary;

    // Levels (sizes) - Mobile first
    &--level-1 {
      font-size: $font-size-3xl; // 2rem mobile

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-5xl; // 3rem desktop
      }
    }

    &--level-2 {
      font-size: $font-size-2xl; // 1.5rem mobile

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-3xl; // 2rem desktop
      }
    }

    &--level-3 {
      font-size: $font-size-xl; // 1.25rem mobile

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-2xl; // 1.5rem desktop
      }
    }

    &--level-4 {
      font-size: $font-size-lg; // 1.125rem mobile

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xl; // 1.25rem desktop
      }
    }

    &--level-5 {
      font-size: $font-size-base; // 1rem mobile

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-lg; // 1.125rem desktop
      }
    }

    &--level-6 {
      font-size: $font-size-base; // 1rem
      font-weight: $font-weight-semibold;
    }

    // Alignment
    &--align-left {
      text-align: left;
    }

    &--align-center {
      text-align: center;
    }

    &--align-right {
      text-align: right;
    }

    // Gradient
    &--gradient {
      @include brand-gradient-primary;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
</style>
