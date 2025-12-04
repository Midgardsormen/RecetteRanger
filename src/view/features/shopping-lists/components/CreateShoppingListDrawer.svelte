<script lang="ts">
  /**
   * CreateShoppingListDrawer Component
   *
   * Drawer pour créer une nouvelle liste de courses
   * Utilise un système d'étapes:
   * 1. Choix: Liste vide ou depuis planning
   * 2. Si liste vide: Nom + articles
   * 3. Si ajouter article: Sélection d'article
   */

  import { Drawer, Button, IconButton, Input, FormField, SectionTitle } from '../../../components/ui';
  import IngredientDrawer from '../../ingredient-drawer/IngredientDrawer.svelte';
  import { ListPlus, Calendar, Trash2, Plus } from 'lucide-svelte';
  import { apiService } from '../../../services/api.service';
  import { StoreAisle } from '../../../types/enums';
  import type { Ingredient } from '../../../types/ingredient.types';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
    onOpenGenerateDrawer: () => void;
  }

  let { isOpen, onClose, onCreate, onOpenGenerateDrawer }: Props = $props();

  // Gestion des étapes
  type Step = 'choice' | 'emptyList' | 'selectArticle';
  let currentStep = $state<Step>('choice');

  // État du formulaire pour liste vide
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
      currentStep = 'choice';
      listName = `Liste du ${new Date().toLocaleDateString('fr-FR')}`;
      items = [];
      error = '';
      resetArticleSelection();
    }
  });

  // Navigation
  function handleCreateEmpty() {
    currentStep = 'emptyList';
  }

  function handleGenerateFromPlanning() {
    onClose();
    onOpenGenerateDrawer();
  }

  function goBackToChoice() {
    currentStep = 'choice';
    items = [];
    listName = `Liste du ${new Date().toLocaleDateString('fr-FR')}`;
  }

  function goToSelectArticle() {
    currentStep = 'selectArticle';
    resetArticleSelection();
  }

  function goBackToList() {
    currentStep = 'emptyList';
    resetArticleSelection();
  }

  // Recherche d'articles
  function handleSearchInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    searchQuery = target.value;
    console.log('handleSearchInput, searchQuery:', searchQuery);
    loadArticles();
  }

  async function loadArticles() {
    console.log('loadArticles appelé, searchQuery:', searchQuery);
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
      console.log('Résultat de la recherche:', result);
      availableArticles = result.data;
      console.log('availableArticles:', availableArticles);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      availableArticles = [];
    } finally {
      loadingArticles = false;
    }
  }

  function selectArticle(article: Ingredient) {
    selectedArticle = article;
    quantity = '';
    unit = '';
  }

  function cancelSelection() {
    resetArticleSelection();
  }

  function resetArticleSelection() {
    selectedArticle = null;
    searchQuery = '';
    availableArticles = [];
    quantity = '';
    unit = '';
  }

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

  async function handleArticleCreated() {
    showAddArticleDrawer = false;
    if (searchQuery) {
      await loadArticles();
      if (availableArticles.length === 1) {
        selectArticle(availableArticles[0]);
      }
    }
  }

  function removeItem(itemId: string) {
    items = items.filter(item => item.id !== itemId);
  }

  async function handleSubmit() {
    if (!listName.trim()) {
      error = 'Veuillez saisir un nom pour la liste';
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
  title={currentStep === 'choice' ? 'Nouvelle liste de courses' :
         currentStep === 'emptyList' ? 'Nouvelle liste de courses' :
         'Ajouter un article'}
  showBackButton={currentStep === 'emptyList' || currentStep === 'selectArticle'}
  onBack={currentStep === 'emptyList' ? goBackToChoice : goBackToList}
  {onClose}
  primaryAction={currentStep === 'emptyList' ? {
    label: loading ? 'Création...' : 'Créer la liste',
    onClick: handleSubmit,
    disabled: loading
  } : currentStep === 'selectArticle' && selectedArticle ? {
    label: 'Ajouter à la liste',
    onClick: confirmAddArticle
  } : undefined}
  secondaryAction={currentStep === 'emptyList' ? {
    label: 'Annuler',
    onClick: onClose
  } : undefined}
>
  <div class="create-shopping-list-drawer">
    {#if currentStep === 'choice'}
      <!-- ÉTAPE 1: Choix du type de liste -->
      <div class="create-shopping-list-drawer__options">
        <button
          class="create-shopping-list-drawer__option"
          onclick={handleCreateEmpty}
        >
          <div class="create-shopping-list-drawer__option-icon">
            <ListPlus size={32} />
          </div>
          <h3>Liste vide</h3>
          <p>Créer une liste vide et ajouter des articles manuellement</p>
        </button>

        <button
          class="create-shopping-list-drawer__option"
          onclick={handleGenerateFromPlanning}
        >
          <div class="create-shopping-list-drawer__option-icon">
            <Calendar size={32} />
          </div>
          <h3>Depuis le planning</h3>
          <p>Générer automatiquement une liste depuis votre planning de repas</p>
        </button>
      </div>

    {:else if currentStep === 'emptyList'}
      <!-- ÉTAPE 2: Nom de la liste et articles -->
      {#if error}
        <div class="create-shopping-list-drawer__error">
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

      <SectionTitle level={3}>
        <div class="create-shopping-list-drawer__section-header">
          <span class="create-shopping-list-drawer__section-title">Mes articles</span>
          <Button
            variant="outlined-inverse"
            size="medium"
            onclick={goToSelectArticle}
          >
            + Ajouter
          </Button>
        </div>
      </SectionTitle>

      {#if items.length > 0}
        <div class="create-shopping-list-drawer__items">
          <div class="create-shopping-list-drawer__items-list">
            {#each items as item (item.id)}
              <div class="create-shopping-list-drawer__item">
                <div class="create-shopping-list-drawer__item-info">
                  <span class="create-shopping-list-drawer__item-label">{item.label}</span>
                </div>

                <div class="create-shopping-list-drawer__item-quantity">
                  {#if item.quantity}
                    <span class="create-shopping-list-drawer__item-qty-text">
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
        <div class="create-shopping-list-drawer__empty">
          <p>Aucun article ajouté pour le moment</p>
          <p class="create-shopping-list-drawer__empty-hint">
            Cliquez sur "Ajouter un article" pour commencer
          </p>
        </div>
      {/if}

    {:else if currentStep === 'selectArticle'}
      <!-- ÉTAPE 3: Sélection d'article -->
      <SectionTitle level={3}>
        <div class="create-shopping-list-drawer__section-header">
          <span class="create-shopping-list-drawer__section-title">Articles disponibles</span>
          <Button
            variant="outlined-inverse"
            size="medium"
            onclick={() => { showAddArticleDrawer = true; }}
          >
            + Créer
          </Button>
        </div>
      </SectionTitle>

      <FormField label="Rechercher un article">
        <Input
          id="article-search"
          value={searchQuery}
          oninput={handleSearchInput}
          placeholder="Tapez pour rechercher..."
        />
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

  // Block: create-shopping-list-drawer
  .create-shopping-list-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    // Element: section-header
    &__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-sm;
      width: 100%;

      :global(.button) {
        width: auto;
      }
    }

    // Element: section-title
    &__section-title {
      flex: 1;
      min-width: 0;
    }

    // Element: error
    &__error {
      padding: $spacing-md;
      background: rgba($color-danger, 0.1);
      border: 1px solid $color-danger;
      border-radius: $radius-md;
      color: $color-danger;
      font-size: $font-size-sm;
    }

    // Element: options
    &__options {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    // Element: option
    &__option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-xl;
      background: $color-white;
      border: 2px solid $color-border-primary;
      border-radius: $radius-lg;
      cursor: pointer;
      transition: all $transition-base $transition-ease;
      text-align: center;

      &:hover:not(:disabled) {
        border-color: $brand-primary;
        background: rgba($brand-primary, 0.05);
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      h3 {
        margin: 0;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $color-text-primary;
      }

      p {
        margin: 0;
        font-size: $font-size-sm;
        color: $color-text-secondary;
        line-height: $line-height-relaxed;
      }
    }

    // Element: option-icon
    &__option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: rgba($brand-primary, 0.1);
      border-radius: $radius-full;
      color: $brand-primary;
    }

    // Element: empty
    &__empty {
      text-align: center;
      padding: $spacing-xl;
      color: $color-text-inverse;
      opacity: 0.7;

      p {
        margin: 0 0 $spacing-xs 0;
        font-size: $font-size-base;
      }

      &-hint {
        font-style: italic;
        font-size: $font-size-sm;
      }
    }

    // Element: items
    &__items {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;

      &-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
      }
    }

    // Element: item
    &__item {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md;
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-20;
      border-radius: $radius-lg;

      &-info {
        flex: 1;
      }

      &-label {
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        color: $color-text-inverse;
      }

      &-quantity {
        display: flex;
        align-items: center;
        margin-right: $spacing-sm;
      }

      &-qty-text {
        font-size: $font-size-sm;
        color: $color-text-inverse;
        opacity: 0.7;
      }
    }
  }

  // Helper text classes
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

  // Articles list (step 3)
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

  // Quantity form (step 3)
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
</style>
