<script lang="ts">
  import { Drawer, Input, Select, Button, IconButton, FormField } from '../../../../components/ui';
  import { Checkbox, Textarea, RadioGroup } from '../../../../components/ui/form';
  import { RecipeDrawer } from '../../../recipe-drawer';
  import type { MealSlot, MealSlotConfig, MealPlanDay, MealPlanItem, MealTemplate } from '../../../../types/meal-plan.types';
  import type { Recipe } from '../../../../types/recipe.types';
  import { X, Save, Copy } from 'lucide-svelte';
  import { loadRecipes, loadIngredients, validateForm, submitMealPlanItem } from './actions';
  import { apiService } from '../../../../services/api.service';

  interface Props {
    isOpen?: boolean;
    selectedDate: Date;
    mealPlanDay?: MealPlanDay | null;
    slotConfigs: MealSlotConfig[];
    userId: string;
    editingItem?: any | null;
    onClose: () => void;
    onSave: () => void;
  }

  let {
    isOpen = false,
    selectedDate,
    mealPlanDay = null,
    slotConfigs,
    userId,
    editingItem = null,
    onClose,
    onSave
  }: Props = $props();

  // État du formulaire
  let selectedSlot = $state<MealSlot>('LUNCH' as MealSlot);
  let itemType = $state<'recipe' | 'ingredient'>('recipe'); // Type d'item (recette ou ingrédient)
  let selectedRecipe = $state<Recipe | null>(null);
  let selectedIngredient = $state<any | null>(null);
  let quantity = $state<number | null>(null);
  let unit = $state<string | null>(null);
  let servings = $state(1);
  let note = $state('');
  let isExceptional = $state(false);
  let customSlotName = $state('');

  // Recherche de recettes
  let recipeSearchQuery = $state('');
  let availableRecipes = $state<Recipe[]>([]);
  let loadingRecipes = $state(false);
  let showRecipeDrawer = $state(false);

  // Recherche d'ingrédients
  let ingredientSearchQuery = $state('');
  let availableIngredients = $state<any[]>([]);
  let loadingIngredients = $state(false);

  // État
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Templates
  let availableTemplates = $state<MealTemplate[]>([]);
  let selectedTemplateId = $state<string>('');
  let loadingTemplates = $state(false);
  let showSaveTemplateModal = $state(false);
  let templateName = $state('');
  let templateDescription = $state('');
  let savingTemplate = $state(false);

  // Réinitialiser le formulaire
  function resetForm() {
    if (editingItem) {
      // Mode édition : remplir avec les données existantes
      selectedSlot = editingItem.slot;
      selectedRecipe = editingItem.recipe || null;
      selectedIngredient = editingItem.ingredient || null;
      quantity = editingItem.quantity || null;
      unit = editingItem.unit || null;
      itemType = editingItem.ingredient ? 'ingredient' : 'recipe';
      servings = editingItem.servings;
      note = editingItem.note || '';
      isExceptional = editingItem.isExceptional;
      customSlotName = editingItem.customSlotName || '';
    } else {
      // Mode ajout : valeurs par défaut
      selectedSlot = 'LUNCH' as MealSlot;
      itemType = 'recipe';
      selectedRecipe = null;
      selectedIngredient = null;
      quantity = null;
      unit = null;
      servings = 1;
      note = '';
      isExceptional = false;
      customSlotName = '';
    }
    recipeSearchQuery = '';
    ingredientSearchQuery = '';
    errors = {};
  }

  // Charger les recettes
  async function handleLoadRecipes() {
    loadingRecipes = true;
    try {
      availableRecipes = await loadRecipes(recipeSearchQuery, userId);
    } finally {
      loadingRecipes = false;
    }
  }

  function selectRecipe(recipe: Recipe) {
    selectedRecipe = recipe;
    servings = recipe.servings; // Initialiser avec le nombre de portions de la recette
    recipeSearchQuery = '';
    availableRecipes = [];
  }

  function clearRecipe() {
    selectedRecipe = null;
    servings = 1;
  }

  // Charger les ingrédients
  async function handleLoadIngredients() {
    loadingIngredients = true;
    try {
      availableIngredients = await loadIngredients(ingredientSearchQuery);
    } finally {
      loadingIngredients = false;
    }
  }

  function selectIngredient(ingredient: any) {
    selectedIngredient = ingredient;
    quantity = 1;
    unit = ingredient.units && ingredient.units.length > 0 ? ingredient.units[0] : 'unité';
    ingredientSearchQuery = '';
    availableIngredients = [];
  }

  function clearIngredient() {
    selectedIngredient = null;
    quantity = null;
    unit = null;
  }

  async function handleSubmit() {
    const validation = validateForm(isExceptional, customSlotName, servings);
    errors = validation.errors;

    if (!validation.isValid) {
      return;
    }

    saving = true;

    try {
      await submitMealPlanItem(
        editingItem,
        mealPlanDay,
        userId,
        selectedDate,
        {
          selectedSlot,
          customSlotName,
          isExceptional,
          selectedRecipe: itemType === 'recipe' ? selectedRecipe : null,
          selectedIngredient: itemType === 'ingredient' ? selectedIngredient : null,
          quantity,
          unit,
          servings,
          note
        }
      );
      resetForm();
      onSave();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }

  function handleRecipeCreated() {
    showRecipeDrawer = false;
    handleLoadRecipes(); // Recharger la liste
  }

  // ===== Templates =====
  async function loadTemplates() {
    loadingTemplates = true;
    try {
      const response = await apiService.getMealTemplates(userId);
      availableTemplates = response;
    } catch (err: any) {
      console.error('Erreur lors du chargement des templates:', err);
      alert('Erreur lors du chargement des templates');
    } finally {
      loadingTemplates = false;
    }
  }

  async function applyTemplate(templateId: string) {
    if (!templateId) return;

    const template = availableTemplates.find(t => t.id === templateId);
    if (!template || template.items.length === 0) return;

    // Appliquer le premier item du template (pour un repas unique)
    // Note: Pour un vrai template multi-repas, il faudrait une logique différente
    const firstItem = template.items[0];

    selectedSlot = firstItem.slot as MealSlot;
    customSlotName = firstItem.customSlotName || '';
    isExceptional = firstItem.isExceptional;
    servings = firstItem.servings;
    note = firstItem.note || '';

    if (firstItem.recipeId && firstItem.recipe) {
      itemType = 'recipe';
      selectedRecipe = firstItem.recipe as Recipe;
      selectedIngredient = null;
      quantity = null;
      unit = null;
    } else if (firstItem.ingredientId && firstItem.ingredient) {
      itemType = 'ingredient';
      selectedIngredient = firstItem.ingredient;
      selectedRecipe = null;
      quantity = firstItem.quantity;
      unit = firstItem.unit;
    }
  }

  async function openSaveTemplateModal() {
    // Valider qu'il y a bien un repas configuré
    if (!selectedRecipe && !selectedIngredient) {
      alert('Veuillez d\'abord configurer un repas avant de le sauvegarder comme template');
      return;
    }

    showSaveTemplateModal = true;
    templateName = '';
    templateDescription = '';
  }

  async function saveAsTemplate() {
    if (!templateName.trim()) {
      alert('Veuillez saisir un nom pour le template');
      return;
    }

    savingTemplate = true;
    try {
      const templateData = {
        userId,
        name: templateName.trim(),
        description: templateDescription.trim() || null,
        isFavorite: false,
        items: [{
          slot: selectedSlot,
          customSlotName: isExceptional ? customSlotName : null,
          isExceptional,
          recipeId: itemType === 'recipe' ? selectedRecipe?.id : null,
          ingredientId: itemType === 'ingredient' ? selectedIngredient?.id : null,
          quantity: itemType === 'ingredient' ? quantity : null,
          unit: itemType === 'ingredient' ? unit : null,
          servings,
          note: note || null,
          order: 0
        }]
      };

      await apiService.createMealTemplate(templateData);
      alert('Template sauvegardé avec succès !');
      showSaveTemplateModal = false;
      templateName = '';
      templateDescription = '';

      // Recharger les templates
      await loadTemplates();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde du template:', err);
      alert('Erreur lors de la sauvegarde du template: ' + err.message);
    } finally {
      savingTemplate = false;
    }
  }

  // Effet pour réinitialiser le formulaire quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
      loadTemplates(); // Charger les templates disponibles
    }
  });

  // Obtenir les slots actifs triés
  let activeSlots = $derived(slotConfigs.filter(c => c.isEnabled).sort((a, b) => a.order - b.order));
</script>

<Drawer
  {isOpen}
  title={editingItem ? 'Éditer le repas' : 'Ajouter un repas'}
  onClose={onClose}
  primaryAction={{
    label: editingItem ? 'Modifier le repas' : 'Ajouter le repas',
    onClick: handleSubmit,
    disabled: saving,
    loading: saving
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <form class="meal-plan-drawer" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div class="meal-plan-drawer__date-section">
      <p class="meal-plan-drawer__date-display">{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>

    <!-- Sélecteur de template -->
    {#if !editingItem && availableTemplates.length > 0}
      <div class="meal-plan-drawer__template-section">
        <FormField
          name="template"
          label="Charger un template"
          variant="inverse"
          bind:value={selectedTemplateId}
        >
          <Select
            id="template"
            onchange={(e) => applyTemplate(e.currentTarget.value)}
          >
            <option value="">-- Choisir un template --</option>
            {#each availableTemplates as template}
              <option value={template.id}>
                {template.isFavorite ? '⭐ ' : ''}{template.name}
              </option>
            {/each}
          </Select>
        </FormField>
      </div>
    {/if}

    <Checkbox
      id="isExceptional"
      bind:checked={isExceptional}
      label="Repas exceptionnel (ex: anniversaire, goûter spécial)"
      variant="inverse"
    />

    {#if isExceptional}
      <FormField
        name="customSlotName"
        label="Nom du repas"
        variant="inverse"
        required
        bind:value={customSlotName}
        error={errors.customSlotName}
      >
        <Input
          id="customSlotName"
          placeholder="Ex: Goûter d'anniversaire"
        />
      </FormField>
    {:else}
      <FormField
        name="slot"
        label="Créneau"
        variant="inverse"
        required
        bind:value={selectedSlot}
      >
        <Select id="slot">
          {#each activeSlots as config}
            <option value={config.slot}>{config.label}</option>
          {/each}
        </Select>
      </FormField>
    {/if}

    <RadioGroup
      name="itemType"
      label="Type d'élément"
      bind:value={itemType}
      options={[
        { value: 'recipe', label: 'Recette' },
        { value: 'ingredient', label: 'Ingrédient simple' }
      ]}
      variant="inverse"
    />

    {#if itemType === 'recipe'}
    {#if selectedRecipe}
      <div class="meal-plan-drawer__selected-recipe">
        {#if selectedRecipe.imageUrl}
          <img src={selectedRecipe.imageUrl} alt={selectedRecipe.label} class="meal-plan-drawer__recipe-image" />
        {/if}
        <div class="meal-plan-drawer__recipe-info">
          <span class="meal-plan-drawer__recipe-name">{selectedRecipe.label}</span>
          <Button variant="ghost-inverse" size="small" onclick={clearRecipe}>
            <X size={16} />
            Changer
          </Button>
        </div>
      </div>
    {:else}
      <div class="meal-plan-drawer__search-section">
        <div class="meal-plan-drawer__search-header">
          <span class="meal-plan-drawer__search-label">Rechercher une recette</span>
          <Button
            variant="outlined-inverse"
            size="small"
            onclick={() => { showRecipeDrawer = true; }}
          >
            + Ajouter une recette
          </Button>
        </div>
        <Input
          id="recipe-search"
          bind:value={recipeSearchQuery}
          oninput={handleLoadRecipes}
          placeholder="Tapez pour rechercher..."
          variant="inverse"
        />
      </div>

      {#if loadingRecipes}
        <p class="meal-plan-drawer__loading-text">Chargement...</p>
      {:else if recipeSearchQuery.length >= 2 && availableRecipes.length === 0}
        <p class="meal-plan-drawer__no-results">Aucune recette trouvée</p>
      {:else if availableRecipes.length > 0}
        <div class="meal-plan-drawer__recipes-list">
          {#each availableRecipes as recipe}
            <button
              class="meal-plan-drawer__recipe-item"
              onclick={() => selectRecipe(recipe)}
            >
              {#if recipe.imageUrl}
                <img src={recipe.imageUrl} alt={recipe.label} class="meal-plan-drawer__recipe-thumb" />
              {/if}
              <span class="meal-plan-drawer__recipe-name">{recipe.label}</span>
            </button>
          {/each}
        </div>
      {/if}
    {/if}
    {/if}

    {#if itemType === 'ingredient'}
      {#if selectedIngredient}
        <div class="meal-plan-drawer__selected-recipe">
          {#if selectedIngredient.imageUrl}
            <img src={selectedIngredient.imageUrl} alt={selectedIngredient.label} class="meal-plan-drawer__recipe-image" />
          {/if}
          <div class="meal-plan-drawer__recipe-info">
            <span class="meal-plan-drawer__recipe-name">{selectedIngredient.label}</span>
            <Button variant="ghost-inverse" size="small" onclick={clearIngredient}>
              <X size={16} />
              Changer
            </Button>
          </div>
        </div>
      {:else}
        <div class="meal-plan-drawer__search-section">
          <span class="meal-plan-drawer__search-label">Rechercher un ingrédient</span>
          <Input
            id="ingredient-search"
            bind:value={ingredientSearchQuery}
            oninput={handleLoadIngredients}
            placeholder="Tapez pour rechercher..."
            variant="inverse"
          />
        </div>

        {#if loadingIngredients}
          <p class="meal-plan-drawer__loading-text">Chargement...</p>
        {:else if ingredientSearchQuery.length >= 2 && availableIngredients.length === 0}
          <p class="meal-plan-drawer__no-results">Aucun ingrédient trouvé</p>
        {:else if availableIngredients.length > 0}
          <div class="meal-plan-drawer__recipes-list">
            {#each availableIngredients as ingredient}
              <button
                class="meal-plan-drawer__recipe-item"
                onclick={() => selectIngredient(ingredient)}
              >
                {#if ingredient.imageUrl}
                  <img src={ingredient.imageUrl} alt={ingredient.label} class="meal-plan-drawer__recipe-thumb" />
                {/if}
                <span class="meal-plan-drawer__recipe-name">{ingredient.label}</span>
              </button>
            {/each}
          </div>
        {/if}
      {/if}

      {#if selectedIngredient}
        <FormField
          name="quantity"
          label="Quantité"
          variant="inverse"
          required
          bind:value={quantity}
        >
          <Input
            id="quantity"
            type="number"
            min="0"
            step="0.1"
            oninput={(e) => { quantity = parseFloat(e.currentTarget.value) || null; }}
          />
        </FormField>

        <FormField
          name="unit"
          label="Unité"
          variant="inverse"
          required
          bind:value={unit}
        >
          <Select id="unit">
            {#if selectedIngredient.units && selectedIngredient.units.length > 0}
              {#each selectedIngredient.units as u}
                <option value={u}>{u}</option>
              {/each}
            {:else}
              <option value="unité">unité</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
            {/if}
          </Select>
        </FormField>
      {/if}
    {/if}

    {#if itemType === 'recipe'}
    <FormField
      name="servings"
      label="Nombre de personnes"
      variant="inverse"
      required
      bind:value={servings}
      error={errors.servings}
    >
      <Input
        id="servings"
        type="number"
        min="1"
        oninput={(e) => { servings = parseInt(e.currentTarget.value) || 1; }}
      />
    </FormField>
    {/if}

    <FormField
      name="note"
      label="Note (optionnel)"
      variant="inverse"
      bind:value={note}
    >
      <Textarea
        id="note"
        placeholder="Ex: Prévoir du pain en accompagnement"
        rows={3}
      />
    </FormField>

    <!-- Bouton "Sauvegarder comme template" -->
    {#if !editingItem && (selectedRecipe || selectedIngredient)}
      <div class="meal-plan-drawer__save-template">
        <Button
          variant="outlined-inverse"
          size="medium"
          onclick={openSaveTemplateModal}
          type="button"
        >
          <Save size={16} />
          Sauvegarder comme template
        </Button>
      </div>
    {/if}
  </form>
</Drawer>

<!-- Modal pour sauvegarder un template -->
{#if showSaveTemplateModal}
  <div class="template-modal-overlay" onclick={() => { showSaveTemplateModal = false; }}>
    <div class="template-modal" onclick={(e) => e.stopPropagation()}>
      <div class="template-modal__header">
        <h3>Sauvegarder comme template</h3>
        <Button variant="ghost" size="small" onclick={() => { showSaveTemplateModal = false; }}>
          <X size={20} />
        </Button>
      </div>
      <div class="template-modal__body">
        <FormField
          name="templateName"
          label="Nom du template"
          required
          bind:value={templateName}
        >
          <Input
            id="templateName"
            placeholder="Ex: Mon petit-déj habituel"
            autofocus
          />
        </FormField>
        <FormField
          name="templateDescription"
          label="Description (optionnel)"
          bind:value={templateDescription}
        >
          <Textarea
            id="templateDescription"
            placeholder="Ex: Petit-déjeuner équilibré pour tous les jours"
            rows={3}
          />
        </FormField>
      </div>
      <div class="template-modal__footer">
        <Button variant="ghost" onclick={() => { showSaveTemplateModal = false; }}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onclick={saveAsTemplate}
          disabled={savingTemplate}
        >
          {savingTemplate ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  </div>
{/if}

<!-- Drawer de création de recette imbriqué -->
<RecipeDrawer
  isOpen={showRecipeDrawer}
  onClose={() => { showRecipeDrawer = false; }}
  onSave={handleRecipeCreated}
/>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  // Block: meal-plan-drawer
  .meal-plan-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    // Element: date-section
    &__date-section {
      margin-bottom: $spacing-sm;
    }

    // Element: date-display
    &__date-display {
      padding: $spacing-base;
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-30;
      border-radius: $radius-lg;
      color: $color-white;
      font-weight: $font-weight-semibold;
      margin: 0;
      text-align: center;
      text-transform: capitalize;
    }

    // Element: search-section
    &__search-section {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    // Element: search-header
    &__search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-sm;
    }

    // Element: search-label
    &__search-label {
      color: $color-white;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
    }

    // Element: selected-recipe
    &__selected-recipe {
      display: flex;
      gap: $spacing-base;
      padding: $spacing-base;
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-30;
      border-radius: $radius-lg;
      align-items: center;
    }

    // Element: recipe-image
    &__recipe-image {
      width: 80px;
      height: 80px;
      border-radius: $radius-md;
      object-fit: cover;
      flex-shrink: 0;
    }

    // Element: recipe-info
    &__recipe-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      min-width: 0;
    }

    // Element: recipe-name
    &__recipe-name {
      font-weight: $font-weight-semibold;
      color: $color-white;
      font-size: $font-size-base;
    }

    // Element: loading-text & no-results
    &__loading-text,
    &__no-results {
      text-align: center;
      color: $color-white-alpha-90;
      padding: $spacing-lg;
      font-style: italic;
      font-size: $font-size-sm;
    }

    // Element: recipes-list
    &__recipes-list {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      max-height: 300px;
      overflow-y: auto;
      padding: $spacing-xs;
      margin: -$spacing-xs;

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: $color-white-alpha-10;
        border-radius: $radius-sm;
      }

      &::-webkit-scrollbar-thumb {
        background: $color-white-alpha-30;
        border-radius: $radius-sm;

        &:hover {
          background: $color-white-alpha-30;
        }
      }
    }

    // Element: recipe-item
    &__recipe-item {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-base;
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-30;
      border-radius: $radius-md;
      cursor: pointer;
      transition: all $transition-base;
      text-align: left;
      width: 100%;

      &:hover {
        border-color: $color-white;
        background: $color-white-alpha-15;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    // Element: recipe-thumb
    &__recipe-thumb {
      width: 50px;
      height: 50px;
      border-radius: $radius-sm;
      object-fit: cover;
      flex-shrink: 0;
    }

    // Element: save-template
    &__save-template {
      padding-top: $spacing-base;
      border-top: 1px solid $color-white-alpha-30;
    }
  }

  // Template Modal
  .template-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: $spacing-lg;
  }

  .template-modal {
    background: $color-white;
    border-radius: $radius-lg;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-lg;
      border-bottom: 1px solid $color-gray-200;

      h3 {
        margin: 0;
        font-size: $font-size-xl;
        font-weight: $font-weight-semibold;
        color: $color-gray-900;
      }
    }

    &__body {
      padding: $spacing-lg;
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-base;
      padding: $spacing-lg;
      border-top: 1px solid $color-gray-200;
    }
  }
</style>
