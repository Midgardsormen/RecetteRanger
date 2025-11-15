<script lang="ts">
  import { IMAGES } from '../constants';
  import { IconButton } from './ui';
  import UserMenu from './UserMenu.svelte';

  let { onMenuToggle, user = null, currentPage = '/' }: { onMenuToggle: () => void; user?: any; currentPage?: string } = $props();

  const isAuthenticated = $derived(user !== null);
  const isHomePage = $derived(currentPage === '/');
  const isPublicPage = $derived(!isAuthenticated && !isHomePage);
</script>

<header class="header" class:header--public={isPublicPage}>
  <div class="header__container">
    <!-- Burger menu button (visible only on mobile/tablet and if authenticated) -->
    {#if isAuthenticated}
      <div class="header__burger">
        <IconButton
          variant="ghost"
          onclick={onMenuToggle}
          ariaLabel="Toggle menu"
        >
          <span class="burger-icon">☰</span>
        </IconButton>
      </div>
    {/if}

    <!-- Logo (always visible) -->
    <a href="/" class="header__brand" class:header__brand--landing={!isAuthenticated && isHomePage} class:header__brand--public={isPublicPage}>
      <div class="header__logo-wrapper">
        <img src={IMAGES.logo.main} alt="RecetteRanger" class="header__logo" />
      </div>
      <span class="header__brand-text">RecetteRanger</span>
    </a>

    <!-- User Menu -->
    <div class="header__user">
      <UserMenu />
    </div>
  </div>
</header>

<style lang="scss">
  @use '../styles/variables' as *;

  .header {

    box-shadow: 0 2px 8px $color-black-alpha-10;
    position: sticky;
    top: 0;
    z-index: $z-index-header;
    height: 64px;

    // Style pour les pages publiques (legal, privacy, etc.)
    &--public {
      position: relative; // Non-sticky
    }

    &__container {
      background: $brand-tertiary;
      height: 100%;
      padding: 0 $spacing-sm;
      display: flex;
      align-items: center;
      gap:$spacing-sm;
      @media (min-width: $breakpoint-md) {
        padding: 0 $spacing-md;
        gap: $spacing-base;
      }
      @media (min-width: $breakpoint-lg) {
        padding: 0 $spacing-lg;
        gap: $spacing-base;
      }
    }

    &__brand {
      display: flex;
      align-items: flex-start;
      text-decoration: none;
      transition: opacity $transition-base;

      // Taille par défaut (pages internes)
      width: 80px;
      height: 80px;

      background: $brand-cream;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      box-shadow:
        1.5px 1.5px 0 $brand-red,
        3px 3px 0 $brand-red,
        0 3px 10px $color-black-alpha-20,
        0 1.5px 4px $color-black-alpha-15;
      z-index: 100;

      @media (min-width: $breakpoint-md) {
        box-shadow:
          2.5px 2.5px 0 $brand-red,
          5px 5px 0 $brand-red,
          0 5px 15px $color-black-alpha-20,
          0 2.5px 5px $color-black-alpha-15;
      }

      @media (min-width: $breakpoint-lg) {
        box-shadow:
          3px 3px 0 $brand-red,
          6px 6px 0 $brand-red,
          0 7px 20px $color-black-alpha-20,
          0 3.5px 7px $color-black-alpha-15;
      }

      top: 0;

      @media (min-width: $breakpoint-md) {
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        width: 120px;
        height: 120px;
      }

      @media (min-width: $breakpoint-lg) {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 160px;
        height: 160px;
        margin-top: 0;
      }

      &:hover {
        opacity: 0.9;
      }

      // Style spécial pour la landing page (homepage non connecté)
      &--landing {
        width: 140px;
        height: 140px;
        box-shadow:
          4px 4px 0 $brand-red,
          8px 8px 0 $brand-red,
          0 8px 24px $color-black-alpha-20,
          0 4px 8px $color-black-alpha-15;
        position: absolute;
        left: 0;
        @media (min-width: $breakpoint-sm) {
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
        }

        @media (min-width: $breakpoint-md) {
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
        }

        @media (min-width: $breakpoint-lg) {
          width: 220px;
          height: 220px;
        }

        .header__logo {
          width: 120px;
          height: 120px;

          @media (min-width: $breakpoint-md) {
            width: 160px;
            height: 160px;
          }

          @media (min-width: $breakpoint-lg) {
            width: 180px;
            height: 180px;
          }
        }
      }

      // Style pour les pages publiques non-homepage (legal, privacy, etc.)
      // Utilise le style par défaut (même taille que les pages internes authentifiées)
      &--public {
        // Aucun override nécessaire, le style par défaut est déjà bon
      }
    }

    &__logo {
      // Taille par défaut (pages internes)
      width: 60px;
      height: 60px;
      object-fit: contain;

      @media (min-width: $breakpoint-md) {
        width: 85px;
        height: 85px;
      }

      @media (min-width: $breakpoint-lg) {
        width: 120px;
        height: 120px;
      }
    }

    &__brand-text {
      // Masqué visuellement mais accessible aux lecteurs d'écran
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    &__user {
      margin-left: auto;
    }

  }

  // Burger button wrapper - only visible on mobile/tablet
  .header__burger {
    display: flex;

    // Hide on desktop (>= 1024px)
    @media (min-width: $breakpoint-lg) {
      display: none;
    }

    // Style the IconButton inside
    :global(button) {
      color: $color-white !important;
      background: $color-white-alpha-10 !important;

      &:hover {
        background: $color-white-alpha-20 !important;
      }
    }
  }

  .burger-icon {
    font-size: 1.5rem;
    line-height: 1;
  }
</style>
