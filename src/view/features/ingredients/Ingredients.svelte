<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { SearchBar, ListItem, Button, Title, Filter } from '../../components/ui';
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
    <Title level={1}>🥗 Mes ingrédients</Title>
    <Button onclick={() => openDrawer()}>
      + Ajouter un ingrédient
    </Button>
  </header>

  <!-- Recherche et filtres -->
  <div class="ingredients__search">
    <SearchBar
      bind:value={searchQuery}
      placeholder="Rechercher un ingrédient..."
      oninput={handleSearchInput}
    />

    <div class="ingredients__filters">
      <div class="ingredients__filter-group">
        <span class="ingredients__filter-label">Filtrer par</span>
        <Filter
          label="Catégorie"
          mode="dropdown"
          bind:value={selectedAisle}
          onchange={handleFilterChange}
          options={[
            { value: '', label: 'Toutes' },
            ...Object.entries(StoreAisleLabels).map(([key, label]) => ({
              value: key,
              label
            }))
          ]}
        />
      </div>

      <div class="ingredients__filter-group">
        <span class="ingredients__filter-label">Trier par</span>
        <Filter
          label="Ordre"
          mode="dropdown"
          bind:value={sortBy}
          onchange={handleFilterChange}
          options={[
            { value: 'alpha', label: 'Alphabétique' },
            { value: 'date', label: 'Date d\'ajout' },
            { value: 'popularity', label: 'Popularité' }
          ]}
        />
      </div>
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
        <Button onclick={() => openDrawer()}>
          Ajouter un ingrédient
        </Button>
      {/if}
    </div>
  {:else}
    <div class="ingredients__list">
      {#each ingredients as ingredient (ingredient.id)}
        <ListItem
          imageUrl={ingredient.imageUrl}
          imagePlaceholder="🍽️"
          title={ingredient.label}
          subtitle={StoreAisleLabels[ingredient.aisle]}
          onEdit={() => openDrawer(ingredient)}
          onDelete={() => handleDelete(ingredient.id)}
        />
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="ingredients__pagination">
        <Button
          variant="secondary"
          onclick={previousPage}
          disabled={currentPage === 0}
        >
          ← Précédent
        </Button>

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

        <Button
          variant="secondary"
          onclick={nextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Suivant →
        </Button>
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


    &__search {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    &__filters {
      display: flex;
      gap: $spacing-base * 2;
      flex-wrap: wrap;
    }

    &__filter-group {
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 0.5;
    }

    &__filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: $text-gray;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

    &__list {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-base * 1.25;
      }

      @media (min-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    &__pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $spacing-base;
      margin-top: $spacing-base * 2;
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
