<script lang="ts">
  /**
   * CreateEmptyShoppingListDrawer Component
   *
   * Drawer pour créer une liste de courses vide avec possibilité d'ajouter des articles
   * Utilise un système d'étapes comme RecipeDrawer
   */

  import { Drawer, Button, IconButton, Input, FormField, SectionTitle } from '../../../components/ui';
  import IngredientDrawer from '../../ingredient-drawer/IngredientDrawer.svelte';
  import { Trash2, Plus } from 'lucide-svelte';
  import { apiService } from '../../../services/api.service';
  import { StoreAisle, Unit } from '../../../types/enums';
  import type { Ingredient } from '../../../types/ingredient.types';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
  }

  let { isOpen, onClose, onCreate }: Props = $props();

  // État du formulaire
  let listName = $state(`Liste du ${new Date().toLocaleDateString('fr-FR')}`);
  let items = $state<Array<{
    id: string;
    ingredientId?: string;
    label: string;
    aisle?: StoreAisle;
    quantity?: number;
    unit?: string;
  }>>([]);

  let loading = $state(false);
  let error = $state('');

  // Gestion des étapes
  let currentStep = $state<'list' | 'selectArticle'>(('list'));

  // Recherche d'articles
  let searchQuery = $state('');
  let availableArticles = $state<Ingredient[]>([]);
  let loadingArticles = $state(false);
  let showAddArticleDrawer = $state(false);
  let selectedArticle = $state<Ingredient | null>(null);
  let quantity = $state('');
  let unit = $state('');

  // Réinitialiser le formulaire quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      listName = `Liste du ${new Date().toLocaleDateString('fr-FR')}`;
      items = [];
      error = '';
      currentStep = 'list';
      resetArticleSelection();
    }
  });

  // Navigation entre les étapes
  function goToSelectArticle() {
    currentStep = 'selectArticle';
    resetArticleSelection();
  }

  function goBackToList() {
    currentStep = 'list';
    resetArticleSelection();
  }

  // Recherche d'articles
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
      });
      availableArticles = result.data || result.items || [];
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      availableArticles = [];
    } finally {
      loadingArticles = false;
    }
  }

  // Sélectionner un article
  function selectArticle(article: Ingredient) {
    selectedArticle = article;
    quantity = '';
    unit = '';
  }

  // Annuler la sélection
  function cancelSelection() {
    resetArticleSelection();
  }

  // Réinitialiser la sélection
  function resetArticleSelection() {
    selectedArticle = null;
    searchQuery = '';
    availableArticles = [];
    quantity = '';
    unit = '';
  }

  // Confirmer l'ajout d'un article
  function confirmAddArticle() {
    if (!selectedArticle) return;

    items = [...items, {
      id: crypto.randomUUID(),
      ingredientId: selectedArticle.id,
      label: selectedArticle.label,
      aisle: selectedArticle.aisle as StoreAisle,
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit: unit || undefined,
    }];

    goBackToList();
  }

  // Gérer la création d'un nouvel article
  async function handleArticleCreated() {
    showAddArticleDrawer = false;
    if (searchQuery) {
      await loadArticles();
      if (availableArticles.length === 1) {
        selectArticle(availableArticles[0]);
      }
    }
  }

  // Supprimer un article
  function removeItem(itemId: string) {
    items = items.filter(item => item.id !== itemId);
  }

  // Valider et créer la liste
  async function handleSubmit() {
    if (!listName.trim()) {
      error = 'Veuillez saisir un nom pour la liste';
      return;
    }

    if (items.length === 0) {
      error = 'Veuillez ajouter au moins un article';
      return;
    }

    loading = true;
    error = '';

    try {
      const newList = await apiService.createShoppingList({
        name: listName.trim(),
        status: 'IN_PROGRESS',
        items: items.map(item => ({
          ingredientId: item.ingredientId,
          label: item.label,
          aisle: item.aisle,
          quantity: item.quantity,
          unit: item.unit,
          checked: false,
          isManual: !item.ingredientId,
        })),
      });

      onCreate();
      onClose();

      // Rediriger vers la liste créée
      window.location.href = `/shopping-lists/${newList.id}`;
    } catch (err: any) {
      error = err.message || 'Erreur lors de la création de la liste';
    } finally {
      loading = false;
    }
  }
</script>

<Drawer
  {isOpen}
  title={currentStep === 'list' ? 'Nouvelle liste de courses' : 'Ajouter un article'}
  showBackButton={currentStep === 'selectArticle'}
  onBack={goBackToList}
  {onClose}
  primaryAction={currentStep === 'list' ? {
    label: loading ? 'Création...' : 'Créer la liste',
    onClick: handleSubmit,
    disabled: loading || items.length === 0
  } : selectedArticle ? {
    label: 'Ajouter à la liste',
    onClick: confirmAddArticle
  } : undefined}
  secondaryAction={currentStep === 'list' ? {
    label: 'Annuler',
    onClick: onClose
  } : undefined}
>
  <div class="create-empty-drawer">
    {#if currentStep === 'list'}
      <!-- ÉTAPE 1: Nom de la liste et articles ajoutés -->
      {#if error}
        <div class="create-empty-drawer__error">
          {error}
        </div>
      {/if}

      <FormField label="Nom de la liste" required>
        <Input
          id="list-name"
          bind:value={listName}
          placeholder="Ex: Courses de la semaine"
        />
      </FormField>

      <Button
        variant="outlined-inverse"
        onclick={goToSelectArticle}
        fullWidth
      >
        <Plus size={18} />
        Ajouter un article
      </Button>

      {#if items.length > 0}
        <div class="create-empty-drawer__items">
          <h3 class="create-empty-drawer__items-title">
            Articles ({items.length})
          </h3>

          <div class="create-empty-drawer__items-list">
            {#each items as item (item.id)}
              <div class="create-empty-drawer__item">
                <div class="create-empty-drawer__item-info">
                  <span class="create-empty-drawer__item-label">{item.label}</span>
                </div>

                <div class="create-empty-drawer__item-quantity">
                  {#if item.quantity}
                    <span class="create-empty-drawer__item-qty-text">
                      {item.quantity}{item.unit ? ' ' + item.unit : ''}
                    </span>
                  {/if}
                </div>

                <IconButton
                  variant="ghost"
                  size="small"
                  onclick={() => removeItem(item.id)}
                  ariaLabel="Supprimer"
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="create-empty-drawer__empty">
          <p>Aucun article ajouté pour le moment</p>
          <p class="create-empty-drawer__empty-hint">
            Cliquez sur "Ajouter un article" pour commencer
          </p>
        </div>
      {/if}

    {:else if currentStep === 'selectArticle'}
      <!-- ÉTAPE 2: Sélection d'article -->
      <FormField label="Rechercher un article">
        <div class="search-actions">
          <Input
            id="article-search"
            bind:value={searchQuery}
            oninput={loadArticles}
            placeholder="Tapez pour rechercher..."
          />
          <Button
            variant="outlined-inverse"
            onclick={() => { showAddArticleDrawer = true; }}
          >
            + Créer
          </Button>
        </div>
      </FormField>

      {#if loadingArticles}
        <p class="loading-text">Chargement...</p>
      {:else if searchQuery && availableArticles.length === 0}
        <p class="no-results">Aucun article trouvé</p>
      {:else if searchQuery && !selectedArticle}
        <div class="articles-list">
          <SectionTitle level={3}>Sélectionnez un article</SectionTitle>
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

      {#if selectedArticle}
        <div class="quantity-form">
          <div class="selected-article-header">
            <SectionTitle level={3}>Article sélectionné</SectionTitle>
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
            <FormField label="Quantité (optionnel)">
              <Input
                id="quantity"
                type="number"
                step="0.01"
                bind:value={quantity}
                placeholder="Ex: 2, 500, 1.5"
              />
            </FormField>

            <FormField label="Unité (optionnel)">
              <Input
                id="unit"
                bind:value={unit}
                placeholder="Ex: kg, g, l, unité(s)"
              />
            </FormField>
          </div>

          <p class="hint-text">Vous pouvez laisser vide et définir la quantité plus tard</p>
        </div>
      {/if}
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
  @use '../../../styles/variables' as *;

  .create-empty-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;

    &__error {
      padding: $spacing-md;
      background: rgba($color-danger-light, 0.2);
      border: 1px solid $color-danger-light;
      border-radius: $radius-md;
      color: $color-danger-light;
      font-size: $font-size-sm;
    }
  }

  // Styles pour la recherche d'articles (étape 2)
  .search-actions {
    display: flex;
    gap: $spacing-sm;
    align-items: flex-start;

    :global(.input) {
      flex: 1;
    }
  }

  .loading-text,
  .no-results,
  .hint-text {
    text-align: center;
    color: $color-text-inverse;
    opacity: 0.7;
    padding: $spacing-xl;
    font-size: $font-size-base;
  }

  .hint-text {
    font-style: italic;
  }

  .articles-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .article-item {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-md;
    background: $color-white-alpha-10;
    border: 1px solid $color-white-alpha-20;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-base;
    text-align: left;

    &:hover {
      border-color: $color-white;
      background: $color-white-alpha-20;
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
    border-radius: $radius-lg;
    object-fit: cover;
  }

  .article-placeholder {
    width: 48px;
    height: 48px;
    border-radius: $radius-lg;
    background: $brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-white;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
  }

  .article-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .article-name {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-text-inverse;
  }

  .article-aisle {
    font-size: $font-size-sm;
    color: $color-text-inverse;
    opacity: 0.7;
  }

  .quantity-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-top: $spacing-xl;
    padding-top: $spacing-xl;
    border-top: 2px solid $color-white-alpha-20;
  }

  .selected-article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
  }

  .change-article-btn {
    background: none;
    border: none;
    color: $color-white;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    transition: all $transition-base;

    &:hover {
      background: $color-white-alpha-20;
      text-decoration: underline;
    }
  }

  .selected-article-info {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-lg;
    background: $color-white-alpha-10;
    border-radius: $radius-lg;
    border: 1px solid $color-white-alpha-20;
  }

  .selected-article-image {
    width: 56px;
    height: 56px;
    border-radius: $radius-lg;
    object-fit: cover;
  }

  .selected-article-placeholder {
    width: 56px;
    height: 56px;
    border-radius: $radius-lg;
    background: $brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-white;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
  }

  .selected-article-details {
    flex: 1;
  }

  .selected-article-name {
    margin: 0 0 $spacing-xs 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-inverse;
  }

  .selected-article-aisle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-inverse;
    opacity: 0.7;
  }

  .quantity-fields {
    display: flex;
    gap: $spacing-lg;

    :global(.form-field) {
      flex: 1;
    }
  }

  // Styles pour la liste des articles (étape 1)
  .create-empty-drawer {


    &__items {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    &__items-title {
      margin: 0;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-inverse;
    }

    &__items-list {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      max-height: 300px;
      overflow-y: auto;
      padding: $spacing-sm;
      background: $color-black-alpha-10;
      border-radius: $radius-md;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-20;
      border-radius: $radius-md;
    }

    &__item-info {
      flex: 1;
      min-width: 0;
    }

    &__item-label {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-inverse;
    }

    &__item-quantity {
      display: flex;
      gap: $spacing-xs;
      align-items: center;
    }

    &__item-qty-text {
      font-size: $font-size-sm;
      color: $color-text-inverse;
      opacity: 0.7;
      font-weight: $font-weight-medium;
    }

    &__empty {
      padding: $spacing-xl;
      text-align: center;
      background: $color-black-alpha-10;
      border-radius: $radius-md;

      p {
        margin: 0;
        color: $color-text-inverse;
        opacity: 0.7;
        font-size: $font-size-sm;
      }

      &-hint {
        margin-top: $spacing-sm;
        opacity: 0.5;
        font-size: $font-size-xs;
      }
    }
  }
</style>
