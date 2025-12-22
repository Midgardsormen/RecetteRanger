<script lang="ts">
  /**
   * Carousel - Composant de carousel/swiper réutilisable
   *
   * Affiche un carousel horizontal avec scroll snap en mobile/tablet
   * et une grille normale en desktop
   */

  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import IconButton from '../IconButton';

  interface ItemsVisibleConfig {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  }

  type DisplayControls = boolean | 'mobile-only' | 'desktop-only';

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
    /**
     * Afficher les contrôles prev/next:
     * - false: pas de contrôles
     * - true: contrôles toujours visibles
     * - 'mobile-only': contrôles visibles uniquement en mobile/tablet (< 1024px)
     * - 'desktop-only': contrôles visibles uniquement en desktop (>= 1024px)
     */
    displayControls?: DisplayControls;
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
    displayControls = false,
    children
  }: Props = $props();

  let carouselElement: HTMLDivElement;
  let currentIndex = $state(activeIndex);


  // Mapper les gaps en pixels (basé sur 1rem = 16px)
  const gapSizes: Record<string, string> = {
    'xs': '4px',   // $spacing-xs = 0.25rem
    'sm': '8px',   // $spacing-sm = 0.5rem
    'md': '12px',  // $spacing-md = 0.75rem
    'lg': '24px'   // $spacing-lg = 1.5rem
  };

  // Calculer les largeurs d'items pour chaque breakpoint
  const itemWidths = $derived.by(() => {
    const widths: Record<string, string> = {};
    const gapPx = gapSizes[gap] || '12px';

    for (const [breakpoint, visible] of Object.entries(itemsVisible)) {
      // Calcul de la largeur d'un item en tenant compte des gaps
      // Si visible = 7 : les 7 items + 6 gaps = 100%
      // Si visible = 7.2 : les 7.2 items + 7 gaps (7 items complets + 0.2 partiel) = 100%

      // Nombre de gaps à considérer :
      // - Pour un nombre entier n : n-1 gaps (entre les n items)
      // - Pour un nombre décimal n.x : floor(n) gaps (avant le dernier item partiel)
      const isInteger = visible % 1 === 0;
      const numGaps = isInteger ? visible - 1 : Math.floor(visible);

      // Formule : (100% - (numGaps * gapPx)) / visible
      // Ex pour 7 items : (100% - 6*12px) / 7 = chaque item prend sa part égale de l'espace restant
      // Ex pour 7.2 items : (100% - 7*12px) / 7.2 = idem
      widths[breakpoint] = `calc((100% - (${numGaps} * ${gapPx})) / ${visible})`;
    }
    return widths;
  });

  // Nombre total d'items
  const totalItems = $derived.by(() => {
    if (!carouselElement) return 0;
    return carouselElement.querySelectorAll('.carousel__item').length;
  });

  // Vérifier si on peut scroller (si le contenu dépasse le conteneur)
  let canScroll = $state(false);
  let scrollLeft = $state(0);
  let scrollWidth = $state(0);
  let clientWidth = $state(0);

  // Vérifier si tous les items sont visibles (tolérance de 50px pour le padding)
  const allItemsVisible = $derived(scrollWidth - clientWidth <= 50);

  // Vérifier si on peut aller au précédent/suivant
  const canGoPrev = $derived(scrollLeft > 0);
  const canGoNext = $derived(scrollLeft < scrollWidth - clientWidth - 1);

  // Afficher les contrôles seulement si tous les items ne sont pas visibles
  const shouldShowControls = $derived(!allItemsVisible && displayControls !== false);

  // Mettre à jour les dimensions et position de scroll
  $effect(() => {
    if (!carouselElement) return;

    const updateScrollState = () => {
      scrollLeft = carouselElement.scrollLeft;
      scrollWidth = carouselElement.scrollWidth;
      clientWidth = carouselElement.clientWidth;
      canScroll = scrollWidth > clientWidth;

      // Debug
      console.log('Carousel scroll state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        allItemsVisible: scrollWidth <= clientWidth,
        diff: scrollWidth - clientWidth
      });
    };

    // Initialiser avec un léger délai pour s'assurer que le rendu est terminé
    setTimeout(updateScrollState, 0);

    // Écouter les changements de scroll
    carouselElement.addEventListener('scroll', updateScrollState);

    // Écouter les changements de taille
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(carouselElement);

    return () => {
      carouselElement.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  });

  // Auto-scroll vers l'item actif
  $effect(() => {
    if (carouselElement && autoScroll && activeIndex >= 0) {
      currentIndex = activeIndex;
      scrollToActiveItem();
    }
  });

  function scrollToActiveItem() {
    if (!carouselElement) return;

    // Scroll horizontal en mode carousel
    const items = carouselElement.querySelectorAll('.carousel__item');
    const activeItem = items[currentIndex] as HTMLElement;

    if (activeItem) {
      const scrollPosition = activeItem.offsetLeft;
      carouselElement.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  function goToPrev() {
    if (!canGoPrev) return;

    // Scroller vers la gauche d'une largeur d'item
    const items = carouselElement.querySelectorAll('.carousel__item');
    if (items.length === 0) return;

    const firstItem = items[0] as HTMLElement;
    const itemWidth = firstItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(carouselElement).gap) || 0;

    carouselElement.scrollBy({
      left: -(itemWidth + gap),
      behavior: 'smooth'
    });
  }

  function goToNext() {
    if (!canGoNext) return;

    // Scroller vers la droite d'une largeur d'item
    const items = carouselElement.querySelectorAll('.carousel__item');
    if (items.length === 0) return;

    const firstItem = items[0] as HTMLElement;
    const itemWidth = firstItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(carouselElement).gap) || 0;

    carouselElement.scrollBy({
      left: itemWidth + gap,
      behavior: 'smooth'
    });
  }
</script>

<div class="carousel-container">
  {#if shouldShowControls}
    <div
      class="carousel__controls carousel__controls--prev"
      class:carousel__controls--mobile-only={displayControls === 'mobile-only'}
      class:carousel__controls--desktop-only={displayControls === 'desktop-only'}
    >
      <IconButton
        variant="ghost"
        size="medium"
        onclick={goToPrev}
        disabled={!canGoPrev}
        ariaLabel="Élément précédent"
      >
        <ChevronLeft size={24} />
      </IconButton>
    </div>
  {/if}

  <div
    class="carousel carousel--gap-{gap}"
    class:carousel--all-visible={allItemsVisible}
    style="
      --item-width-xs: {itemWidths.xs || itemWidths.sm};
      --item-width-sm: {itemWidths.sm};
      --item-width-md: {itemWidths.md};
      --item-width-lg: {itemWidths.lg};
      --item-width-xl: {itemWidths.xl};
      --item-width-2xl: {itemWidths['2xl']};
    "
    bind:this={carouselElement}
  >
    {@render children?.()}
  </div>

  {#if shouldShowControls}
    <div
      class="carousel__controls carousel__controls--next"
      class:carousel__controls--mobile-only={displayControls === 'mobile-only'}
      class:carousel__controls--desktop-only={displayControls === 'desktop-only'}
    >
      <IconButton
        variant="ghost"
        size="medium"
        onclick={goToNext}
        disabled={!canGoNext}
        ariaLabel="Élément suivant"
      >
        <ChevronRight size={24} />
      </IconButton>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: carousel-container
  .carousel-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  // Block: carousel
  .carousel {
    // Toujours en mode carousel horizontal avec snap
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 0;
    flex: 1;

    // Masquer la scrollbar mais garder le scroll
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    // Modifier: gap-xs
    &--gap-xs {
      gap: $spacing-xs;
    }

    // Modifier: gap-sm
    &--gap-sm {
      gap: $spacing-sm;
      padding-right: $spacing-base;
    }

    // Modifier: gap-md
    &--gap-md {
      gap: $spacing-md;
      padding-right: $spacing-lg;
    }

    // Modifier: gap-lg
    &--gap-lg {
      gap: $spacing-lg;
      padding-right: $spacing-xl;
    }

    // Modifier: all-visible (tous les items sont visibles, pas de padding-right)
    &--all-visible {
      padding-right: 0 !important;
      overflow-x: hidden;
    }

    // Element: controls
    &__controls {
      // Par défaut (true): position absolute jusqu'à md, puis relative
      position: absolute;
      top: 60px;
      display: flex;
      align-items: center;
      z-index: 10;

      @media (min-width: $breakpoint-lg) {
        position: relative;
        top: unset;
      }

      // Modifier: prev
      &--prev {
        left: 0;

        @media (min-width: $breakpoint-lg) {
          left: unset;
          order: -1;
        }
      }

      // Modifier: next
      &--next {
        right: 0;

        @media (min-width: $breakpoint-lg) {
          right: unset;
          order: 1;
        }
      }

      // Modifier: mobile-only (visible en position absolute jusqu'à md, display none au-delà)
      &--mobile-only {
        display: flex;

        @media (min-width: $breakpoint-lg) {
          display: none;
        }
      }

      // Modifier: desktop-only (display none jusqu'à md, puis visible en position relative)
      &--desktop-only {
        display: none;

        @media (min-width: $breakpoint-lg) {
          display: flex;
          position: relative;
          top: unset;
        }
      }
    }

    // Items du carousel
    :global(.carousel__item) {
      scroll-snap-align: start;
      min-width: 0;
      box-sizing: border-box;

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

      // 2xl breakpoint (>= 1536px) - desktop très large
      @media (min-width: $breakpoint-2xl) {
        flex: 0 0 var(--item-width-2xl);
      }
    }
  }
</style>
