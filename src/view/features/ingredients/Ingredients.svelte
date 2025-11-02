<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { apiService } from '../../services/api.service';
  import type { Ingredient, SearchIngredientsDto } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, UnitLabels } from '../../types/ingredient.types';

  // Recevoir les données du SSR
  let { ingredients: initialIngredients = [], user = null }: { ingredients?: Ingredient[], user?: any } = $props();

  let ingredients: Ingredient[] = $state(initialIngredients);
  let loading = $state(false);
  let error = $state('');

  // Pagination
  let currentPage = $state(0);
  let totalPages = $state(0);
  let totalIngredients = $state(initialIngredients.length);

  // Filtres et recherche
  let searchQuery = $state('');
  let selectedAisle = $state<StoreAisle | ''>('');
  let selectedUnit = $state<Unit | ''>('');
  let sortBy = $state<'alpha' | 'date' | 'popularity'>('alpha');

  // Drawer
  let isDrawerOpen = $state(false);
  let editingIngredient = $state<Ingredient | null>(null);

  // Debounce pour la recherche
  let searchTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Si pas de données SSR, charger les ingrédients
    if (ingredients.length === 0) {
      loadIngredients();
    }
  });

  async function loadIngredients() {
    loading = true;
    error = '';

    try {
      const searchParams: SearchIngredientsDto = {
        search: searchQuery || undefined,
        aisle: selectedAisle || undefined,
        unit: selectedUnit || undefined,
        sortBy,
        limit: 20,
        page: currentPage,
      };

      const result = await apiService.searchIngredients(searchParams);
      ingredients = result.data;
      totalIngredients = result.pagination.total;
      totalPages = result.pagination.totalPages;
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des ingrédients';
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      loadIngredients();
    }, 300);
  }

  function handleFilterChange() {
    currentPage = 0;
    loadIngredients();
  }

  function openDrawer(ingredient: Ingredient | null = null) {
    editingIngredient = ingredient;
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
    editingIngredient = null;
  }

  async function handleIngredientSaved() {
    closeDrawer();
    await loadIngredients();
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      return;
    }

    try {
      await apiService.deleteIngredient(id);
      await loadIngredients();
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadIngredients();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      loadIngredients();
    }
  }

  function goToPage(page: number) {
    currentPage = page;
    loadIngredients();
  }
</script>

<Layout title="Ingrédients" currentPage="/ingredients" {user}>
<div id="ingredients" class="ingredients">
  <header class="ingredients__header">
    <h1 class="ingredients__title">🥗 Mes ingrédients</h1>
    <button class="ingredients__btn" onclick={() => openDrawer()}>
      + Ajouter un ingrédient
    </button>
  </header>

  <!-- Recherche et filtres -->
  <div class="ingredients__search">
    <input
      type="text"
      placeholder="Rechercher un ingrédient..."
      class="ingredients__search-input"
      bind:value={searchQuery}
      oninput={handleSearchInput}
    />

    <div class="ingredients__filters">
      <select
        class="ingredients__select"
        bind:value={selectedAisle}
        onchange={handleFilterChange}
      >
        <option value="">Toutes les catégories</option>
        {#each Object.entries(StoreAisleLabels) as [key, label]}
          <option value={key}>{label}</option>
        {/each}
      </select>

      <select
        class="ingredients__select"
        bind:value={sortBy}
        onchange={handleFilterChange}
      >
        <option value="alpha">Alphabétique</option>
        <option value="date">Date d'ajout</option>
        <option value="popularity">Popularité</option>
      </select>
    </div>
  </div>

  {#if error}
    <div class="ingredients__error">{error}</div>
  {/if}

  {#if loading}
    <div class="ingredients__loading">Chargement...</div>
  {:else if ingredients.length === 0}
    <div class="ingredients__empty">
      <div class="ingredients__empty-icon">🥗</div>
      <h2 class="ingredients__empty-title">Aucun ingrédient trouvé</h2>
      <p class="ingredients__empty-text">
        {searchQuery || selectedAisle || selectedUnit
          ? 'Essayez de modifier vos filtres de recherche'
          : 'Commencez par ajouter votre premier ingrédient!'}
      </p>
      {#if !searchQuery && !selectedAisle && !selectedUnit}
        <button class="ingredients__btn" onclick={() => openDrawer()}>
          Ajouter un ingrédient
        </button>
      {/if}
    </div>
  {:else}
    <div class="ingredients__grid">
      {#each ingredients as ingredient (ingredient.id)}
        <div class="ingredients__card">
          <div class="ingredients__card-header">
            {#if ingredient.imageUrl}
              <img
                src={ingredient.imageUrl}
                alt={ingredient.label}
                class="ingredients__card-img"
              />
            {:else}
              <div class="ingredients__card-placeholder">🍽️</div>
            {/if}
          </div>

          <div class="ingredients__card-body">
            <h3 class="ingredients__card-title">{ingredient.label}</h3>
            <p class="ingredients__card-aisle">
              {StoreAisleLabels[ingredient.aisle]}
            </p>

            <div class="ingredients__card-units">
              {#each ingredient.units.slice(0, 3) as unit}
                <span class="ingredients__unit-badge">{UnitLabels[unit]}</span>
              {/each}
              {#if ingredient.units.length > 3}
                <span class="ingredients__unit-badge">+{ingredient.units.length - 3}</span>
              {/if}
            </div>

            {#if ingredient.seasonMonths.length > 0}
              <p class="ingredients__card-season">
                🗓️ {ingredient.seasonMonths.length} mois de saison
              </p>
            {/if}

            <p class="ingredients__card-usage">
              📊 Utilisé {ingredient.usageCount} fois
            </p>
          </div>

          <div class="ingredients__card-actions">
            <button
              class="ingredients__card-btn ingredients__card-btn--edit"
              onclick={() => openDrawer(ingredient)}
            >
              ✏️ Modifier
            </button>
            <button
              class="ingredients__card-btn ingredients__card-btn--delete"
              onclick={() => handleDelete(ingredient.id)}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="ingredients__pagination">
        <button
          class="ingredients__pagination-btn"
          onclick={previousPage}
          disabled={currentPage === 0}
        >
          ← Précédent
        </button>

        <div class="ingredients__pagination-pages">
          {#each Array(totalPages) as _, i}
            <button
              class="ingredients__pagination-page"
              class:ingredients__pagination-page--active={i === currentPage}
              onclick={() => goToPage(i)}
            >
              {i + 1}
            </button>
          {/each}
        </div>

        <button
          class="ingredients__pagination-btn"
          onclick={nextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Suivant →
        </button>
      </div>

      <p class="ingredients__pagination-info">
        Page {currentPage + 1} sur {totalPages} • {totalIngredients} ingrédient{totalIngredients > 1 ? 's' : ''}
      </p>
    {/if}
  {/if}
</div>

<!-- Drawer -->
<IngredientDrawer
  isOpen={isDrawerOpen}
  ingredient={editingIngredient}
  onSave={handleIngredientSaved}
  onClose={closeDrawer}
/>
</Layout>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $success-color: #48bb78;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $shadow-primary: rgba(102, 126, 234, 0.3);
  $shadow-light: rgba(0, 0, 0, 0.08);
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  .ingredients {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-base;
    }

    &__title {
      margin: 0;
      color: $text-dark;
      font-size: 2rem;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1.5rem;
      }
    }

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

    &__search {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

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

    &__filters {
      display: flex;
      gap: $spacing-base;
      flex-wrap: wrap;
    }

    &__select {
      flex: 1;
      min-width: 200px;
      padding: $spacing-base * 0.75;
      border: 2px solid $border-color;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: border-color $transition-duration ease;

      &:focus {
        outline: none;
        border-color: $primary-color;
      }
    }

    &__error {
      padding: $spacing-base;
      background: #fee;
      border: 1px solid $danger-color;
      border-radius: 8px;
      color: $danger-color;
    }

    &__loading {
      text-align: center;
      padding: $spacing-base * 4;
      color: $text-gray;
      font-size: 1.2rem;
    }

    &__empty {
      text-align: center;
      padding: $spacing-base * 4 $spacing-base * 2;
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
    }

    &__empty-icon {
      font-size: 4rem;
      margin-bottom: $spacing-base;
    }

    &__empty-title {
      color: $text-dark;
      margin: 0 0 $spacing-base * 0.5 0;
    }

    &__empty-text {
      color: $text-gray;
      margin: 0 0 $spacing-base * 2 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $spacing-base * 1.5;
    }

    &__card {
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
      overflow: hidden;
      transition: transform $transition-duration ease, box-shadow $transition-duration ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
      }
    }

    &__card-header {
      height: 150px;
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__card-placeholder {
      font-size: 4rem;
    }

    &__card-body {
      padding: $spacing-base;
    }

    &__card-title {
      margin: 0 0 $spacing-base * 0.5 0;
      color: $text-dark;
      font-size: 1.25rem;
    }

    &__card-aisle {
      margin: 0 0 $spacing-base * 0.75 0;
      color: $text-gray;
      font-size: 0.9rem;
    }

    &__card-units {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-base * 0.5;
      margin-bottom: $spacing-base * 0.75;
    }

    &__unit-badge {
      padding: $spacing-base * 0.25 $spacing-base * 0.5;
      background: rgba(102, 126, 234, 0.15);
      color: $primary-color;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    &__card-season,
    &__card-usage {
      margin: $spacing-base * 0.25 0;
      color: $text-light;
      font-size: 0.85rem;
    }

    &__card-actions {
      display: flex;
      gap: $spacing-base * 0.5;
      padding: $spacing-base;
      border-top: 1px solid $border-color;
    }

    &__card-btn {
      flex: 1;
      padding: $spacing-base * 0.5;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all $transition-duration ease;

      &--edit {
        background: rgba(102, 126, 234, 0.15);
        color: $primary-color;

        &:hover {
          background: rgba(102, 126, 234, 0.25);
        }
      }

      &--delete {
        background: rgba(245, 101, 101, 0.15);
        color: $danger-color;

        &:hover {
          background: rgba(245, 101, 101, 0.25);
        }
      }
    }

    &__pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $spacing-base;
      margin-top: $spacing-base * 2;
    }

    &__pagination-btn {
      padding: $spacing-base * 0.5 $spacing-base;
      border: 2px solid $border-color;
      background: $white;
      border-radius: 8px;
      cursor: pointer;
      transition: all $transition-duration ease;

      &:hover:not(:disabled) {
        border-color: $primary-color;
        color: $primary-color;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &__pagination-pages {
      display: flex;
      gap: $spacing-base * 0.5;
    }

    &__pagination-page {
      width: 40px;
      height: 40px;
      border: 2px solid $border-color;
      background: $white;
      border-radius: 8px;
      cursor: pointer;
      transition: all $transition-duration ease;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }

      &--active {
        background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
        color: $white;
        border-color: transparent;
      }
    }

    &__pagination-info {
      text-align: center;
      color: $text-gray;
      font-size: 0.9rem;
      margin-top: $spacing-base;
    }
  }
</style>
