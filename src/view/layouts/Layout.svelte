<script lang="ts">
  import { onMount } from 'svelte';
  import Navigation from '../features/navigation/Navigation.svelte';
  import Header from '../components/Header.svelte';
  import { authStore } from '../stores/auth.store';
  import { apiService } from '../services/api.service';
  import type { Snippet } from 'svelte';

  let { title = 'RecetteRanger', currentPage = '/', user = null, children }: { title?: string; currentPage?: string; user?: any; children?: Snippet } = $props();

  let isMobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  // Initialiser immédiatement l'authStore si on a les données SSR
  if (user) {
    authStore.initialize(user);
  }

  // Vérifier l'authentification via API uniquement si pas de données SSR
  onMount(async () => {
    if (!user) {
      const authenticatedUser = await apiService.checkAuth();
      authStore.initialize(authenticatedUser);
    }
  });
</script>

<svelte:head>
  <title>{title} - RecetteRanger</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="layout">
  <Header onMenuToggle={toggleMobileMenu} {user} />

  <Navigation {currentPage} {user} isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

  <main class="layout__main">
    {@render children?.()}
  </main>

  <footer class="layout__footer">
    <p class="layout__footer-text">&copy; 2025 RecetteRanger - Votre gestionnaire de recettes personnel</p>
  </footer>
</div>

<style lang="scss">
  @import '../styles/fonts.css';
  @import '../styles/_variables';

  // Global styles
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: $font-family-base;
    background: $color-background-secondary;
    min-height: 100vh;
  }

  // Block: layout
  .layout {

    background-color: $color-background-light;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    // Element: main
    &__main {
      flex: 1;
    }
    // Element: footer
    &__footer {
      background: $color-gray-800;
      color: $color-white;
      text-align: center;
      padding: $spacing-lg;
      margin-top: auto;
    }
    &__main, &__footer{
      padding: $spacing-sm;
      @media (min-width: $breakpoint-md) {
        padding: $spacing-md;
      }
      @media (min-width: $breakpoint-lg) {
        padding: $spacing-lg;
      }
    }

    // Element: footer-text
    &__footer-text {
      margin: 0;
      opacity: $opacity-80;
      
    }
  }
</style>
