<script lang="ts">
  /**
   * PageHero Component
   *
   * A page-level hero section with title, optional subtitle, action button,
   * search bar, progress indicator, and filters.
   * Built on top of the Hero component with specific styling for page headers.
   */

  import { onMount } from 'svelte';
  import type { PageHeroProps } from '../../../types/ui.types';
  import Hero from '../Hero';
  import Title from '../Title';
  import SearchBar from '../SearchBar';
  import Button from '../Button.svelte';
  import IconButton from '../IconButton';
  import Drawer from '../Drawer';
  import { SlidersHorizontal, Plus } from 'lucide-svelte';
  import { PAGE_HERO_DEFAULTS, PAGE_HERO_CONFIG } from './PageHero.config';

  let {
    title,
    subtitle,
    actionLabel,
    actionIcon,
    onAction,
    additionalActions,
    showSearch = PAGE_HERO_DEFAULTS.showSearch,
    searchPlaceholder = PAGE_HERO_DEFAULTS.searchPlaceholder,
    searchValue = $bindable(''),
    onSearchInput,
    progress,
    filters,
    children
  }: PageHeroProps = $props();

  // Drawer pour les filtres en mobile
  let isFilterDrawerOpen = $state(false);

  // Bottom dynamique du bouton FAB en fonction de la position du footer
  let fabBottom = $state(16); // $spacing-md par défaut

  onMount(() => {
    const footer = document.querySelector('.layout__footer');
    if (!footer) return;

    let rafId: number | null = null;
    let isScrolling = false;

    const updateFabPosition = () => {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Si le footer est visible dans le viewport
      if (footerRect.top < viewportHeight) {
        // Calculer combien de pixels du footer sont visibles
        const footerVisibleHeight = viewportHeight - footerRect.top;
        // Ajuster le bottom du FAB pour qu'il reste au-dessus du footer
        fabBottom = footerVisibleHeight + 16; // 16px de marge
      } else {
        // Le footer n'est pas visible, position par défaut
        fabBottom = 16;
      }

      isScrolling = false;
    };

    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(updateFabPosition);
      }
    };

    // Observer avec IntersectionObserver pour détecter quand le footer entre dans le viewport
    const observer = new IntersectionObserver(
      () => {
        updateFabPosition();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Quelques seuils suffisent
      }
    );

    observer.observe(footer);

    // Mettre à jour au scroll avec requestAnimationFrame
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateFabPosition, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateFabPosition);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
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
        <div class="page-hero__title-wrapper">
          <Title level={1} align="left" size="s">{title}</Title>
          {#if subtitle}
            <p class="page-hero__subtitle">{subtitle}</p>
          {/if}
        </div>
      </div>
      <div class="page-hero__actions-desktop">
        {#if additionalActions}
          <div class="page-hero__additional-actions">
            {@render additionalActions()}
          </div>
        {/if}
        {#if actionLabel && onAction}
          <!-- Button visible en desktop uniquement -->
          <div class="page-hero__action-desktop">
            <Button variant="primary-inverse" onclick={onAction}>
              {#if actionIcon}
                {@render actionIcon()}
              {/if}
              {actionLabel}
            </Button>
          </div>
        {/if}
      </div>
    </div>

    {#if showSearch || progress || filters}
      <div class="page-hero__controls">
        {#if showSearch && filters}
          <!-- SearchBar + bouton Filtrer sur la même ligne (mobile) -->
          <div class="page-hero__search-with-filter">
            <SearchBar
              bind:value={searchValue}
              placeholder={searchPlaceholder}
              oninput={onSearchInput}
            />
            <div class="page-hero__filters-mobile">
              <IconButton
                variant="outlined-inverse"
                size="large"
                onclick={() => isFilterDrawerOpen = true}
                ariaLabel="Filtrer"
              >
                <SlidersHorizontal size={24} />
              </IconButton>
            </div>
          </div>
        {:else if showSearch}
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
          <!-- Filtres visibles seulement sur desktop -->
          <div class="page-hero__filters-desktop">
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

<!-- Button mobile en position fixed avec bottom dynamique -->
{#if actionLabel && onAction}
  <div class="page-hero__action-mobile" style="bottom: {fabBottom}px;">
    <Button
      variant="tertiary"
      size="medium"
      onclick={onAction}
    >
      {#if actionIcon}
        {@render actionIcon()}
      {/if}
      {actionLabel}
    </Button>
  </div>
{/if}

<!-- Drawer pour les filtres en mobile -->
{#if filters}
  <Drawer
    isOpen={isFilterDrawerOpen}
    title="Filtres"
    onClose={() => isFilterDrawerOpen = false}
    position="right"
    primaryAction={{
      label: 'Appliquer',
      onClick: () => isFilterDrawerOpen = false
    }}
    secondaryAction={{
      label: 'Annuler',
      onClick: () => isFilterDrawerOpen = false
    }}
  >
    <div class="page-hero__filters-drawer">
      {@render filters()}
    </div>
  </Drawer>
{/if}

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
    margin-bottom: $spacing-md;
    @media (min-width: $breakpoint-md) {
       margin-bottom: $spacing-lg;
    }
    // Ajouter un espacement entre l'icône et le texte du bouton d'action
    :global(.button) {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
    }
  }

  .page-hero__title-section {
    // Mobile first: flexbox pour aligner titre et IconButton
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $spacing-base;
    flex: 1;
    align-items: center;
    // Desktop: comportement normal
    @media (min-width: $breakpoint-sm) {
      display: block;
    }
  }

  .page-hero__title-wrapper {
    flex: 1;
    min-width: 0; // Permet au texte de se tronquer si nécessaire
    
  }

  .page-hero__action-mobile {
    // Mobile first: afficher le Button en position fixed avec bottom dynamique
    position: fixed;
    right: $spacing-sm;
    z-index: 100;
    display: flex;
    flex-shrink: 0;

    :global{
      .button{
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
      }
    }

    // Desktop: masquer le Button
    @media (min-width: $breakpoint-sm) {
      display: none;
    }
  }

  .page-hero__actions-desktop {
    display: none;

    @media (min-width: $breakpoint-sm) {
      display: flex;
      align-items: center;
      gap: $spacing-base;
    }
  }

  .page-hero__additional-actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .page-hero__action-desktop {
    // Le bouton principal sera affiché dans le conteneur actions-desktop
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
    flex: 1; // Permet au SearchBar de prendre l'espace disponible

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

  // SearchBar avec bouton filtrer (mobile)
  .page-hero__search-with-filter {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    width: 100%;

    // Le SearchBar doit prendre l'espace disponible et pouvoir rétrécir
    :global(.search-bar) {
      flex: 1;
      min-width: 0; // Permet au SearchBar de rétrécir en dessous de sa taille de contenu
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

  // Bouton filtrer (visible seulement en mobile)
  .page-hero__filters-mobile {
    display: none;

    @media (max-width: $breakpoint-md) {
      display: block;
    }
  }

  // Filtres desktop (cachés en mobile)
  .page-hero__filters-desktop {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    @media (max-width: $breakpoint-md) {
      display: none;
    }

    // Override Select label color for dark background
    :global(label) {
      color: $color-white;
      font-weight: $font-weight-semibold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }

  // Filtres dans le drawer (mobile)
  .page-hero__filters-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .page-hero__content {
    margin-top: $spacing-lg;
  }
</style>
