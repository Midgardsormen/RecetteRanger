<script lang="ts">
  /**
   * Carousel - Composant de carousel/swiper réutilisable
   *
   * Affiche un carousel horizontal avec scroll snap en mobile
   * et une grille normale en desktop
   */

  interface Props {
    /** Nombre d'items par ligne en mode desktop (grid) */
    columns?: number;
    /** Largeur d'un item en pourcentage en mode mobile (ex: 83.33 pour voir ~1.2 items) */
    itemWidthPercent?: number;
    /** Gap entre les items */
    gap?: 'xs' | 'sm' | 'md' | 'lg';
    /** Index de l'item actuellement sélectionné (pour auto-scroll) */
    activeIndex?: number;
    /** Activer le scroll automatique vers l'item actif */
    autoScroll?: boolean;
    /** Breakpoint en dessous duquel le carousel est activé (en px) */
    mobileBreakpoint?: number;
    /** Contenu du carousel */
    children?: any;
  }

  let {
    columns = 7,
    itemWidthPercent = 83.33,
    gap = 'sm',
    activeIndex = 0,
    autoScroll = true,
    mobileBreakpoint = 768,
    children
  }: Props = $props();

  let carouselElement: HTMLDivElement;

  // Auto-scroll vers l'item actif
  $effect(() => {
    if (carouselElement && autoScroll && activeIndex >= 0) {
      scrollToActiveItem();
    }
  });

  function scrollToActiveItem() {
    if (!carouselElement) return;

    const isMobile = window.innerWidth < mobileBreakpoint;
    if (!isMobile) return;

    // Scroll horizontal en mode mobile
    const itemWidth = carouselElement.scrollWidth / columns;
    const scrollPosition = itemWidth * activeIndex;

    carouselElement.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }
</script>

<div
  class="carousel carousel--gap-{gap} carousel--cols-{columns}"
  style="--item-width: {itemWidthPercent}%; --columns: {columns}; --mobile-breakpoint: {mobileBreakpoint}px;"
  bind:this={carouselElement}
>
  {@render children?.()}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: carousel
  .carousel {
    // Mobile: carousel horizontal avec snap
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 0;

    // Masquer la scrollbar mais garder le scroll
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    // Desktop: grille normale
    @media (min-width: var(--mobile-breakpoint)) {
      display: grid;
      grid-template-columns: repeat(var(--columns), 1fr);
      overflow-x: visible;
      scroll-snap-type: none;
    }

    // Modifier: gap-xs
    &--gap-xs {
      gap: $spacing-xs;

      @media (min-width: var(--mobile-breakpoint)) {
        gap: $spacing-xs;
      }
    }

    // Modifier: gap-sm
    &--gap-sm {
      gap: $spacing-sm;
      padding-right: $spacing-base;

      @media (min-width: var(--mobile-breakpoint)) {
        gap: $spacing-md;
        padding-right: 0;
      }
    }

    // Modifier: gap-md
    &--gap-md {
      gap: $spacing-md;
      padding-right: $spacing-lg;

      @media (min-width: var(--mobile-breakpoint)) {
        gap: $spacing-lg;
        padding-right: 0;
      }
    }

    // Modifier: gap-lg
    &--gap-lg {
      gap: $spacing-lg;
      padding-right: $spacing-xl;

      @media (min-width: var(--mobile-breakpoint)) {
        gap: $spacing-xl;
        padding-right: 0;
      }
    }

    // Items du carousel
    :global(.carousel__item) {
      // Mobile: largeur fixe en pourcentage
      flex: 0 0 var(--item-width);
      scroll-snap-align: start;
      min-width: 0;

      // Le dernier item peut prendre toute la largeur en mobile
      &:last-child {
        flex: 0 0 100%;
      }

      @media (min-width: var(--mobile-breakpoint)) {
        // Desktop: reset flex pour la grille
        flex: unset;
      }
    }
  }
</style>
