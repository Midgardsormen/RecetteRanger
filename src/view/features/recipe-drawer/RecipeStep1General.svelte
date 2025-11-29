<script lang="ts">
  import { Input, Select, Button, Alert, ImageUpload, FormField, TagInput } from '../../components/ui';
  import type { RecipeFormData } from '../../types/recipe.types';
  import { RecipeCategory, RecipeCategoryLabels, RecipeDifficulty, RecipeDifficultyLabels, RecipeVisibility, RecipeVisibilityLabels } from '../../types/recipe.types';

  interface Props {
    formData: RecipeFormData;
    errors: Record<string, string>;
    onUpdate: (updates: Partial<RecipeFormData>) => void;
  }

  let { formData, errors, onUpdate }: Props = $props();
</script>

<form class="recipe-step1">
  <FormField
    name="label"
    label="Nom de la recette"
    variant="inverse"
    required
    error={errors.label}
  >
    <Input
      id="label"
      type="text"
      value={formData.label}
      oninput={(e) => onUpdate({ label: e.currentTarget.value })}
      placeholder="Ex: Poulet rôti aux herbes"
    />
  </FormField>

  <FormField name="imageUrl" label="Photo de la recette (optionnel)" variant="inverse">
    <ImageUpload
      value={formData.imageUrl}
      onUpload={(url) => onUpdate({ imageUrl: url })}
      aspectRatio={16 / 9}
      cropShape="rect"
      maxSizeMB={5}
    />
  </FormField>

  <FormField name="category" label="Catégorie" variant="inverse" required>
    <Select
      id="category"
      value={formData.category}
      onchange={(e) => onUpdate({ category: e.currentTarget.value as RecipeCategory })}
    >
      {#each Object.entries(RecipeCategoryLabels) as [key, label]}
        <option value={key}>{label}</option>
      {/each}
    </Select>
  </FormField>

  <FormField name="difficulty" label="Difficulté" variant="inverse" required>
    <Select
      id="difficulty"
      value={formData.difficulty}
      onchange={(e) => onUpdate({ difficulty: e.currentTarget.value as RecipeDifficulty })}
    >
      {#each Object.entries(RecipeDifficultyLabels) as [key, label]}
        <option value={key}>{label}</option>
      {/each}
    </Select>
  </FormField>

  <FormField name="visibility" label="Visibilité de la recette" variant="inverse" required>
    <Select
      id="visibility"
      value={formData.visibility}
      onchange={(e) => onUpdate({ visibility: e.currentTarget.value as RecipeVisibility })}
    >
      {#each Object.entries(RecipeVisibilityLabels) as [key, label]}
        <option value={key}>{label}</option>
      {/each}
    </Select>
  </FormField>

  <div class="recipe-step1__row">
    <FormField name="prepMinutes" label="Temps de préparation (min)" variant="inverse">
      <Input
        id="prepMinutes"
        type="number"
        value={formData.prepMinutes}
        oninput={(e) => onUpdate({ prepMinutes: parseInt(e.currentTarget.value) || 0 })}
        min="0"
        placeholder="0"
      />
    </FormField>

    <FormField name="cookMinutes" label="Temps de cuisson (min)" variant="inverse">
      <Input
        id="cookMinutes"
        type="number"
        value={formData.cookMinutes}
        oninput={(e) => onUpdate({ cookMinutes: parseInt(e.currentTarget.value) || 0 })}
        min="0"
        placeholder="0"
      />
    </FormField>
  </div>

  <FormField name="servings" label="Nombre de personnes" variant="inverse" required error={errors.servings}>
    <Input
      id="servings"
      type="number"
      value={formData.servings}
      oninput={(e) => onUpdate({ servings: parseInt(e.currentTarget.value) || 1 })}
      min="1"
      placeholder="1"
    />
  </FormField>

  <Alert variant="info">
    Créez la recette pour 1 personne. Les quantités seront ajustées automatiquement lors de la consultation.
  </Alert>

  <FormField name="sourceUrl" label="Lien source (optionnel)" variant="inverse">
    <Input
      id="sourceUrl"
      type="url"
      value={formData.sourceUrl}
      oninput={(e) => onUpdate({ sourceUrl: e.currentTarget.value })}
      placeholder="https://exemple.com/recette"
    />
  </FormField>

  <!-- Matériel -->
  <FormField name="materiel" label="Matériel (optionnel)" variant="inverse">
    <TagInput
      id="materiel-input"
      items={formData.materiel}
      onUpdate={(items) => onUpdate({ materiel: items })}
      placeholder="Ex: Fouet, saladier..."
      variant="inverse"
    />
  </FormField>

  <!-- Appareils -->
  <FormField name="appareils" label="Appareils (optionnel)" variant="inverse">
    <TagInput
      id="appareils-input"
      items={formData.appareils}
      onUpdate={(items) => onUpdate({ appareils: items })}
      placeholder="Ex: Four, mixeur..."
      variant="inverse"
    />
  </FormField>
</form>

<style lang="scss">
  @use '../../styles/variables' as *;

  // Block: recipe-step1
  .recipe-step1 {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    // Element: row (for time inputs)
    &__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-sm;

      @media (max-width: $breakpoint-sm) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
