<script lang="ts">
  import Layout from '../layouts/Layout.svelte';

  let { recettes = [] }: { recettes?: any[] } = $props();
</script>

<Layout title="Mes recettes" currentPage="/recettes">
  <div class="recettes">
    <header class="recettes__header">
      <h1 class="recettes__title">📖 Mes recettes</h1>
      <button class="recettes__btn">+ Ajouter une recette</button>
    </header>

    <div class="recettes__search">
      <input
        type="text"
        placeholder="Rechercher une recette..."
        class="recettes__search-input"
      />
      <div class="recettes__filters">
        <button class="recettes__filter-btn">Toutes</button>
        <button class="recettes__filter-btn">Entrées</button>
        <button class="recettes__filter-btn">Plats</button>
        <button class="recettes__filter-btn">Desserts</button>
      </div>
    </div>

    {#if recettes.length === 0}
      <div class="recettes__empty">
        <div class="recettes__empty-icon">📖</div>
        <h2 class="recettes__empty-title">Aucune recette pour le moment</h2>
        <p class="recettes__empty-text">Commencez par ajouter votre première recette!</p>
        <button class="recettes__btn">Ajouter une recette</button>
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
  // Variables
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-primary: rgba(102, 126, 234, 0.3);
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

    // Element: btn
    &__btn {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;
      border: none;
      padding: $spacing-base * 0.75 $spacing-base * 1.5;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-duration ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $shadow-primary;
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

    // Element: filter-btn
    &__filter-btn {
      padding: $spacing-base * 0.5 $spacing-base;
      border: 2px solid $border-color;
      background: $white;
      border-radius: 8px;
      cursor: pointer;
      transition: all $transition-duration ease;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }
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
