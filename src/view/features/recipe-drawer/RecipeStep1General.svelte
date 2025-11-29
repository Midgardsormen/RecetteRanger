<script lang="ts">
  import { Input, Select, Button, Alert, ImageUpload } from '../../components/ui';
  import type { RecipeFormData } from '../../types/recipe.types';
  import { RecipeCategory, RecipeCategoryLabels, RecipeDifficulty, RecipeDifficultyLabels, RecipeVisibility, RecipeVisibilityLabels } from '../../types/recipe.types';

  interface Props {
    formData: RecipeFormData;
    errors: Record<string, string>;
    onUpdate: (updates: Partial<RecipeFormData>) => void;
  }

  let { formData, errors, onUpdate }: Props = $props();

  // Gestion du matériel
  let newMateriel = $state('');

  function addMateriel() {
    const trimmed = newMateriel.trim();
    if (trimmed && !formData.materiel.includes(trimmed)) {
      onUpdate({
        materiel: [...formData.materiel, trimmed]
      });
      newMateriel = '';
    }
  }

  function removeMateriel(index: number) {
    const updated = [...formData.materiel];
    updated.splice(index, 1);
    onUpdate({ materiel: updated });
  }

  // Gestion des appareils
  let newAppareil = $state('');

  function addAppareil() {
    const trimmed = newAppareil.trim();
    if (trimmed && !formData.appareils.includes(trimmed)) {
      onUpdate({
        appareils: [...formData.appareils, trimmed]
      });
      newAppareil = '';
    }
  }

  function removeAppareil(index: number) {
    const updated = [...formData.appareils];
    updated.splice(index, 1);
    onUpdate({ appareils: updated });
  }
</script>

<form class="recipe-step1">
  <Input
    id="label"
    label="Nom de la recette"
    value={formData.label}
    oninput={(e) => onUpdate({ label: e.currentTarget.value })}
    placeholder="Ex: Poulet rôti aux herbes"
    required
    error={errors.label}
  />

  <div class="recipe-step1__field">
    <label class="recipe-step1__label">Photo de la recette (optionnel)</label>
    <ImageUpload
      value={formData.imageUrl}
      onUpload={(url) => onUpdate({ imageUrl: url })}
      aspectRatio={16 / 9}
      cropShape="rect"
      maxSizeMB={5}
    />
  </div>

  <Select
    id="category"
    label="Catégorie"
    value={formData.category}
    onchange={(e) => onUpdate({ category: e.currentTarget.value as RecipeCategory })}
    required
  >
    {#each Object.entries(RecipeCategoryLabels) as [key, label]}
      <option value={key}>{label}</option>
    {/each}
  </Select>

  <Select
    id="difficulty"
    label="Difficulté"
    value={formData.difficulty}
    onchange={(e) => onUpdate({ difficulty: e.currentTarget.value as RecipeDifficulty })}
    required
  >
    {#each Object.entries(RecipeDifficultyLabels) as [key, label]}
      <option value={key}>{label}</option>
    {/each}
  </Select>

  <Select
    id="visibility"
    label="Visibilité de la recette"
    value={formData.visibility}
    onchange={(e) => onUpdate({ visibility: e.currentTarget.value as RecipeVisibility })}
    required
  >
    {#each Object.entries(RecipeVisibilityLabels) as [key, label]}
      <option value={key}>{label}</option>
    {/each}
  </Select>

  <div class="recipe-step1__row">
    <Input
      id="prepMinutes"
      label="Temps de préparation (min)"
      type="number"
      value={formData.prepMinutes}
      oninput={(e) => onUpdate({ prepMinutes: parseInt(e.currentTarget.value) || 0 })}
      min="0"
      placeholder="0"
    />

    <Input
      id="cookMinutes"
      label="Temps de cuisson (min)"
      type="number"
      value={formData.cookMinutes}
      oninput={(e) => onUpdate({ cookMinutes: parseInt(e.currentTarget.value) || 0 })}
      min="0"
      placeholder="0"
    />
  </div>

  <Input
    id="servings"
    label="Nombre de personnes"
    type="number"
    value={formData.servings}
    oninput={(e) => onUpdate({ servings: parseInt(e.currentTarget.value) || 1 })}
    min="1"
    placeholder="1"
    required
    error={errors.servings}
  />

  <Alert variant="info">
    Créez la recette pour 1 personne. Les quantités seront ajustées automatiquement lors de la consultation.
  </Alert>

  <Input
    id="sourceUrl"
    label="Lien source (optionnel)"
    type="url"
    value={formData.sourceUrl}
    oninput={(e) => onUpdate({ sourceUrl: e.currentTarget.value })}
    placeholder="https://exemple.com/recette"
  />

  <!-- Matériel -->
  <div class="recipe-step1__field">
    <label class="recipe-step1__label">Matériel (optionnel)</label>
    <div class="recipe-step1__input-group">
      <Input
        id="materiel-input"
        value={newMateriel}
        oninput={(e) => { newMateriel = e.currentTarget.value; }}
        placeholder="Ex: Fouet, saladier..."
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addMateriel();
          }
        }}
      />
      <Button
        variant="tertiary"
        onclick={addMateriel}
        disabled={!newMateriel.trim()}
      >
        + Ajouter
      </Button>
    </div>
    {#if formData.materiel.length > 0}
      <div class="recipe-step1__tags">
        {#each formData.materiel as item, index}
          <span class="recipe-step1__tag">
            {item}
            <button
              class="recipe-step1__tag-remove"
              onclick={() => removeMateriel(index)}
              type="button"
            >
              ✕
            </button>
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Appareils -->
  <div class="recipe-step1__field">
    <label class="recipe-step1__label">Appareils (optionnel)</label>
    <div class="recipe-step1__input-group">
      <Input
        id="appareils-input"
        value={newAppareil}
        oninput={(e) => { newAppareil = e.currentTarget.value; }}
        placeholder="Ex: Four, mixeur..."
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addAppareil();
          }
        }}
      />
      <Button
        variant="tertiary"
        onclick={addAppareil}
        disabled={!newAppareil.trim()}
      >
        + Ajouter
      </Button>
    </div>
    {#if formData.appareils.length > 0}
      <div class="recipe-step1__tags">
        {#each formData.appareils as item, index}
          <span class="recipe-step1__tag">
            {item}
            <button
              class="recipe-step1__tag-remove"
              onclick={() => removeAppareil(index)}
              type="button"
            >
              ✕
            </button>
          </span>
        {/each}
      </div>
    {/if}
  </div>
</form>

<style lang="scss">
  @use '../../styles/variables' as *;

  // Block: recipe-step1
  .recipe-step1 {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    // Element: field
    &__field {
      display: flex;
      flex-direction: column;
      gap: $spacing-xxs;
    }

    // Element: label
    &__label {
      color: $color-gray-800;
      font-weight: 600;
      font-size: 0.95rem;
    }

    // Element: row (for time inputs)
    &__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-sm;

      @media (max-width: $breakpoint-sm) {
        grid-template-columns: 1fr;
      }
    }

    // Element: input-group (for list inputs with add button)
    &__input-group {
      display: flex;
      gap: $spacing-xxs;
      align-items: flex-end;

      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
        align-items: stretch;
      }
    }

    // Element: tags container
    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xxs;
      margin-top: $spacing-xxs;
    }

    // Element: tag
    &__tag {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xxs;
      padding: $spacing-xxs $spacing-xs;
      background: rgba($brand-primary, 0.1);
      border: 1px solid rgba($brand-primary, 0.3);
      border-radius: 20px;
      font-size: 0.9rem;
      color: $color-gray-800;
      font-weight: 500;
    }

    // Element: tag-remove button
    &__tag-remove {
      background: none;
      border: none;
      color: $color-danger;
      cursor: pointer;
      padding: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
      font-size: 1rem;

      &:hover {
        background: $color-danger-alpha-20;
      }
    }
  }
</style>
