<script lang="ts">
  import { onMount } from 'svelte';
  import Navigation from '../features/navigation/Navigation.svelte';
  import Header from '../components/header/Header.svelte';
  import CookieConsent from '../components/cookie/consent/CookieConsent.svelte';
  import CookiePreferences from '../components/cookie/preferences/CookiePreferences.svelte';
  import { authStore } from '../stores/auth.store';
  import { cookieConsentStore } from '../stores/cookie-consent.store';
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

  function openCookiePreferences() {
    cookieConsentStore.setPreferencesVisibility(true);
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
  <Header onMenuToggle={toggleMobileMenu} {user} {currentPage} />

  <Navigation {currentPage} {user} isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

  <main class="layout__main">
    {@render children?.()}
  </main>

  <footer class="layout__footer">
    <p class="layout__footer-text">&copy; 2025 RecetteRanger - Votre gestionnaire de recettes personnel</p>
    <div class="layout__footer-links">
      <a href="/legal-notice" class="layout__footer-link">Mentions légales</a>
      <span class="layout__footer-separator">•</span>
      <a href="/privacy-policy" class="layout__footer-link">Politique de confidentialité</a>
      <span class="layout__footer-separator">•</span>
      <button
        class="layout__footer-link layout__footer-link--button"
        onclick={openCookiePreferences}
      >
        Gérer les cookies
      </button>
    </div>
  </footer>

  <!-- Composants de gestion des cookies -->
  <CookieConsent />
  <CookiePreferences />
</div>

<style lang="scss">
  @use '../styles/variables' as *;
  @import '../styles/fonts.css';

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
    &__main {
      flex: 1;
      padding-bottom: 80px;
    }
    // Element: footer-text
    &__footer-text {
      margin: 0 0 $spacing-sm 0;
      opacity: $opacity-80;
    }

    // Element: footer-links
    &__footer-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      font-size: $font-size-sm;
    }

    // Element: footer-separator
    &__footer-separator {
      opacity: $opacity-50;
    }

    // Element: footer-link
    &__footer-link {
      color: $color-white;
      text-decoration: none;
      opacity: $opacity-80;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
        text-decoration: underline;
      }

      &--button {
        background: none;
        border: none;
        padding: 0;
        font-size: inherit;
        font-family: inherit;
        cursor: pointer;
      }
    }
  }
</style>
