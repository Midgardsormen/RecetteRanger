<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { ListItem, Button, ConfirmModal, Badge, Tag, PageHero, FilterGroup } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Ingredient, SearchIngredientsDto } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, StoreAisleColors, UnitLabels } from '../../types/ingredient.types';
  import { UserRole } from '../../types/user.types';
  import { getMonthAbbreviations, getSeasonTagVariant } from '../../helpers/season.helper';

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

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let ingredientToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

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
        isFood: true, // Afficher uniquement les articles alimentaires
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

  function openDeleteConfirmation(id: string) {
    ingredientToDelete = id;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    ingredientToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!ingredientToDelete) return;

    try {
      await apiService.deleteIngredient(ingredientToDelete);
      await loadIngredients();
      isConfirmModalOpen = false;
      ingredientToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
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

  function isAdmin(): boolean {
    return user?.role === UserRole.ADMIN;
  }
</script>

<Layout title="Ingrédients" currentPage="/ingredients" {user}>
<div id="ingredients" class="ingredients">
  <PageHero
    title="Mes ingrédients"
    actionLabel="+ Ajouter un ingrédient"
    onAction={() => openDrawer()}
    showSearch={true}
    searchPlaceholder="Rechercher un ingrédient..."
    bind:searchValue={searchQuery}
    onSearchInput={handleSearchInput}
  >
    {#snippet filters()}
      <FilterGroup
        label="Catégorie"
        bind:value={selectedAisle}
        onchange={handleFilterChange}
        options={[
          { value: '', label: 'Toutes' },
          ...Object.entries(StoreAisleLabels).map(([key, label]) => ({
            value: key,
            label
          }))
        ]}
        inverse={true}
      />

      <FilterGroup
        label="Trier par"
        bind:value={sortBy}
        onchange={handleFilterChange}
        options={[
          { value: 'alpha', label: 'Alphabétique' },
          { value: 'date', label: 'Date d\'ajout' },
          { value: 'popularity', label: 'Popularité' }
        ]}
        inverse={true}
      />
    {/snippet}
  </PageHero>

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
          onEdit={isAdmin() ? () => openDrawer(ingredient) : undefined}
          onDelete={isAdmin() ? () => openDeleteConfirmation(ingredient.id) : undefined}
        >
          {#snippet children()}
            <h3 class="ingredient-title">{ingredient.label}</h3>
          {/snippet}

          {#snippet badge()}
            <Badge variant={StoreAisleColors[ingredient.aisle]} size="xs">
              {StoreAisleLabels[ingredient.aisle]}
            </Badge>
          {/snippet}

          {#snippet footer()}
            <div class="ingredient-seasons">
              {#if ingredient.seasonMonths && ingredient.seasonMonths.length > 0}
                {#each ingredient.seasonMonths as month}
                  <Tag variant={getSeasonTagVariant(month)} size="xs">
                    {getMonthAbbreviations([month])[0]}
                  </Tag>
                {/each}
              {:else}
                <!-- Espace vide pour l'uniformité -->
                <div class="ingredient-seasons-placeholder"></div>
              {/if}
            </div>
          {/snippet}
        </ListItem>
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

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer l'ingrédient"
  message={deleteError || "Êtes-vous sûr de vouloir supprimer cet ingrédient ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<!-- Drawer -->
<IngredientDrawer
  isOpen={isDrawerOpen}
  ingredient={editingIngredient}
  onSave={handleIngredientSaved}
  onClose={closeDrawer}
/>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;
  $primary-color: $brand-primary;
  $secondary-color: $brand-secondary;
  $success-color: $color-success;
  $danger-color: $color-danger;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $text-light: $color-gray-400;
  $border-color: $color-gray-200;
  $shadow-primary: rgba($brand-primary, 0.3);
  $shadow-light: $color-black-alpha-08;
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  .ingredients {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    &__error {
      padding: $spacing-base;
      background: $color-background-danger;
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
        background: $primary-color;
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

  .ingredient-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: $line-height-normal;
  }

  .ingredient-seasons {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    min-height: 28px; // Hauteur minimale pour l'uniformité (taille d'un petit tag)
    align-items: flex-start;
    width: 100%;
  }

  .ingredient-seasons-placeholder {
    height: 28px; // Même hauteur qu'un tag small
    width: 100%;
  }
</style>
