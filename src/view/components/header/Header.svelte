<script lang="ts">
  import { IconButton, Logo } from '../ui';
  import UserMenu from './user-menu/UserMenu.svelte';

  let { onMenuToggle, user = null, currentPage = '/' }: { onMenuToggle: () => void; user?: any; currentPage?: string } = $props();

  const isAuthenticated = $derived(user !== null);
  const isHomePage = $derived(currentPage === '/');
  const isPublicPage = $derived(!isAuthenticated && !isHomePage);

  // Détermine la variante du logo selon le contexte
  const logoVariant = $derived(
    isPublicPage ? 'public' :                          // Pages légales (non connecté, hors home)
    isHomePage && !isAuthenticated ? 'landing' :       // Home non connecté (grand)
    isHomePage && isAuthenticated ? 'home' :           // Home connecté (moyen)
    'default'                                          // Pages internes authentifiées (petit)
  );
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
    <Logo variant={logoVariant} />

    <!-- User Menu -->
    <div class="header__user">
      <UserMenu {user} />
    </div>
  </div>
</header>

<style lang="scss">
  @use '../../styles/variables' as *;

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

    &__user {
      margin-left: auto;
    }

  }

  // Burger button wrapper - visible on mobile/tablet only
  .header__burger {
    // Mobile-first: visible par défaut
    display: flex;

    // Desktop: caché (>= 1024px)
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
