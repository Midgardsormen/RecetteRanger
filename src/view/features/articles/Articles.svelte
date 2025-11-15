<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { ListItem, Button, Filter, ConfirmModal, PageHero } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Ingredient, SearchIngredientsDto } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, UnitLabels } from '../../types/ingredient.types';
  import { UserRole } from '../../types/user.types';

  // Recevoir les données du SSR
  let { articles: initialArticles = [], user = null }: { articles?: Ingredient[], user?: any } = $props();

  let articles: Ingredient[] = $state(initialArticles);
  let loading = $state(false);
  let error = $state('');

  // Pagination
  let currentPage = $state(0);
  let totalPages = $state(0);
  let totalArticles = $state(initialArticles.length);

  // Filtres et recherche
  let searchQuery = $state('');
  let selectedAisle = $state<StoreAisle | ''>('');
  let selectedUnit = $state<Unit | ''>('');
  let sortBy = $state<'alpha' | 'date' | 'popularity'>('alpha');

  // Drawer
  let isDrawerOpen = $state(false);
  let editingArticle = $state<Ingredient | null>(null);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let articleToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

  // Debounce pour la recherche
  let searchTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Si pas de données SSR, charger les articles
    if (articles.length === 0) {
      loadArticles();
    }
  });

  async function loadArticles() {
    loading = true;
    error = '';

    try {
      const searchParams: SearchIngredientsDto = {
        search: searchQuery || undefined,
        aisle: selectedAisle || undefined,
        unit: selectedUnit || undefined,
        // Pas de filtre isFood - afficher tous les articles
        sortBy,
        limit: 20,
        page: currentPage,
      };

      const result = await apiService.searchIngredients(searchParams);
      articles = result.data;
      totalArticles = result.pagination.total;
      totalPages = result.pagination.totalPages;
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des articles';
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      loadArticles();
    }, 300);
  }

  function handleFilterChange() {
    currentPage = 0;
    loadArticles();
  }

  function openDrawer(article: Ingredient | null = null) {
    editingArticle = article;
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
    editingArticle = null;
  }

  async function handleArticleSaved() {
    closeDrawer();
    await loadArticles();
  }

  function openDeleteConfirmation(id: string) {
    articleToDelete = id;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    articleToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!articleToDelete) return;

    try {
      await apiService.deleteIngredient(articleToDelete);
      await loadArticles();
      isConfirmModalOpen = false;
      articleToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadArticles();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      loadArticles();
    }
  }

  function goToPage(page: number) {
    currentPage = page;
    loadArticles();
  }

  function isAdmin(): boolean {
    return user?.role === UserRole.ADMIN;
  }
</script>

<Layout title="Articles" currentPage="/articles" {user}>
<div id="articles" class="articles">
  <PageHero
    title="Mes articles"
    actionLabel="+ Ajouter un article"
    onAction={() => openDrawer()}
    showSearch={true}
    searchPlaceholder="Rechercher un article..."
    bind:searchValue={searchQuery}
    onSearchInput={handleSearchInput}
  >
    {#snippet filters()}
      <div class="articles__filter-group">
        <span class="articles__filter-label">Filtrer par</span>
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

      <div class="articles__filter-group">
        <span class="articles__filter-label">Trier par</span>
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
    {/snippet}
  </PageHero>

  {#if error}
    <div class="articles__error">{error}</div>
  {/if}

  {#if loading}
    <div class="articles__loading">Chargement...</div>
  {:else if articles.length === 0}
    <div class="articles__empty">
      <div class="articles__empty-icon">🛒</div>
      <h2 class="articles__empty-title">Aucun article trouvé</h2>
      <p class="articles__empty-text">
        {searchQuery || selectedAisle || selectedUnit
          ? 'Essayez de modifier vos filtres de recherche'
          : 'Commencez par ajouter votre premier article!'}
      </p>
      {#if !searchQuery && !selectedAisle && !selectedUnit}
        <Button onclick={() => openDrawer()}>
          Ajouter un article
        </Button>
      {/if}
    </div>
  {:else}
    <div class="articles__list">
      {#each articles as article (article.id)}
        <ListItem
          imageUrl={article.imageUrl}
          imagePlaceholder={article.isFood ? "🍽️" : "🧴"}
          title={article.label}
          subtitle={StoreAisleLabels[article.aisle]}
          onEdit={isAdmin() ? () => openDrawer(article) : undefined}
          onDelete={isAdmin() ? () => openDeleteConfirmation(article.id) : undefined}
        />
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="articles__pagination">
        <Button
          variant="secondary"
          onclick={previousPage}
          disabled={currentPage === 0}
        >
          ← Précédent
        </Button>

        <div class="articles__pagination-pages">
          {#each Array(totalPages) as _, i}
            <button
              class="articles__pagination-page"
              class:articles__pagination-page--active={i === currentPage}
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

      <p class="articles__pagination-info">
        Page {currentPage + 1} sur {totalPages} • {totalArticles} article{totalArticles > 1 ? 's' : ''}
      </p>
    {/if}
  {/if}
</div>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer l'article"
  message={deleteError || "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<!-- Drawer -->
<IngredientDrawer
  isOpen={isDrawerOpen}
  ingredient={editingArticle}
  showFoodTypeSelector={true}
  onSave={handleArticleSaved}
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

  .articles {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

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
</style>
