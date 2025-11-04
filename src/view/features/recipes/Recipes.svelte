<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { RecipeDrawer } from '../recipe-drawer';
  import { SearchBar, Card, Button, Title, Filter, ConfirmModal } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Recipe } from '../../types/recipe.types';
  import { RecipeCategory, RecipeCategoryLabels } from '../../types/recipe.types';
  import { UserRole } from '../../types/user.types';

  // Recevoir les données du SSR
  let { recipes: initialRecipes = [], user = null }: { recipes?: Recipe[], user?: any } = $props();

  let recipes: Recipe[] = $state(initialRecipes);
  let loading = $state(false);
  let error = $state('');

  // Pagination
  let currentPage = $state(0);
  let totalPages = $state(0);
  let totalRecipes = $state(initialRecipes.length);

  // Filtres et recherche
  let searchQuery = $state('');
  let selectedCategory = $state<RecipeCategory | ''>('');
  let sortBy = $state<'alpha' | 'date' | 'popularity'>('alpha');
  let filter = $state<'all' | 'mine'>('all');

  // Drawer
  let isDrawerOpen = $state(false);
  let editingRecipe = $state<Recipe | null>(null);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let recipeToDelete = $state<string | null>(null);

  // Debounce pour la recherche
  let searchTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Si pas de données SSR, charger les recettes
    if (recipes.length === 0) {
      loadRecipes();
    }
  });

  async function loadRecipes() {
    loading = true;
    error = '';

    try {
      const searchParams = {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        sortBy,
        filter,
        limit: 20,
        page: currentPage,
      };

      const result = await apiService.searchRecipes(searchParams);
      recipes = result.data || result.items || [];
      totalRecipes = result.pagination?.total || recipes.length;
      totalPages = result.pagination?.totalPages || Math.ceil(totalRecipes / 20);
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des recettes';
      recipes = [];
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      loadRecipes();
    }, 300);
  }

  function handleFilterChange() {
    currentPage = 0;
    loadRecipes();
  }

  function openDrawer(recipe: Recipe | null = null) {
    editingRecipe = recipe;
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
    editingRecipe = null;
  }

  async function handleRecipeSaved() {
    closeDrawer();
    await loadRecipes();
  }

  function openDeleteConfirmation(id: string) {
    recipeToDelete = id;
    isConfirmModalOpen = true;
  }

  function cancelDelete() {
    recipeToDelete = null;
    isConfirmModalOpen = false;
  }

  async function confirmDelete() {
    if (!recipeToDelete) return;

    try {
      await apiService.deleteRecipe(recipeToDelete);
      await loadRecipes();
      isConfirmModalOpen = false;
      recipeToDelete = null;
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadRecipes();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      loadRecipes();
    }
  }

  function goToPage(page: number) {
    currentPage = page;
    loadRecipes();
  }

  function formatTime(minutes: number): string {
    if (minutes === 0) return '';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  }

  function canModifyRecipe(recipe: Recipe): boolean {
    if (!user) return false;
    // Admin peut tout modifier
    if (user.role === UserRole.ADMIN) return true;
    // Utilisateur peut modifier ses propres recettes
    return recipe.ownerId === user.id;
  }
</script>

<Layout title="Recettes" currentPage="/recipes" {user}>
<div id="recipes" class="recipes">
  <header class="recipes__header">
    <Title level={1}>📖 Mes recettes</Title>
    <Button onclick={() => openDrawer()}>
      + Ajouter une recette
    </Button>
  </header>

  <!-- Recherche et filtres -->
  <div class="recipes__search">
    <SearchBar
      bind:value={searchQuery}
      placeholder="Rechercher une recette..."
      oninput={handleSearchInput}
    />

    <div class="recipes__filters">
      <div class="recipes__filter-group">
        <span class="recipes__filter-label">Affichage</span>
        <Filter
          label="Recettes"
          mode="dropdown"
          bind:value={filter}
          onchange={handleFilterChange}
          options={[
            { value: 'all', label: 'Toutes les recettes' },
            { value: 'mine', label: 'Mes recettes' }
          ]}
        />
      </div>

      <div class="recipes__filter-group">
        <span class="recipes__filter-label">Filtrer par</span>
        <Filter
          label="Catégorie"
          mode="dropdown"
          bind:value={selectedCategory}
          onchange={handleFilterChange}
          options={[
            { value: '', label: 'Toutes' },
            ...Object.entries(RecipeCategoryLabels).map(([key, label]) => ({
              value: key,
              label
            }))
          ]}
        />
      </div>

      <div class="recipes__filter-group">
        <span class="recipes__filter-label">Trier par</span>
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
    <div class="recipes__error">{error}</div>
  {/if}

  {#if loading}
    <div class="recipes__loading">Chargement...</div>
  {:else if recipes.length === 0}
    <div class="recipes__empty">
      <div class="recipes__empty-icon">📖</div>
      <h2 class="recipes__empty-title">Aucune recette trouvée</h2>
      <p class="recipes__empty-text">
        {searchQuery || selectedCategory
          ? 'Essayez de modifier vos filtres de recherche'
          : 'Commencez par ajouter votre première recette!'}
      </p>
      {#if !searchQuery && !selectedCategory}
        <Button onclick={() => openDrawer()}>
          Ajouter une recette
        </Button>
      {/if}
    </div>
  {:else}
    <div class="recipes__grid">
      {#each recipes as recipe (recipe.id)}
        <Card
          title={recipe.label}
          subtitle={recipe.description}
          imageUrl={recipe.imageUrl}
          imagePlaceholder="🍽️"
          clickable={true}
          onclick={() => window.location.href = `/recettes/${recipe.id}`}
        >
          {#snippet footer()}
            <div class="recipe-card-footer">
              <div class="recipe-card-info">
                {#if recipe.prepMinutes > 0}
                  <span class="recipe-card-badge">
                    ⏱️ {formatTime(recipe.prepMinutes)}
                  </span>
                {/if}
                {#if recipe.cookMinutes > 0}
                  <span class="recipe-card-badge">
                    🔥 {formatTime(recipe.cookMinutes)}
                  </span>
                {/if}
                {#if recipe.ingredients?.length > 0}
                  <span class="recipe-card-badge">
                    🥕 {recipe.ingredients.length} ingr.
                  </span>
                {/if}
              </div>
              {#if canModifyRecipe(recipe)}
                <div class="recipe-card-actions">
                  <button
                    class="recipe-card-action"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDrawer(recipe);
                    }}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    class="recipe-card-action recipe-card-action--delete"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(recipe.id);
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              {/if}
            </div>
          {/snippet}
        </Card>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="recipes__pagination">
        <Button
          variant="secondary"
          onclick={previousPage}
          disabled={currentPage === 0}
        >
          ← Précédent
        </Button>

        <div class="recipes__pagination-pages">
          {#each Array(totalPages) as _, i}
            <button
              class="recipes__pagination-page"
              class:recipes__pagination-page--active={i === currentPage}
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

      <p class="recipes__pagination-info">
        Page {currentPage + 1} sur {totalPages} • {totalRecipes} recette{totalRecipes > 1 ? 's' : ''}
      </p>
    {/if}
  {/if}
</div>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer la recette"
  message="Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible."
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>

<!-- Drawer -->
<RecipeDrawer
  isOpen={isDrawerOpen}
  recipe={editingRecipe}
  onSave={handleRecipeSaved}
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

  .recipes {
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

    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 1.5;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 1536px) {
        grid-template-columns: repeat(4, 1fr);
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

  // Recipe Card Footer
  .recipe-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-base;
  }

  .recipe-card-info {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-base * 0.5;
    flex: 1;
  }

  .recipe-card-badge {
    display: inline-flex;
    align-items: center;
    padding: $spacing-base * 0.25 $spacing-base * 0.5;
    background: rgba(102, 126, 234, 0.1);
    color: $primary-color;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .recipe-card-actions {
    display: flex;
    gap: $spacing-base * 0.5;
  }

  .recipe-card-action {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: $spacing-base * 0.25;
    border-radius: 6px;
    transition: all 0.2s;
    opacity: 0.6;

    &:hover {
      opacity: 1;
      background: rgba(102, 126, 234, 0.1);
    }

    &--delete {
      &:hover {
        background: rgba(245, 101, 101, 0.1);
      }
    }
  }
</style>
