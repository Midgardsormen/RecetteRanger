<script lang="ts">
  /**
   * Carousel - Composant de carousel/swiper réutilisable
   *
   * Affiche un carousel horizontal avec scroll snap en mobile/tablet
   * et une grille normale en desktop
   */

  interface ItemsVisibleConfig {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  }

  interface Props {
    /**
     * Configuration du nombre d'items visibles par breakpoint.
     * Exemple: { sm: 1.2, md: 1.2, lg: 2.2, xl: 3.2, '2xl': 7 }
     * Les valeurs décimales permettent de voir une partie du prochain item (ex: 1.2 = 1 item + 20% du suivant)
     */
    itemsVisible?: ItemsVisibleConfig;
    /** @deprecated Utiliser itemsVisible à la place. Nombre d'items par ligne en mode desktop (grid) */
    columns?: number;
    /** @deprecated Utiliser itemsVisible à la place. Largeur d'un item en pourcentage en mode mobile */
    itemWidthPercent?: number;
    /** Gap entre les items */
    gap?: 'xs' | 'sm' | 'md' | 'lg';
    /** Index de l'item actuellement sélectionné (pour auto-scroll) */
    activeIndex?: number;
    /** Activer le scroll automatique vers l'item actif */
    autoScroll?: boolean;
    /** Contenu du carousel */
    children?: any;
  }

  let {
    itemsVisible = { sm: 1.2, md: 1.2, lg: 2.2, xl: 3.2, '2xl': 7 },
    columns,
    itemWidthPercent,
    gap = 'sm',
    activeIndex = 0,
    autoScroll = true,
    children
  }: Props = $props();

  let carouselElement: HTMLDivElement;

  // Calculer le nombre max d'items pour la grille (le plus grand breakpoint)
  const maxColumns = $derived.by(() => {
    const values = Object.values(itemsVisible);
    return Math.ceil(Math.max(...values));
  });

  // Calculer les largeurs d'items pour chaque breakpoint
  const itemWidths = $derived.by(() => {
    const widths: Record<string, number> = {};
    for (const [breakpoint, visible] of Object.entries(itemsVisible)) {
      // Calculer le pourcentage de largeur basé sur le nombre d'items visibles
      // Ex: 1.2 items visibles = 100% / 1.2 = 83.33% de largeur par item
      widths[breakpoint] = (100 / visible);
    }
    return widths;
  });

  // Auto-scroll vers l'item actif
  $effect(() => {
    if (carouselElement && autoScroll && activeIndex >= 0) {
      scrollToActiveItem();
    }
  });

  function scrollToActiveItem() {
    if (!carouselElement) return;

    // Vérifier si on est en mode carousel (pas grille)
    const computedStyle = window.getComputedStyle(carouselElement);
    const isGrid = computedStyle.display === 'grid';
    if (isGrid) return;

    // Scroll horizontal en mode carousel
    const items = carouselElement.querySelectorAll('.carousel__item');
    const activeItem = items[activeIndex] as HTMLElement;

    if (activeItem) {
      const scrollPosition = activeItem.offsetLeft;
      carouselElement.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }
</script>

<div
  class="carousel carousel--gap-{gap}"
  style="
    --columns: {maxColumns};
    --item-width-xs: {itemWidths.xs || itemWidths.sm}%;
    --item-width-sm: {itemWidths.sm}%;
    --item-width-md: {itemWidths.md}%;
    --item-width-lg: {itemWidths.lg}%;
    --item-width-xl: {itemWidths.xl}%;
    --item-width-2xl: {itemWidths['2xl']}%;
  "
  bind:this={carouselElement}
>
  {@render children?.()}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: carousel
  .carousel {
    // Par défaut: carousel horizontal avec snap
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 0;

    // Masquer la scrollbar mais garder le scroll
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    // 2xl breakpoint: grille normale
    @media (min-width: $breakpoint-2xl) {
      display: grid;
      grid-template-columns: repeat(var(--columns), 1fr);
      overflow-x: visible;
      scroll-snap-type: none;
    }

    // Modifier: gap-xs
    &--gap-xs {
      gap: $spacing-xs;

      @media (min-width: $breakpoint-2xl) {
        gap: $spacing-xs;
      }
    }

    // Modifier: gap-sm
    &--gap-sm {
      gap: $spacing-sm;
      padding-right: $spacing-base;

      @media (min-width: $breakpoint-2xl) {
        gap: $spacing-md;
        padding-right: 0;
      }
    }

    // Modifier: gap-md
    &--gap-md {
      gap: $spacing-md;
      padding-right: $spacing-lg;

      @media (min-width: $breakpoint-2xl) {
        gap: $spacing-lg;
        padding-right: 0;
      }
    }

    // Modifier: gap-lg
    &--gap-lg {
      gap: $spacing-lg;
      padding-right: $spacing-xl;

      @media (min-width: $breakpoint-2xl) {
        gap: $spacing-xl;
        padding-right: 0;
      }
    }

    // Items du carousel
    :global(.carousel__item) {
      scroll-snap-align: start;
      min-width: 0;

      // xs breakpoint (< 480px) - mobile très petit
      flex: 0 0 var(--item-width-xs);

      // sm breakpoint (>= 480px) - mobile
      @media (min-width: $breakpoint-xs) {
        flex: 0 0 var(--item-width-sm);
      }

      // md breakpoint (>= 640px) - mobile large / tablet petit
      @media (min-width: $breakpoint-sm) {
        flex: 0 0 var(--item-width-sm);
      }

      // md breakpoint (>= 768px) - tablet
      @media (min-width: $breakpoint-md) {
        flex: 0 0 var(--item-width-md);
      }

      // lg breakpoint (>= 1024px) - desktop
      @media (min-width: $breakpoint-lg) {
        flex: 0 0 var(--item-width-lg);
      }

      // xl breakpoint (>= 1280px) - desktop large
      @media (min-width: $breakpoint-xl) {
        flex: 0 0 var(--item-width-xl);
      }

      // 2xl breakpoint (>= 1536px) - grille
      @media (min-width: $breakpoint-2xl) {
        // Desktop très large: reset flex pour la grille
        flex: unset;
      }
    }
  }
</style>
