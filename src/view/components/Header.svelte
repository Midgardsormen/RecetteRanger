<script lang="ts">
  import { IMAGES } from '../constants';
  import { IconButton } from './ui';
  import UserMenu from './UserMenu.svelte';

  let { onMenuToggle }: { onMenuToggle: () => void } = $props();
</script>

<header class="header">
  <div class="header__container">
    <!-- Burger menu button (visible only on mobile/tablet) -->
    <div class="header__burger">
      <IconButton
        variant="ghost"
        onclick={onMenuToggle}
        ariaLabel="Toggle menu"
      >
        <span class="burger-icon">☰</span>
      </IconButton>
    </div>

    <!-- Logo -->
    <a href="/" class="header__brand">
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
  @import '../styles/_variables';

  .header {
    background: linear-gradient(135deg, $brand-primary 0%, $brand-secondary 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: $z-index-header;
    height: 64px;

    &__container {
      height: 100%;
      padding: 0 $spacing-lg;
      display: flex;
      align-items: center;
      gap: $spacing-base;
    }

    &__brand {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      text-decoration: none;
      transition: opacity $transition-base;

      &:hover {
        opacity: 0.9;
      }
    }

    &__logo-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      background: $color-white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.2),
        0 4px 8px rgba(0, 0, 0, 0.15);
      z-index: 100;
      margin: -28px 0; // Déborde du header (haut et bas)

      // Sur desktop, déborde aussi sur la sidebar
      @media (min-width: $breakpoint-lg) {
        position: absolute;
        left: 190px;
        top: 0;
        transform: none;
        width: 150px;
        height: 150px;
        margin-top: 0;
      }

      @media (max-width: $breakpoint-sm) {
        width: 70px;
        height: 70px;
        margin: -3px 0;
      }
    }

    &__logo {
      width: 85px;
      height: 85px;
      object-fit: contain;

      @media (min-width: $breakpoint-lg) {
        width: 100px;
        height: 100px;
      }

      @media (max-width: $breakpoint-sm) {
        width: 50px;
        height: 50px;
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
      background: rgba(255, 255, 255, 0.1) !important;

      &:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }

  .burger-icon {
    font-size: 1.5rem;
    line-height: 1;
  }
</style>
