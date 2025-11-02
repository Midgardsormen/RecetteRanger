<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    imagePlaceholder?: string;
    clickable?: boolean;
    onclick?: () => void;
    header?: Snippet;
    content?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    imageUrl,
    imagePlaceholder = '🍽️',
    clickable = false,
    onclick,
    header,
    content,
    footer,
    children
  }: Props = $props();
</script>

<div
  class="card"
  class:card--clickable={clickable}
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
  {onclick}
>
  {#if header}
    <div class="card__header">
      {@render header()}
    </div>
  {:else if imageUrl || imagePlaceholder}
    <div class="card__header">
      {#if imageUrl}
        <img
          src={imageUrl}
          alt={title || ''}
          class="card__image"
        />
      {:else}
        <div class="card__placeholder">{imagePlaceholder}</div>
      {/if}
    </div>
  {/if}

  {#if content}
    <div class="card__body">
      {@render content()}
    </div>
  {:else if title || subtitle || children}
    <div class="card__body">
      {#if title}
        <h3 class="card__title">{title}</h3>
      {/if}
      {#if subtitle}
        <p class="card__subtitle">{subtitle}</p>
      {/if}
      {#if children}
        {@render children()}
      {/if}
    </div>
  {/if}

  {#if footer}
    <div class="card__footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style lang="scss">
  $primary-color: #667eea;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .card {
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &--clickable {
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        border-color: $primary-color;
      }

      &:active {
        transform: translateY(-2px);
      }
    }
  }

  .card__header {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  }

  .card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
  }

  .card__body {
    padding: $spacing-base * 1.25;
  }

  .card__title {
    margin: 0 0 $spacing-base * 0.5 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-dark;
    line-height: 1.3;
  }

  .card__subtitle {
    margin: 0;
    font-size: 0.9rem;
    color: $text-gray;
    line-height: 1.4;
  }

  .card__footer {
    padding: $spacing-base;
    border-top: 1px solid $border-color;
    background: rgba(102, 126, 234, 0.02);
  }
</style>
