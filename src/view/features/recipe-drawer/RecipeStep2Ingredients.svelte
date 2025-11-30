<script lang="ts">
  import { Input, Select, Button, SectionTitle, SelectableCard, Checkbox, FormField } from '../../components/ui';
  import { IngredientDrawer } from '../ingredient-drawer';
  import { apiService } from '../../services/api.service';
  import type { RecipeFormData, RecipeIngredientInput } from '../../types/recipe.types';
  import type { Ingredient } from '../../types/ingredient.types';
  import { UnitLabels } from '../../types/ingredient.types';
  import { addToList, removeFromList, updateInList } from '../../utils/listManagement';

  interface Props {
    formData: RecipeFormData;
    errors: Record<string, string>;
    onUpdate: (updates: Partial<RecipeFormData>) => void;
  }

  let { formData, errors, onUpdate }: Props = $props();

  // États pour l'étape 2
  let ingredientSearchQuery = $state('');
  let availableIngredients = $state<Ingredient[]>([]);
  let loadingIngredients = $state(false);
  let showIngredientDrawer = $state(false);
  let ingredientSearchTimeout: ReturnType<typeof setTimeout>;

  // Charger les ingrédients
  async function loadIngredients() {
    loadingIngredients = true;
    try {
      const result = await apiService.searchIngredients({
        search: ingredientSearchQuery,
        limit: 50,
        isFood: true // Filtrer uniquement les articles alimentaires
      });
      availableIngredients = result.items || result.data || [];
    } catch (err) {
      console.error('Erreur lors du chargement des ingrédients:', err);
      availableIngredients = [];
    } finally {
      loadingIngredients = false;
    }
  }

  // Charger les ingrédients au montage
  $effect(() => {
    loadIngredients();
  });

  // Gestion des ingrédients
  function addIngredient(ingredient: Ingredient) {
    // Vérifier si déjà ajouté
    if (formData.ingredients.some(i => i.ingredientId === ingredient.id)) {
      return;
    }

    const newIngredient: RecipeIngredientInput = {
      ingredientId: ingredient.id,
      ingredientLabel: ingredient.label,
      quantity: '',
      unit: ingredient.units[0] || '',
      note: '',
      scalable: true,
      availableUnits: ingredient.units
    };

    addToList(newIngredient, formData.ingredients, (updated) => {
      onUpdate({ ingredients: updated });
    });

    // Réinitialiser le champ de recherche
    ingredientSearchQuery = '';
  }

  function removeIngredient(index: number) {
    removeFromList(index, formData.ingredients, (updated) => {
      onUpdate({ ingredients: updated });
    });
  }

  function updateIngredient(index: number, updates: Partial<RecipeIngredientInput>) {
    updateInList(index, updates, formData.ingredients, (updated) => {
      onUpdate({ ingredients: updated });
    });
  }

  function handleIngredientCreated() {
    showIngredientDrawer = false;
    loadIngredients(); // Recharger la liste
  }
</script>

<div class="recipe-step2">
  <div class="recipe-step2__search">
    <Input
      id="ingredient-search"
      label="Rechercher un ingrédient"
      type="text"
      variant="inverse"
      bind:value={ingredientSearchQuery}
      oninput={() => {
        loadIngredients();
      }}
      placeholder="Tapez pour rechercher..."
    />
    <Button
      variant="outlined-inverse"
      onclick={() => { showIngredientDrawer = true; }}
    >
      + Créer un ingrédient
    </Button>
  </div>

  {#if errors.ingredients}
    <p class="recipe-step2__error">{errors.ingredients}</p>
  {/if}

  {#if loadingIngredients}
    <p class="recipe-step2__message">Chargement...</p>
  {:else if ingredientSearchQuery && availableIngredients.length === 0}
    <p class="recipe-step2__message">Aucun ingrédient trouvé</p>
  {:else if ingredientSearchQuery}
    <div class="recipe-step2__results">
      <SectionTitle level={3}>Résultats de recherche</SectionTitle>
      {#each availableIngredients as ingredient}
        <button
          class="recipe-step2__result-item"
          class:recipe-step2__result-item--disabled={formData.ingredients.some(i => i.ingredientId === ingredient.id)}
          onclick={() => addIngredient(ingredient)}
          disabled={formData.ingredients.some(i => i.ingredientId === ingredient.id)}
        >
          {#if ingredient.imageUrl}
            <img src={ingredient.imageUrl} alt={ingredient.label} class="recipe-step2__result-image" />
          {/if}
          <span class="recipe-step2__result-name">{ingredient.label}</span>
          {#if formData.ingredients.some(i => i.ingredientId === ingredient.id)}
            <span class="recipe-step2__result-badge">✓ Ajouté</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if formData.ingredients.length > 0}
    <div class="recipe-step2__selected">
      <SectionTitle level={3}>Ingrédients sélectionnés ({formData.ingredients.length})</SectionTitle>
      {#each formData.ingredients as ingredient, index (ingredient.ingredientId)}
        <SelectableCard
          title={ingredient.ingredientLabel}
          variant="inverse"
          removable={true}
          onRemove={() => removeIngredient(index)}
        >
          <div class="recipe-step2__ingredient-inputs">
            <Input
              id={`quantity-${index}`}
              label="Quantité"
              type="number"
              step="0.1"
              value={ingredient.quantity}
              oninput={(e) => updateIngredient(index, { quantity: e.currentTarget.value })}
              placeholder="Ex: 250"
            />
            <Select
              id={`unit-${index}`}
              label="Unité"
              value={ingredient.unit}
              onchange={(e) => updateIngredient(index, { unit: e.currentTarget.value })}
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
            value={ingredient.note}
            oninput={(e) => updateIngredient(index, { note: e.currentTarget.value })}
            placeholder="Ex: coupé en dés"
          />
          <Checkbox
            id={`scalable-${index}`}
            checked={ingredient.scalable}
            onchange={(e) => updateIngredient(index, { scalable: e.currentTarget.checked })}
            label="Quantité ajustable selon le nombre de personnes"
            variant="inverse"
            size="md"
          />
        </SelectableCard>
      {/each}
    </div>
  {/if}
</div>

<!-- Drawer d'ajout d'ingrédient imbriqué -->
<IngredientDrawer
  isOpen={showIngredientDrawer}
  onClose={() => { showIngredientDrawer = false; }}
  onSave={handleIngredientCreated}
/>

<style lang="scss">
  @use '../../styles/variables' as *;

  // Block: recipe-step2
  .recipe-step2 {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    // Element: search
    &__search {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    // Element: error message
    &__error {
      color: $color-danger;
      font-size: 0.9rem;
      margin-top: $spacing-2xs;
    }

    // Element: generic message (loading, no results)
    &__message {
      text-align: center;
      color: $color-gray-600;
      padding: $spacing-lg;
    }

    // Element: results list
    &__results {
      display: flex;
      flex-direction: column;
      gap: $spacing-2xs;
    }

    // Element: result-item (individual search result)
    &__result-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm;
      background: $color-white;
      border: 2px solid $color-gray-200;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;

      &:hover:not(:disabled) {
        border-color: $brand-primary;
        background: rgba($brand-primary, 0.05);
      }

      // Modifier: disabled
      &--disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    // Element: result-image
    &__result-image {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }

    // Element: result-name
    &__result-name {
      flex: 1;
      font-weight: 500;
    }

    // Element: result-badge (added indicator)
    &__result-badge {
      color: $color-success;
      font-weight: 600;
      font-size: 0.9rem;
    }

    // Element: selected ingredients container
    &__selected {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    // Element: ingredient-inputs (quantity and unit)
    &__ingredient-inputs {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: $spacing-sm;

      :global(input[type="number"]) {
        max-width: 100px;
      }
    }
  }
</style>
