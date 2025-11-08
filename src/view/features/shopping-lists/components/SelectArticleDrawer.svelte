<script lang="ts">
  import { Drawer, Button } from '../../../components/ui';
  import { Input } from '../../../components/ui/form';
import IngredientDrawer from '../../../features/ingredient-drawer/IngredientDrawer.svelte';
  import { apiService } from '../../../services/api.service';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onArticleSelected: (article: any) => void;
  }

  let { isOpen, onClose, onArticleSelected }: Props = $props();

  // État
  let searchQuery = $state('');
  let availableArticles = $state<any[]>([]);
  let loadingArticles = $state(false);
  let showAddArticleDrawer = $state(false);

  // Rechercher les articles
  async function loadArticles() {
    if (!searchQuery || searchQuery.length < 2) {
      availableArticles = [];
      return;
    }

    loadingArticles = true;
    try {
      const result = await apiService.searchIngredients({
        search: searchQuery,
        limit: 50
        // Pas de filtre isFood - on cherche dans tous les articles
      });
      availableArticles = result.data;
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      availableArticles = [];
    } finally {
      loadingArticles = false;
    }
  }

  // Sélectionner un article
  function selectArticle(article: any) {
    onArticleSelected(article);
    onClose();
  }

  // Gérer la création d'un nouvel article
  async function handleArticleCreated() {
    showAddArticleDrawer = false;

    // Rechercher l'article qui vient d'être créé
    if (searchQuery) {
      await loadArticles();
      // Si un seul résultat, le sélectionner automatiquement
      if (availableArticles.length === 1) {
        onArticleSelected(availableArticles[0]);
        onClose();
      }
    }
  }

  // Réinitialiser quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      searchQuery = '';
      availableArticles = [];
    }
  });
</script>

<Drawer
  {isOpen}
  title="Ajouter un article"
  {onClose}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <div class="select-article-drawer">
    <!-- Recherche -->
    <div class="form-field">
      <label class="form-label">Rechercher un article</label>
      <div class="search-actions">
        <Input
          id="article-search"
          bind:value={searchQuery}
          oninput={loadArticles}
          placeholder="Tapez pour rechercher..."
        />
        <Button
          variant="secondary"
          onclick={() => { showAddArticleDrawer = true; }}
        >
          + Créer un article
        </Button>
      </div>
    </div>

    <!-- Résultats de recherche -->
    {#if loadingArticles}
      <p class="loading-text">Chargement...</p>
    {:else if searchQuery && availableArticles.length === 0}
      <p class="no-results">Aucun article trouvé</p>
    {:else if searchQuery}
      <div class="articles-list">
        <h3 class="section-title">Résultats de recherche</h3>
        {#each availableArticles as article}
          <button
            class="article-item"
            onclick={() => selectArticle(article)}
          >
            {#if article.imageUrl}
              <img src={article.imageUrl} alt={article.label} class="article-image" />
            {:else}
              <div class="article-placeholder">{article.label[0]}</div>
            {/if}
            <div class="article-info">
              <span class="article-name">{article.label}</span>
              <span class="article-aisle">{article.aisle}</span>
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <p class="hint-text">Tapez au moins 2 caractères pour rechercher un article</p>
    {/if}
  </div>
</Drawer>

<!-- Drawer de création d'article -->
<IngredientDrawer
  isOpen={showAddArticleDrawer}
  showFoodTypeSelector={true}
  onClose={() => { showAddArticleDrawer = false; }}
  onSave={handleArticleCreated}
/>

<style lang="scss">
  .select-article-drawer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .radio-group {
    display: flex;
    gap: 1.5rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: var(--text-color);

    input[type="radio"] {
      cursor: pointer;
    }
  }

  .search-actions {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;

    :global(input) {
      flex: 1;
    }
  }

  .loading-text,
  .no-results,
  .hint-text {
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem;
    font-size: 0.95rem;
  }

  .hint-text {
    font-style: italic;
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .article-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;

    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
      transform: translateX(4px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .article-image {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
  }

  .article-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .article-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .article-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .article-aisle {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
</style>
