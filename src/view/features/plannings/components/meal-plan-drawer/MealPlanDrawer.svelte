<script lang="ts">
  import { Drawer, Input, Select, Button, IconButton, FormField } from '../../../../components/ui';
  import { Checkbox } from '../../../../components/ui/form';
  import { RecipeDrawer } from '../../../recipe-drawer';
  import type { MealSlot, MealSlotConfig, MealPlanDay, MealPlanItem } from '../../../../types/meal-plan.types';
  import type { Recipe } from '../../../../types/recipe.types';
  import { X } from 'lucide-svelte';
  import { loadRecipes, validateForm, submitMealPlanItem } from './actions';

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
          selectedRecipe,
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
  <form class="meal-plan-drawer" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div class="meal-plan-drawer__date-section">
      <p class="meal-plan-drawer__date-display">{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>

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
      <FormField
        name="recipe-search"
        label="Rechercher une recette"
        variant="inverse"
        bind:value={recipeSearchQuery}
      >
        <Input
          id="recipe-search"
          oninput={handleLoadRecipes}
          placeholder="Tapez pour rechercher..."
        />
      </FormField>

      <Button
        variant="outlined-inverse"
        onclick={() => { showRecipeDrawer = true; }}
      >
        + Créer une recette
      </Button>

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

    <FormField
      name="note"
      label="Note (optionnel)"
      variant="inverse"
      bind:value={note}
    >
      <Input
        id="note"
        placeholder="Ex: Prévoir du pain en accompagnement"
      />
    </FormField>
  </form>
</Drawer>

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
  }
</style>
