<script lang="ts">
  import { Drawer, Input, Select, Button } from '../../../../components/ui';
  import { RecipeDrawer } from '../../../recipe-drawer';
  import { apiService } from '../../../../services/api.service';
  import type { MealSlot, MealSlotConfig, MealPlanDay, MealPlanItem, CreateMealPlanItemDto } from '../../../../types/meal-plan.types';
  import type { Recipe } from '../../../../types/recipe.types';

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
  let selectedRecipe = $state<Recipe | null>(null);
  let servings = $state(1);
  let note = $state('');
  let isExceptional = $state(false);
  let customSlotName = $state('');

  // Recherche de recettes
  let recipeSearchQuery = $state('');
  let availableRecipes = $state<Recipe[]>([]);
  let loadingRecipes = $state(false);
  let showRecipeDrawer = $state(false);

  // État
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser le formulaire
  function resetForm() {
    if (editingItem) {
      // Mode édition : remplir avec les données existantes
      selectedSlot = editingItem.slot;
      selectedRecipe = editingItem.recipe || null;
      servings = editingItem.servings;
      note = editingItem.note || '';
      isExceptional = editingItem.isExceptional;
      customSlotName = editingItem.customSlotName || '';
    } else {
      // Mode ajout : valeurs par défaut
      selectedSlot = 'LUNCH' as MealSlot;
      selectedRecipe = null;
      servings = 1;
      note = '';
      isExceptional = false;
      customSlotName = '';
    }
    recipeSearchQuery = '';
    errors = {};
  }

  // Charger les recettes
  async function loadRecipes() {
    if (recipeSearchQuery.length < 2) {
      availableRecipes = [];
      return;
    }

    loadingRecipes = true;
    try {
      const result = await apiService.searchRecipes({
        search: recipeSearchQuery,
        limit: 20,
        userId: userId
      });
      availableRecipes = result.items || result.data || [];
    } catch (err) {
      console.error('Erreur lors du chargement des recettes:', err);
      availableRecipes = [];
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

  function validate(): boolean {
    errors = {};
    let isValid = true;

    if (isExceptional && !customSlotName.trim()) {
      errors.customSlotName = 'Veuillez donner un nom au repas exceptionnel';
      isValid = false;
    }

    if (servings < 1) {
      errors.servings = 'Le nombre de personnes doit être au moins 1';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    saving = true;

    try {
      if (editingItem) {
        // Mode édition : mettre à jour l'item existant
        const updateData = {
          slot: selectedSlot,
          customSlotName: isExceptional ? customSlotName : undefined,
          isExceptional,
          recipeId: selectedRecipe?.id,
          servings,
          note: note || undefined
        };

        await apiService.updateMealPlanItem(editingItem.id, updateData);
        resetForm();
        onSave();
      } else {
        // Mode ajout : créer un nouvel item
        // S'assurer qu'on a un mealPlanDay
        let dayId = mealPlanDay?.id;

        if (!dayId) {
          // Créer le jour s'il n'existe pas
          const createdDay = await apiService.createMealPlanDay({
            userId,
            date: selectedDate.toISOString(),
            items: []
          });
          dayId = createdDay.id;
        }

        // Créer l'item
        const itemData: CreateMealPlanItemDto = {
          slot: selectedSlot,
          customSlotName: isExceptional ? customSlotName : undefined,
          isExceptional,
          recipeId: selectedRecipe?.id,
          servings,
          note: note || undefined,
          order: mealPlanDay?.items.filter(i => i.slot === selectedSlot).length || 0
        };

        await apiService.createMealPlanItem(dayId, itemData);
        resetForm();
        onSave();
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }

  function handleRecipeCreated() {
    showRecipeDrawer = false;
    loadRecipes(); // Recharger la liste
  }

  // Effet pour réinitialiser le formulaire quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
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
  <form class="meal-plan-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div class="form-section">
      <h3>Date</h3>
      <p class="date-display">{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>

    <div class="form-section">
      <h3>Type de repas</h3>

      <div class="checkbox-field">
        <input
          type="checkbox"
          id="isExceptional"
          bind:checked={isExceptional}
        />
        <label for="isExceptional">Repas exceptionnel (ex: anniversaire, goûter spécial)</label>
      </div>

      {#if isExceptional}
        <Input
          id="customSlotName"
          label="Nom du repas"
          bind:value={customSlotName}
          placeholder="Ex: Goûter d'anniversaire"
          required
          error={errors.customSlotName}
        />
      {:else}
        <Select
          id="slot"
          label="Créneau"
          bind:value={selectedSlot}
          required
        >
          {#each activeSlots as config}
            <option value={config.slot}>{config.label}</option>
          {/each}
        </Select>
      {/if}
    </div>

    <div class="form-section">
      <h3>Recette</h3>

      {#if selectedRecipe}
        <div class="selected-recipe">
          {#if selectedRecipe.imageUrl}
            <img src={selectedRecipe.imageUrl} alt={selectedRecipe.label} class="recipe-image" />
          {/if}
          <div class="recipe-info">
            <span class="recipe-name">{selectedRecipe.label}</span>
            <button class="clear-btn" onclick={clearRecipe} type="button">✕ Changer</button>
          </div>
        </div>
      {:else}
        <div class="recipe-search">
          <Input
            id="recipe-search"
            label="Rechercher une recette"
            bind:value={recipeSearchQuery}
            oninput={loadRecipes}
            placeholder="Tapez pour rechercher..."
          />
          <Button
            variant="secondary"
            onclick={() => { showRecipeDrawer = true; }}
          >
            + Créer une recette
          </Button>
        </div>

        {#if loadingRecipes}
          <p class="loading-text">Chargement...</p>
        {:else if recipeSearchQuery.length >= 2 && availableRecipes.length === 0}
          <p class="no-results">Aucune recette trouvée</p>
        {:else if availableRecipes.length > 0}
          <div class="recipes-list">
            {#each availableRecipes as recipe}
              <button
                class="recipe-item"
                onclick={() => selectRecipe(recipe)}
              >
                {#if recipe.imageUrl}
                  <img src={recipe.imageUrl} alt={recipe.label} class="recipe-thumb" />
                {/if}
                <span class="recipe-name">{recipe.label}</span>
              </button>
            {/each}
          </div>
        {/if}
      {/if}
    </div>

    <Input
      id="servings"
      label="Nombre de personnes"
      type="number"
      bind:value={servings}
      min="1"
      required
      error={errors.servings}
    />

    <Input
      id="note"
      label="Note (optionnel)"
      bind:value={note}
      placeholder="Ex: Prévoir du pain en accompagnement"
    />
  </form>
</Drawer>

<!-- Drawer de création de recette imbriqué -->
<RecipeDrawer
  isOpen={showRecipeDrawer}
  onClose={() => { showRecipeDrawer = false; }}
  onSave={handleRecipeCreated}
/>

<style lang="scss">
  $primary-color: #667eea;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .meal-plan-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: $text-dark;
    }
  }

  .date-display {
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    color: $primary-color;
    font-weight: 600;
    margin: 0;
    text-transform: capitalize;
  }

  .checkbox-field {
    display: flex;
    align-items: center;
    gap: $spacing-base * 0.5;
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: $primary-color;
    }

    label {
      font-size: 0.95rem;
      color: $text-dark;
      cursor: pointer;
      user-select: none;
    }
  }

  .recipe-search {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
  }

  .selected-recipe {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    align-items: center;

    .recipe-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }

    .recipe-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 0.5;
    }

    .recipe-name {
      font-weight: 600;
      color: $text-dark;
      font-size: 1.1rem;
    }

    .clear-btn {
      background: none;
      border: none;
      color: $danger-color;
      cursor: pointer;
      padding: $spacing-base * 0.5;
      font-size: 0.9rem;
      font-weight: 500;
      align-self: flex-start;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: rgba(245, 101, 101, 0.1);
      }
    }
  }

  .loading-text,
  .no-results {
    text-align: center;
    color: $text-gray;
    padding: $spacing-base * 2;
    font-style: italic;
  }

  .recipes-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
    max-height: 300px;
    overflow-y: auto;
  }

  .recipe-item {
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

    &:hover {
      border-color: $primary-color;
      background: rgba(102, 126, 234, 0.05);
    }

    .recipe-thumb {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
    }

    .recipe-name {
      flex: 1;
      font-weight: 500;
      color: $text-dark;
    }
  }
</style>
