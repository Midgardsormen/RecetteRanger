<script lang="ts">
  import { Button, FormField, SearchBar, SectionTitle, SelectableCard, Input, Select } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import { UtensilsCrossed, Carrot } from 'lucide-svelte';
  import type { Recipe } from '../../types/recipe.types';
  import type { Article } from '../../types/article.types';

  interface Props {
    formData: {
      items: Array<{
        recipeId?: string;
        recipeLabel?: string;
        ingredientId?: string;
        ingredientLabel?: string;
        quantity?: number;
        unit?: string;
        servings?: number;
        availableUnits?: string[]; // Unités disponibles pour l'ingrédient
      }>;
    };
    errors: Record<string, string>;
  }

  let { formData, errors }: Props = $props();

  let searchMode = $state<'recipe' | 'ingredient'>('recipe');
  let searchQuery = $state('');
  let searchResults = $state<Recipe[] | Article[]>([]);
  let searching = $state(false);

  async function handleSearch() {
    if (!searchQuery.trim()) {
      searchResults = [];
      return;
    }

    searching = true;
    try {
      if (searchMode === 'recipe') {
        const result = await apiService.searchRecipes({
          search: searchQuery,
          limit: 10
        });
        searchResults = result.data || result.items || [];
      } else {
        const result = await apiService.searchIngredients({
          search: searchQuery,
          limit: 10,
          isFood: true
        });
        searchResults = result.items || result.data || [];
      }
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
    } finally {
      searching = false;
    }
  }

  function addRecipe(recipe: Recipe) {
    formData.items = [
      ...formData.items,
      {
        recipeId: recipe.id,
        recipeLabel: recipe.label,
        servings: 1
      }
    ];
    searchQuery = '';
    searchResults = [];
  }

  function addIngredient(ingredient: Article) {
    formData.items = [
      ...formData.items,
      {
        ingredientId: ingredient.id,
        ingredientLabel: ingredient.label,
        quantity: 1,
        unit: ingredient.units?.[0] || 'unité',
        availableUnits: ingredient.units && ingredient.units.length > 0 ? ingredient.units : ['unité']
      }
    ];
    searchQuery = '';
    searchResults = [];
  }

  function removeItem(index: number) {
    formData.items = formData.items.filter((_, i) => i !== index);
  }

  function updateItemQuantity(index: number, quantity: number) {
    formData.items[index].quantity = quantity;
  }

  function updateItemUnit(index: number, unit: string) {
    formData.items[index].unit = unit;
  }

  function updateItemServings(index: number, servings: number) {
    formData.items[index].servings = servings;
  }
</script>

<div class="menu-step2">
  {#if errors.items}
    <div class="menu-step2__error">{errors.items}</div>
  {/if}

  <div class="menu-step2__section">
    <SectionTitle>Ajouter des items</SectionTitle>

    <div class="menu-step2__search-mode">
      <Button
        variant={searchMode === 'recipe' ? 'secondary' : 'outlined-inverse'}
        size="medium"
        onclick={() => { searchMode = 'recipe'; searchQuery = ''; searchResults = []; }}
      >
        <UtensilsCrossed size={20} />
        Recettes
      </Button>
      <Button
        variant={searchMode === 'ingredient' ? 'secondary' : 'outlined-inverse'}
        size="medium"
        onclick={() => { searchMode = 'ingredient'; searchQuery = ''; searchResults = []; }}
      >
        <Carrot size={20} />
        Ingrédients
      </Button>
    </div>

    <SearchBar
      value={searchQuery}
      placeholder={searchMode === 'recipe' ? 'Rechercher une recette...' : 'Rechercher un ingrédient...'}
      oninput={(e) => { searchQuery = e.currentTarget.value; handleSearch(); }}
    />

    {#if searching}
      <div class="menu-step2__searching">Recherche...</div>
    {:else if searchResults.length > 0}
      <div class="menu-step2__results">
        {#each searchResults as result}
          <button
            class="menu-step2__result"
            onclick={() => searchMode === 'recipe' ? addRecipe(result as Recipe) : addIngredient(result as Article)}
          >
            {#if result.imageUrl}
              <img src={result.imageUrl} alt={result.label} class="menu-step2__result-image" />
            {/if}
            <span class="menu-step2__result-label">{result.label}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="menu-step2__section">
    <SectionTitle>Items sélectionnés ({formData.items.length})</SectionTitle>

    {#if formData.items.length === 0}
      <div class="menu-step2__empty">
        Aucun item ajouté pour le moment
      </div>
    {:else}
      <div class="menu-step2__items">
        {#each formData.items as item, index}
          <SelectableCard
            title={item.recipeLabel || item.ingredientLabel || ''}
            variant="inverse"
            removable={true}
            onRemove={() => removeItem(index)}
          >
            {#if item.recipeId}
              <Input
                id={`servings-${index}`}
                label="Portions"
                type="number"
                min="1"
                value={item.servings?.toString() || '1'}
                oninput={(e) => updateItemServings(index, Number(e.currentTarget.value))}
              />
            {:else}
              <div class="menu-step2__ingredient-inputs">
                <Input
                  id={`quantity-${index}`}
                  label="Quantité"
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.quantity?.toString() || ''}
                  oninput={(e) => updateItemQuantity(index, Number(e.currentTarget.value))}
                />
                <Select
                  id={`unit-${index}`}
                  label="Unité"
                  value={item.unit || ''}
                  onchange={(e) => updateItemUnit(index, e.currentTarget.value)}
                >
                  {#each (item.availableUnits || ['unité']) as unit}
                    <option value={unit}>{unit}</option>
                  {/each}
                </Select>
              </div>
            {/if}
          </SelectableCard>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .menu-step2 {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;

    &__error {
      padding: $spacing-base;
      background: $color-background-danger;
      border: 1px solid $color-danger;
      border-radius: $radius-md;
      color: $color-danger;
    }

    &__section {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    &__search-mode {
      display: flex;
      gap: $spacing-sm;

      :global(.button) {
        flex: 1;
        width: 100%;
        max-width: none;
      }
    }

    &__searching {
      text-align: center;
      padding: $spacing-base;
      color: $color-gray-600;
    }

    &__results {
      display: flex;
      flex-direction: column;
      gap: $spacing-2xs;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid $color-gray-200;
      border-radius: $radius-md;
      padding: $spacing-xs;
    }

    &__result {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm;
      background: $color-white;
      border: 1px solid transparent;
      border-radius: $radius-sm;
      cursor: pointer;
      transition: all $transition-base;
      text-align: left;

      &:hover {
        background: $color-gray-50;
        border-color: $brand-primary;
      }
    }

    &__result-image {
      width: 40px;
      height: 40px;
      border-radius: $radius-sm;
      object-fit: cover;
    }

    &__result-label {
      flex: 1;
      font-weight: $font-weight-medium;
    }

    &__empty {
      text-align: center;
      padding: $spacing-xl;
      color: $color-gray-500;
      font-style: italic;
    }

    &__items {
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
