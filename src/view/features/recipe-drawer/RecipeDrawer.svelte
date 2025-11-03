<script lang="ts">
  import { Drawer, ImageUpload, Input, Select, Button } from '../../components/ui';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { apiService } from '../../services/api.service';
  import type {
    RecipeFormData,
    RecipeIngredientInput,
    StepInput,
    CreateRecipeDto
  } from '../../types/recipe.types';
  import { RecipeCategory, RecipeCategoryLabels } from '../../types/recipe.types';
  import type { Ingredient } from '../../types/ingredient.types';
  import { UnitLabels } from '../../types/ingredient.types';

  interface Props {
    isOpen?: boolean;
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, onSave, onClose }: Props = $props();

  // Gestion des étapes
  let currentStep = $state<1 | 2 | 3>(1);

  // État du formulaire
  let formData = $state<RecipeFormData>({
    label: '',
    category: RecipeCategory.PLAT,
    cookMinutes: 0,
    prepMinutes: 0,
    servings: 4,
    imageUrl: '',
    ingredients: [],
    steps: []
  });

  // États pour l'étape 2
  let ingredientSearchQuery = $state('');
  let availableIngredients = $state<Ingredient[]>([]);
  let loadingIngredients = $state(false);
  let showIngredientDrawer = $state(false);

  // Validation et état
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser quand le drawer s'ouvre/ferme
  $effect(() => {
    if (isOpen) {
      currentStep = 1;
      formData = {
        label: '',
        category: RecipeCategory.PLAT,
        cookMinutes: 0,
        prepMinutes: 0,
        servings: 4,
        imageUrl: '',
        ingredients: [],
        steps: []
      };
      errors = {};
    }
  });

  // Charger les ingrédients pour l'étape 2
  async function loadIngredients() {
    if (currentStep !== 2) return;

    loadingIngredients = true;
    try {
      const result = await apiService.searchIngredients({
        search: ingredientSearchQuery,
        limit: 50
      });
      availableIngredients = result.items || result.data || [];
    } catch (err) {
      console.error('Erreur lors du chargement des ingrédients:', err);
      availableIngredients = [];
    } finally {
      loadingIngredients = false;
    }
  }

  // Charger les ingrédients quand on arrive à l'étape 2
  $effect(() => {
    if (currentStep === 2) {
      loadIngredients();
    }
  });

  function goToStep(step: 1 | 2 | 3) {
    if (step < currentStep) {
      // On peut toujours revenir en arrière
      currentStep = step;
      errors = {};
    } else {
      // Validation avant d'avancer
      if (validateCurrentStep()) {
        currentStep = step;
        errors = {};
      }
    }
  }

  function validateCurrentStep(): boolean {
    errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (formData.label.trim().length < 3) {
        errors.label = 'Le nom doit contenir au moins 3 caractères';
        isValid = false;
      }
      if (formData.servings < 1) {
        errors.servings = 'Le nombre de personnes doit être au moins 1';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (formData.ingredients.length === 0) {
        errors.ingredients = 'Ajoutez au moins un ingrédient';
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (formData.steps.length === 0) {
        errors.steps = 'Ajoutez au moins une étape';
        isValid = false;
      }
      // Vérifier que toutes les étapes ont une description
      formData.steps.forEach((step, index) => {
        if (!step.description.trim()) {
          errors[`step-${index}`] = 'La description est requise';
          isValid = false;
        }
      });
    }

    return isValid;
  }

  // Gestion des ingrédients
  function addIngredient(ingredient: Ingredient) {
    // Vérifier si déjà ajouté
    if (formData.ingredients.some(i => i.ingredientId === ingredient.id)) {
      return;
    }

    formData.ingredients.push({
      ingredientId: ingredient.id,
      ingredientLabel: ingredient.label,
      quantity: '',
      unit: ingredient.units[0] || '',
      note: '',
      availableUnits: ingredient.units // Stocker les unités disponibles
    });
    formData.ingredients = [...formData.ingredients];

    // Réinitialiser le champ de recherche
    ingredientSearchQuery = '';
  }

  function removeIngredient(index: number) {
    formData.ingredients.splice(index, 1);
    formData.ingredients = [...formData.ingredients];
    errors.ingredients = '';
  }

  function handleIngredientCreated() {
    showIngredientDrawer = false;
    loadIngredients(); // Recharger la liste
  }

  // Gestion des étapes de préparation
  function addStep() {
    formData.steps.push({
      description: '',
      durationMinutes: ''
    });
    formData.steps = [...formData.steps];
  }

  function removeStep(index: number) {
    formData.steps.splice(index, 1);
    formData.steps = [...formData.steps];
    errors.steps = '';
  }

  function moveStepUp(index: number) {
    if (index === 0) return;
    const temp = formData.steps[index];
    formData.steps[index] = formData.steps[index - 1];
    formData.steps[index - 1] = temp;
    formData.steps = [...formData.steps];
  }

  function moveStepDown(index: number) {
    if (index === formData.steps.length - 1) return;
    const temp = formData.steps[index];
    formData.steps[index] = formData.steps[index + 1];
    formData.steps[index + 1] = temp;
    formData.steps = [...formData.steps];
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) {
      return;
    }

    saving = true;

    try {
      const data: CreateRecipeDto = {
        label: formData.label.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
        description: '',
        prepMinutes: formData.prepMinutes,
        cookMinutes: formData.cookMinutes,
        restMinutes: 0,
        servings: formData.servings,
        ingredients: formData.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
          unit: ing.unit || undefined,
          note: ing.note || undefined
        })),
        steps: formData.steps.map((step, index) => ({
          stepNumber: index + 1,
          description: step.description.trim(),
          durationMinutes: step.durationMinutes ? parseInt(step.durationMinutes) : undefined
        }))
      };

      await apiService.createRecipe(data);
      onSave();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }

  // Calculer le titre en fonction de l'étape
  function getTitle(): string {
    return currentStep === 1
      ? '➕ Nouvelle recette - Informations'
      : currentStep === 2
      ? '➕ Nouvelle recette - Ingrédients'
      : '➕ Nouvelle recette - Étapes';
  }

  // Actions du drawer en fonction de l'étape
  function getPrimaryAction() {
    return currentStep === 3
      ? {
          label: 'Créer la recette',
          onClick: handleSubmit,
          disabled: saving,
          loading: saving
        }
      : {
          label: 'Suivant',
          onClick: () => goToStep((currentStep + 1) as 2 | 3),
          disabled: false,
          loading: false
        };
  }

  function getSecondaryAction() {
    return currentStep === 1
      ? {
          label: 'Annuler',
          onClick: onClose
        }
      : undefined;
  }

  function getShowBackButton(): boolean {
    return currentStep > 1;
  }

  function handleBack() {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as 1 | 2);
    }
  }
</script>

<Drawer
  {isOpen}
  title={getTitle()}
  onClose={onClose}
  showBackButton={getShowBackButton()}
  onBack={handleBack}
  primaryAction={getPrimaryAction()}
  secondaryAction={getSecondaryAction()}
>
  {#if currentStep === 1}
    <!-- ÉTAPE 1 : Informations générales -->
    <form class="recipe-form" onsubmit={(e) => { e.preventDefault(); goToStep(2); }}>
      <Input
        id="label"
        label="Nom de la recette"
        bind:value={formData.label}
        placeholder="Ex: Poulet rôti aux herbes"
        required
        error={errors.label}
      />

      <Select
        id="category"
        label="Catégorie"
        bind:value={formData.category}
        required
      >
        {#each Object.entries(RecipeCategoryLabels) as [key, label]}
          <option value={key}>{label}</option>
        {/each}
      </Select>

      <div class="form-row">
        <Input
          id="prepMinutes"
          label="Temps de préparation (min)"
          type="number"
          bind:value={formData.prepMinutes}
          min="0"
          placeholder="0"
        />

        <Input
          id="cookMinutes"
          label="Temps de cuisson (min)"
          type="number"
          bind:value={formData.cookMinutes}
          min="0"
          placeholder="0"
        />
      </div>

      <Input
        id="servings"
        label="Nombre de personnes"
        type="number"
        bind:value={formData.servings}
        min="1"
        placeholder="4"
        required
        error={errors.servings}
      />

      <div class="form-field">
        <label class="form-label">Photo de la recette (optionnel)</label>
        <ImageUpload
          value={formData.imageUrl}
          onUpload={(url) => {
            formData.imageUrl = url;
          }}
          aspectRatio={16 / 9}
          cropShape="rect"
          maxSizeMB={5}
        />
      </div>
    </form>
  {:else if currentStep === 2}
    <!-- ÉTAPE 2 : Ingrédients -->
    <div class="ingredients-step">
      <div class="ingredients-search">
        <Input
          id="ingredient-search"
          label="Rechercher un ingrédient"
          bind:value={ingredientSearchQuery}
          oninput={loadIngredients}
          placeholder="Tapez pour rechercher..."
        />
        <Button
          variant="secondary"
          onclick={() => { showIngredientDrawer = true; }}
        >
          + Créer un ingrédient
        </Button>
      </div>

      {#if errors.ingredients}
        <p class="form-error">{errors.ingredients}</p>
      {/if}

      {#if loadingIngredients}
        <p class="loading-text">Chargement...</p>
      {:else if ingredientSearchQuery && availableIngredients.length === 0}
        <p class="no-results">Aucun ingrédient trouvé</p>
      {:else if ingredientSearchQuery}
        <div class="ingredients-list">
          <h3 class="section-title">Résultats de recherche</h3>
          {#each availableIngredients as ingredient}
            <button
              class="ingredient-item"
              onclick={() => addIngredient(ingredient)}
              disabled={formData.ingredients.some(i => i.ingredientId === ingredient.id)}
            >
              {#if ingredient.imageUrl}
                <img src={ingredient.imageUrl} alt={ingredient.label} class="ingredient-image" />
              {/if}
              <span class="ingredient-name">{ingredient.label}</span>
              {#if formData.ingredients.some(i => i.ingredientId === ingredient.id)}
                <span class="ingredient-added">✓ Ajouté</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      {#if formData.ingredients.length > 0}
        <div class="selected-ingredients">
          <h3 class="section-title">Ingrédients sélectionnés ({formData.ingredients.length})</h3>
          {#each formData.ingredients as ingredient, index}
            <div class="selected-ingredient">
              <div class="ingredient-header">
                <span class="ingredient-label">{ingredient.ingredientLabel}</span>
                <button
                  class="remove-btn"
                  onclick={() => removeIngredient(index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div class="ingredient-details">
                <Input
                  id={`quantity-${index}`}
                  label="Quantité"
                  type="number"
                  step="0.1"
                  bind:value={ingredient.quantity}
                  placeholder="Ex: 250"
                />
                <Select
                  id={`unit-${index}`}
                  label="Unité"
                  bind:value={ingredient.unit}
                  required
                >
                  {#if ingredient.availableUnits && ingredient.availableUnits.length > 0}
                    {#each ingredient.availableUnits as unit}
                      <option value={unit}>{UnitLabels[unit] || unit}</option>
                    {/each}
                  {:else}
                    <option value="">Aucune unité disponible</option>
                  {/if}
                </Select>
              </div>
              <Input
                id={`note-${index}`}
                label="Note (optionnel)"
                bind:value={ingredient.note}
                placeholder="Ex: coupé en dés"
              />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else if currentStep === 3}
    <!-- ÉTAPE 3 : Étapes de préparation -->
    <div class="steps-container">
      {#if errors.steps}
        <p class="form-error">{errors.steps}</p>
      {/if}

      {#if formData.steps.length === 0}
        <p class="no-steps">Aucune étape ajoutée</p>
      {/if}

      {#each formData.steps as step, index}
        <div class="step-item">
          <div class="step-header">
            <span class="step-number">Étape {index + 1}</span>
            <div class="step-actions">
              <button
                class="step-action-btn"
                onclick={() => moveStepUp(index)}
                disabled={index === 0}
                type="button"
                title="Monter"
              >
                ↑
              </button>
              <button
                class="step-action-btn"
                onclick={() => moveStepDown(index)}
                disabled={index === formData.steps.length - 1}
                type="button"
                title="Descendre"
              >
                ↓
              </button>
              <button
                class="step-action-btn remove"
                onclick={() => removeStep(index)}
                type="button"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          </div>

          <textarea
            class="step-description"
            class:error={errors[`step-${index}`]}
            bind:value={step.description}
            placeholder="Décrivez l'étape de préparation..."
            rows="3"
          ></textarea>

          {#if errors[`step-${index}`]}
            <span class="form-error">{errors[`step-${index}`]}</span>
          {/if}

          <Input
            id={`step-duration-${index}`}
            label="Durée (minutes, optionnel)"
            type="number"
            bind:value={step.durationMinutes}
            min="0"
            placeholder="Ex: 10"
          />
        </div>
      {/each}

      <Button
        variant="secondary"
        fullWidth
        onclick={addStep}
      >
        + Ajouter une étape
      </Button>
    </div>
  {/if}
</Drawer>

<!-- Drawer d'ajout d'ingrédient imbriqué -->
<IngredientDrawer
  isOpen={showIngredientDrawer}
  onClose={() => { showIngredientDrawer = false; }}
  onSave={handleIngredientCreated}
/>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $success-color: #48bb78;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .recipe-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 1.5;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
  }

  .form-label {
    color: $text-dark;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-base;
  }

  .form-error {
    color: $danger-color;
    font-size: 0.9rem;
    margin-top: $spacing-base * 0.5;
  }

  // Étape 2 : Ingrédients
  .ingredients-step {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 1.5;
  }

  .ingredients-search {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .section-title {
    margin: 0 0 $spacing-base 0;
    color: $text-dark;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .loading-text,
  .no-results {
    text-align: center;
    color: $text-gray;
    padding: $spacing-base * 2;
  }

  .ingredients-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
  }

  .ingredient-item {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;

    &:hover:not(:disabled) {
      border-color: $primary-color;
      background: rgba(102, 126, 234, 0.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .ingredient-image {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }

  .ingredient-name {
    flex: 1;
    font-weight: 500;
  }

  .ingredient-added {
    color: $success-color;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .selected-ingredients {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .selected-ingredient {
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.05);
    border: 2px solid $border-color;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .ingredient-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ingredient-label {
    font-weight: 600;
    color: $text-dark;
  }

  .remove-btn {
    background: none;
    border: none;
    color: $danger-color;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: rgba(245, 101, 101, 0.1);
    }
  }

  .ingredient-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-base;
  }

  // Étape 3 : Steps
  .steps-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 1.5;
  }

  .no-steps {
    text-align: center;
    color: $text-gray;
    padding: $spacing-base * 2;
  }

  .step-item {
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.05);
    border: 2px solid $border-color;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .step-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .step-number {
    font-weight: 600;
    color: $primary-color;
    font-size: 1.1rem;
  }

  .step-actions {
    display: flex;
    gap: $spacing-base * 0.5;
  }

  .step-action-btn {
    background: $white;
    border: 2px solid $border-color;
    color: $text-gray;
    font-size: 1rem;
    cursor: pointer;
    padding: $spacing-base * 0.25 $spacing-base * 0.5;
    border-radius: 6px;
    transition: all 0.2s;
    font-weight: 600;

    &:hover:not(:disabled) {
      border-color: $primary-color;
      color: $primary-color;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }

    &.remove {
      color: $danger-color;

      &:hover {
        border-color: $danger-color;
        background: rgba(245, 101, 101, 0.1);
      }
    }
  }

  .step-description {
    width: 100%;
    padding: $spacing-base * 0.75;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &.error {
      border-color: $danger-color;
    }
  }
</style>
