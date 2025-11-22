<script lang="ts">
  import type { CardProps } from '../../types';

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
  }: CardProps = $props();
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
  {:else if imageUrl}
    <div class="card__header">
      <img
        src={imageUrl}
        alt={title || ''}
        class="card__image"
      />
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
  @use '../../styles/variables' as *;

  .card {
    background: $color-card-background;
    border: 2px solid $color-card-border;
    border-radius: $radius-xl;
    overflow: hidden;
    transition: all $transition-base $transition-ease;

    &--clickable {
      cursor: pointer;

      &:hover {
        transform: $transform-hover-lift-md;
        box-shadow: $card-hover-shadow;
        border-color: $brand-primary;
      }

      &:active {
        transform: $transform-active-lift;
      }
    }
  }

  .card__header {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: $color-gray-100;
  }

  .card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card__body {
    padding: $spacing-lg;
  }

  .card__title {
    margin: 0 0 $spacing-sm 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  .card__subtitle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-normal;
  }

  .card__footer {
    padding: $spacing-base;
    border-top: 1px solid $color-border-primary;
    background: rgba($brand-primary, $card-footer-background-opacity);
  }
</style>
