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
      <img src={IMAGES.logo.main} alt="RecetteRanger" class="header__logo" />
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

    &__logo {
      height: 40px;
      width: auto;
      display: block;
    }

    &__brand-text {
      color: $color-white;
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;

      @media (max-width: $breakpoint-sm) {
        display: none;
      }
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
