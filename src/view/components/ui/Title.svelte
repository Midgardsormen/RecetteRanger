<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    align?: 'left' | 'center' | 'right';
    gradient?: boolean;
    children?: Snippet;
  }

  let {
    level = 1,
    as,
    align = 'left',
    gradient = false,
    children
  }: Props = $props();

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
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $text-dark: #333;
  $text-gray: #666;

  .title {
    margin: 0;
    font-weight: 700;
    line-height: 1.2;
    color: $text-dark;

    // Levels (sizes)
    &--level-1 {
      font-size: 2.5rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &--level-2 {
      font-size: 2rem;

      @media (max-width: 768px) {
        font-size: 1.75rem;
      }
    }

    &--level-3 {
      font-size: 1.75rem;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }

    &--level-4 {
      font-size: 1.5rem;

      @media (max-width: 768px) {
        font-size: 1.25rem;
      }
    }

    &--level-5 {
      font-size: 1.25rem;

      @media (max-width: 768px) {
        font-size: 1.125rem;
      }
    }

    &--level-6 {
      font-size: 1rem;
      font-weight: 600;
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
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
</style>
