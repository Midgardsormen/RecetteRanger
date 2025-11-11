<script lang="ts">
  import { Drawer, Button } from '../../../components/ui';
  import { Input } from '../../../components/ui/form';
import IngredientDrawer from '../../../features/ingredient-drawer/IngredientDrawer.svelte';
  import { apiService } from '../../../services/api.service';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onArticleSelected: (article: any, quantity?: number | null, unit?: string | null) => void;
  }

  let { isOpen, onClose, onArticleSelected }: Props = $props();

  // État
  let searchQuery = $state('');
  let availableArticles = $state<any[]>([]);
  let loadingArticles = $state(false);
  let showAddArticleDrawer = $state(false);
  let selectedArticle = $state<any | null>(null);
  let quantity = $state('');
  let unit = $state('');

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

  // Sélectionner un article (affiche directement en dessous avec les champs)
  function selectArticle(article: any) {
    selectedArticle = article;
    quantity = '';
    unit = '';
    // Garder la recherche et les résultats affichés
  }

  // Confirmer l'ajout avec la quantité
  function confirmAddArticle() {
    if (!selectedArticle) return;

    const parsedQuantity = quantity.trim() ? parseFloat(quantity.trim()) : null;
    const parsedUnit = unit.trim() || null;

    onArticleSelected(selectedArticle, parsedQuantity, parsedUnit);
    resetForm();
    onClose();
  }

  // Annuler la sélection
  function cancelSelection() {
    selectedArticle = null;
    quantity = '';
    unit = '';
  }

  // Réinitialiser le formulaire
  function resetForm() {
    selectedArticle = null;
    searchQuery = '';
    availableArticles = [];
    quantity = '';
    unit = '';
  }

  // Gérer la création d'un nouvel article
  async function handleArticleCreated() {
    showAddArticleDrawer = false;

    // Rechercher l'article qui vient d'être créé
    if (searchQuery) {
      await loadArticles();
      // Si un seul résultat, le sélectionner automatiquement
      if (availableArticles.length === 1) {
        selectArticle(availableArticles[0]);
      }
    }
  }

  // Réinitialiser quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
    }
  });
</script>

<Drawer
  {isOpen}
  title="Ajouter un article"
  {onClose}
  primaryAction={selectedArticle ? {
    label: 'Ajouter à la liste',
    onClick: confirmAddArticle
  } : undefined}
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
          + Créer
        </Button>
      </div>
    </div>

    <!-- Résultats de recherche -->
    {#if loadingArticles}
      <p class="loading-text">Chargement...</p>
    {:else if searchQuery && availableArticles.length === 0}
      <p class="no-results">Aucun article trouvé</p>
    {:else if searchQuery && !selectedArticle}
      <div class="articles-list">
        <h3 class="section-title">Sélectionnez un article</h3>
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
    {:else if !searchQuery}
      <p class="hint-text">Tapez au moins 2 caractères pour rechercher un article</p>
    {/if}

    <!-- Article sélectionné avec formulaire de quantité -->
    {#if selectedArticle}
      <div class="quantity-form">
        <div class="selected-article-header">
          <h3 class="section-title">Article sélectionné</h3>
          <button class="change-article-btn" onclick={cancelSelection}>
            Changer
          </button>
        </div>

        <div class="selected-article-info">
          {#if selectedArticle.imageUrl}
            <img src={selectedArticle.imageUrl} alt={selectedArticle.label} class="selected-article-image" />
          {:else}
            <div class="selected-article-placeholder">{selectedArticle.label[0]}</div>
          {/if}
          <div class="selected-article-details">
            <h4 class="selected-article-name">{selectedArticle.label}</h4>
            <p class="selected-article-aisle">{selectedArticle.aisle}</p>
          </div>
        </div>

        <div class="quantity-fields">
          <div class="form-field">
            <Input
              id="quantity"
              label="Quantité (optionnel)"
              type="number"
              step="0.01"
              bind:value={quantity}
              placeholder="Ex: 2, 500, 1.5"
            />
          </div>

          <div class="form-field">
            <Input
              id="unit"
              label="Unité (optionnel)"
              bind:value={unit}
              placeholder="Ex: kg, g, l, unité(s)"
            />
          </div>
        </div>

        <p class="hint-text">Vous pouvez laisser vide et définir la quantité plus tard</p>
      </div>
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

  .quantity-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--border-color);
  }

  .selected-article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .change-article-btn {
    background: none;
    border: none;
    color: #667eea;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      text-decoration: underline;
    }
  }

  .selected-article-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .selected-article-image {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
  }

  .selected-article-placeholder {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    background: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .selected-article-details {
    flex: 1;
  }

  .selected-article-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .selected-article-aisle {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .quantity-fields {
    display: flex;
    gap: 1rem;

    .form-field {
      flex: 1;
    }
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
    background: #667eea;
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
