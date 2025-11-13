<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button } from '../../components/ui';

  let { recettes = [], user = null }: { recettes?: any[], user?: any } = $props();
</script>

<Layout title="Mes recettes" currentPage="/recettes" {user}>
<div id="recettes" class="recettes">
  <header class="recettes__header">
    <h1 class="recettes__title">📖 Mes recettes</h1>
    <Button variant="primary">+ Ajouter une recette</Button>
  </header>

  <div class="recettes__search">
    <input
      type="text"
      placeholder="Rechercher une recette..."
      class="recettes__search-input"
    />
    <div class="recettes__filters">
      <Button variant="outlined" size="small">Toutes</Button>
      <Button variant="outlined" size="small">Entrées</Button>
      <Button variant="outlined" size="small">Plats</Button>
      <Button variant="outlined" size="small">Desserts</Button>
    </div>
  </div>

  {#if recettes.length === 0}
    <div class="recettes__empty">
      <div class="recettes__empty-icon">📖</div>
      <h2 class="recettes__empty-title">Aucune recette pour le moment</h2>
      <p class="recettes__empty-text">Commencez par ajouter votre première recette!</p>
      <Button variant="primary">Ajouter une recette</Button>
    </div>
  {:else}
    <div class="recettes__grid">
      {#each recettes as recette}
        <div class="recettes__card">
          <h3>{recette.nom}</h3>
          <p>{recette.description}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;
  // Variables
  $primary-color: $brand-primary;
  $secondary-color: $brand-secondary;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $border-color: $color-gray-200;
  $shadow-primary: rgba($brand-primary, 0.3);
  $shadow-light: rgba(0, 0, 0, 0.08);
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  // Block: recettes
  .recettes {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    // Element: header
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-base;
    }

    // Element: title
    &__title {
      margin: 0;
      color: $text-dark;
      font-size: 2rem;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1.5rem;
      }
    }


    // Element: search
    &__search {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    // Element: search-input
    &__search-input {
      width: 100%;
      padding: $spacing-base;
      border: 2px solid $border-color;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color $transition-duration ease;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }

    // Element: filters
    &__filters {
      display: flex;
      gap: $spacing-base * 0.5;
      flex-wrap: wrap;
    }


    // Element: empty
    &__empty {
      text-align: center;
      padding: $spacing-base * 4 $spacing-base * 2;
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
    }

    // Element: empty-icon
    &__empty-icon {
      font-size: 4rem;
      margin-bottom: $spacing-base;
    }

    // Element: empty-title
    &__empty-title {
      color: $text-dark;
      margin: 0 0 $spacing-base * 0.5 0;
    }

    // Element: empty-text
    &__empty-text {
      color: $text-gray;
      margin: 0 0 $spacing-base * 2 0;
    }
  }
</style>
