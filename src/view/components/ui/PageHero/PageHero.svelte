<script lang="ts">
  /**
   * PageHero Component
   *
   * A page-level hero section with title, optional subtitle, action button,
   * search bar, progress indicator, and filters.
   * Built on top of the Hero component with specific styling for page headers.
   */

  import type { PageHeroProps } from '../../../types/ui.types';
  import Hero from '../Hero';
  import Title from '../Title';
  import SearchBar from '../SearchBar';
  import Button from '../Button.svelte';
  import { PAGE_HERO_DEFAULTS, PAGE_HERO_CONFIG } from './PageHero.config';

  let {
    title,
    subtitle,
    actionLabel,
    onAction,
    showSearch = PAGE_HERO_DEFAULTS.showSearch,
    searchPlaceholder = PAGE_HERO_DEFAULTS.searchPlaceholder,
    searchValue = $bindable(''),
    onSearchInput,
    progress,
    filters,
    children
  }: PageHeroProps = $props();
</script>

<Hero
  variant={PAGE_HERO_CONFIG.variant}
  backgroundImage={PAGE_HERO_CONFIG.backgroundImage}
  backgroundColor={PAGE_HERO_CONFIG.backgroundColor}
  overlay={PAGE_HERO_CONFIG.overlay}
  overlayOpacity={PAGE_HERO_CONFIG.overlayOpacity}
  textAlign={PAGE_HERO_CONFIG.textAlign}
>
  <div class="page-hero">
    <div class="page-hero__header">
      <div class="page-hero__title-section">
        <Title level={1} align="left">{title}</Title>
        {#if subtitle}
          <p class="page-hero__subtitle">{subtitle}</p>
        {/if}
      </div>
      {#if actionLabel && onAction}
        <Button variant="primary-inverse" onclick={onAction}>
          {actionLabel}
        </Button>
      {/if}
    </div>

    {#if showSearch || progress || filters}
      <div class="page-hero__controls">
        {#if showSearch}
          <div class="page-hero__search">
            <SearchBar
              bind:value={searchValue}
              placeholder={searchPlaceholder}
              oninput={onSearchInput}
            />
          </div>
        {/if}
        {#if progress}
          <div class="page-hero__progress">
            {@render progress()}
          </div>
        {/if}
        {#if filters}
          <div class="page-hero__filters">
            {@render filters()}
          </div>
        {/if}
      </div>
    {/if}

    {#if children}
      <div class="page-hero__content">
        {@render children()}
      </div>
    {/if}
  </div>
</Hero>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .page-hero {
    // Override Title styles inside PageHero
    :global(.title) {
      text-transform: uppercase;
      font-family: $font-family-heading;
      font-weight: $font-weight-bold;
      color: $color-decorative-title;
      text-shadow: $shadow-decorative-title;
      opacity: 0.9;
      line-height: $line-height-tight;
      margin-bottom: 0;
    }
  }

  .page-hero__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .page-hero__title-section {
    flex: 1;
  }

  .page-hero__subtitle {
    margin: $spacing-xs 0 0 0;
    font-size: $font-size-base;
    color: $color-white-alpha-90;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .page-hero__controls {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .page-hero__search {
    // Override SearchBar styles for dark background
    :global(.search-bar) {
      background: rgba($color-white, 0.15);
      border-color: rgba($color-white, 0.3);
      backdrop-filter: blur(10px);

      &:focus-within {
        background: rgba($color-white, 0.2);
        border-color: $color-white;
        box-shadow: 0 0 0 3px rgba($color-white, 0.1);
      }
    }

    :global(.search-bar__icon) {
      color: rgba($color-white, 0.7);
    }

    :global(.search-bar__input) {
      color: $color-white;

      &::placeholder {
        color: rgba($color-white, 0.6);
      }
    }

    :global(.search-bar__clear) {
      background: rgba($color-white, 0.2);
      color: $color-white;

      &:hover {
        background: rgba($color-white, 0.3);
      }
    }
  }

  .page-hero__progress {
    width: 100%;

    // Override ProgressBar label color for dark background
    :global(.progress-bar__label) {
      color: $color-white;
      font-weight: $font-weight-semibold;
    }
  }

  .page-hero__filters {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    // Override Select label color for dark background
    :global(label) {
      color: $color-white;
      font-weight: $font-weight-semibold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }

  .page-hero__content {
    margin-top: $spacing-lg;
  }
</style>
