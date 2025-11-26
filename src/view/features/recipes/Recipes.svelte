<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { RecipeDrawer } from '../recipe-drawer';
  import { Card, Button, ConfirmModal, PageHero, Badge, IconButton, FilterGroup, AuthorLink, Drawer, SearchBar } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Recipe } from '../../types/recipe.types';
  import { RecipeCategory, RecipeCategoryLabels } from '../../types/recipe.types';
  import { UserRole } from '../../types/user.types';
  import { BookOpen, Clock, Flame, Carrot, Pencil, Trash2, SlidersHorizontal } from 'lucide-svelte';

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

  // Drawer pour ajouter/éditer une recette
  let isDrawerOpen = $state(false);
  let editingRecipe = $state<Recipe | null>(null);

  // Drawer pour filtres (mobile only)
  let isFilterDrawerOpen = $state(false);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let recipeToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

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
    deleteError = '';
  }

  function cancelDelete() {
    recipeToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!recipeToDelete) return;

    try {
      await apiService.deleteRecipe(recipeToDelete);
      await loadRecipes();
      isConfirmModalOpen = false;
      recipeToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
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

<Layout title="Recettes" currentPage="/recettes" {user}>
<div id="recipes" class="recipes">
  <PageHero
    title="Mes recettes"
    actionLabel="+ Ajouter une recette"
    onAction={() => openDrawer()}
    showSearch={false}
    searchPlaceholder="Rechercher une recette..."
    bind:searchValue={searchQuery}
    onSearchInput={handleSearchInput}
  >
    {#snippet filters()}
      <!-- SearchBar + bouton Filtrer sur la même ligne (mobile) -->
      <div class="recipes__search-with-filter">
        <SearchBar
          bind:value={searchQuery}
          placeholder="Rechercher une recette..."
          oninput={handleSearchInput}
        />
        <div class="recipes__filters-mobile">
          <Button variant="outlined-inverse" onclick={() => isFilterDrawerOpen = true} ariaLabel="Filtrer les recettes">
            <SlidersHorizontal size={20} />
            <span class="recipes__filter-button-text">Filtrer</span>
          </Button>
        </div>
      </div>

      <!-- Filtres visibles seulement sur desktop -->
      <div class="recipes__filters-desktop">
        <FilterGroup
          label="Affichage"
          bind:value={filter}
          onchange={handleFilterChange}
          options={[
            { value: 'all', label: 'Toutes les recettes' },
            { value: 'mine', label: 'Mes recettes' }
          ]}
          inverse={true}
        />

        <FilterGroup
          label="Catégorie"
          bind:value={selectedCategory}
          onchange={handleFilterChange}
          options={[
            { value: '', label: 'Toutes' },
            ...Object.entries(RecipeCategoryLabels).map(([key, label]) => ({
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
      </div>
    {/snippet}
  </PageHero>

  {#if error}
    <div class="recipes__error">{error}</div>
  {/if}

  {#if loading}
    <div class="recipes__loading">Chargement...</div>
  {:else if recipes.length === 0}
    <div class="recipes__empty">
      <div class="recipes__empty-icon">
        <BookOpen size={80} />
      </div>
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
          {#snippet children()}
            {#if recipe.owner}
              <div
                class="recipe-card-author"
                onclick={(e) => e.stopPropagation()}
              >
                <AuthorLink
                  authorId={recipe.owner.id}
                  authorPseudo={recipe.owner.pseudo}
                  authorAvatar={recipe.owner.avatarUrl}
                  size="small"
                />
              </div>
            {/if}
          {/snippet}
          {#snippet footer()}
            <div class="recipe-card-footer">
              <div class="recipe-card-info">
                {#if recipe.prepMinutes > 0}
                  <Badge variant="neutral" size="xs">
                    <Clock size={14} /> {formatTime(recipe.prepMinutes)}
                  </Badge>
                {/if}
                {#if recipe.cookMinutes > 0}
                  <Badge variant="neutral" size="xs">
                    <Flame size={14} /> {formatTime(recipe.cookMinutes)}
                  </Badge>
                {/if}
                {#if recipe.ingredients?.length > 0}
                  <Badge variant="neutral" size="xs">
                    <Carrot size={14} /> {recipe.ingredients.length} ingr.
                  </Badge>
                {/if}
              </div>
              {#if canModifyRecipe(recipe)}
                <div class="recipe-card-actions">
                  <IconButton
                    variant="ghost"
                    size="medium"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDrawer(recipe);
                    }}
                    ariaLabel="Modifier"
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    variant="danger"
                    size="medium"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(recipe.id);
                    }}
                    ariaLabel="Supprimer"
                  >
                    <Trash2 size={18} />
                  </IconButton>
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
  message={deleteError || "Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<!-- Drawer de filtres (mobile only) -->
<Drawer
  isOpen={isFilterDrawerOpen}
  title="Filtres"
  position="right"
  onClose={() => isFilterDrawerOpen = false}
>
  <div class="recipes__filter-drawer-content">
    <FilterGroup
      label="Affichage"
      bind:value={filter}
      onchange={() => {
        handleFilterChange();
        isFilterDrawerOpen = false;
      }}
      options={[
        { value: 'all', label: 'Toutes les recettes' },
        { value: 'mine', label: 'Mes recettes' }
      ]}
    />

    <FilterGroup
      label="Catégorie"
      bind:value={selectedCategory}
      onchange={() => {
        handleFilterChange();
        isFilterDrawerOpen = false;
      }}
      options={[
        { value: '', label: 'Toutes' },
        ...Object.entries(RecipeCategoryLabels).map(([key, label]) => ({
          value: key,
          label
        }))
      ]}
    />

    <FilterGroup
      label="Trier par"
      bind:value={sortBy}
      onchange={() => {
        handleFilterChange();
        isFilterDrawerOpen = false;
      }}
      options={[
        { value: 'alpha', label: 'Alphabétique' },
        { value: 'date', label: 'Date d\'ajout' },
        { value: 'popularity', label: 'Popularité' }
      ]}
    />
  </div>
</Drawer>

<!-- Drawer pour ajouter/éditer une recette -->
<RecipeDrawer
  isOpen={isDrawerOpen}
  recipe={editingRecipe}
  onSave={handleRecipeSaved}
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

  .recipes {
    display: flex;
    flex-direction: column;

    // SearchBar + bouton Filtrer sur la même ligne
    &__search-with-filter {
      display: flex;
      gap: $spacing-sm;
      align-items: flex-start;
      width: 100%;
      min-width: 0; // Permet au conteneur flex de se rétrécir

      // SearchBar prend tout l'espace disponible
      :global(.search-bar) {
        flex: 1;
        min-width: 0; // Permet à la SearchBar de se rétrécir
        background: rgba($color-white, 0.15);
        border-color: rgba($color-white, 0.3);
        backdrop-filter: blur(10px);

        &:focus-within {
          background: rgba($color-white, 0.2);
          border-color: $color-white;
          box-shadow: 0 0 0 3px rgba($color-white, 0.1);
        }
      }

      :global(.search-bar__icon) {
        color: rgba($color-white, 0.7);
        flex-shrink: 0; // L'icône ne doit pas se rétrécir
      }

      :global(.search-bar__input) {
        color: $color-white;
        min-width: 0; // Permet à l'input de se rétrécir

        &::placeholder {
          color: rgba($color-white, 0.6);
        }
      }

      :global(.search-bar__clear-wrapper) {
        flex-shrink: 0; // Le bouton clear ne doit pas se rétrécir
      }

      :global(.search-bar__clear) {
        background: rgba($color-white, 0.2);
        color: $color-white;

        &:hover {
          background: rgba($color-white, 0.3);
        }
      }
    }

    // Filtres desktop : visibles seulement >= 768px
    &__filters-desktop {
      display: none;

      @media (min-width: $breakpoint-md) {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-sm;
      }
    }

    // Bouton filtres mobile : visible seulement < 768px
    &__filters-mobile {
      display: flex;
      flex-shrink: 0; // Le bouton ne doit jamais se rétrécir

      @media (min-width: $breakpoint-md) {
        display: none;
      }
    }

    // Texte du bouton filtrer : masqué sur très petits écrans, visible à partir de sm
    &__filter-button-text {
      display: none;

      @media (min-width: $breakpoint-sm) {
        display: inline;
      }
    }

    // Contenu du drawer de filtres
    &__filter-drawer-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

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

  // Recipe Card Author
  .recipe-card-author {
    margin-top: $spacing-base * 0.75;
    padding-top: $spacing-base * 0.75;
    border-top: 1px solid $border-color;
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

    :global(.badge) {
      :global(svg) {
        flex-shrink: 0;
      }
    }
  }

  .recipe-card-actions {
    display: flex;
    gap: $spacing-base * 0.5;
  }
</style>
