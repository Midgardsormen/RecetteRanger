<script lang="ts">
  import Navigation from '../features/navigation/Navigation.svelte';

  let { title = 'RecetteRanger', currentPage = '/' }: { title?: string; currentPage?: string } = $props();
</script>

<svelte:head>
  <title>{title} - RecetteRanger</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="layout">
  <Navigation {currentPage} />

  <main class="layout__main">
    <slot />
  </main>

  <footer class="layout__footer">
    <p class="layout__footer-text">&copy; 2025 RecetteRanger - Votre gestionnaire de recettes personnel</p>
  </footer>
</div>

<style lang="scss">
  // Variables
  $font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  $background-color: #f5f5f5;
  $footer-bg: #333;
  $footer-text-opacity: 0.8;
  $max-width: 1200px;
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;

  // Global styles
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: $font-stack;
    background: $background-color;
    min-height: 100vh;
  }

  // Block: layout
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    // Element: main
    &__main {
      flex: 1;
      max-width: $max-width;
      width: 100%;
      margin: 0 auto;
      padding: $spacing-base * 2;

      @media (max-width: $breakpoint-mobile) {
        padding: $spacing-base;
      }
    }

    // Element: footer
    &__footer {
      background: $footer-bg;
      color: white;
      text-align: center;
      padding: $spacing-base * 1.5;
      margin-top: auto;
    }

    // Element: footer-text
    &__footer-text {
      margin: 0;
      opacity: $footer-text-opacity;
    }
  }
</style>
