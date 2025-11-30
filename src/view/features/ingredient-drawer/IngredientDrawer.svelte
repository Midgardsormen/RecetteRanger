<script lang="ts">
  import { Drawer, ImageUpload, Input, Select, Checkbox, RadioGroup, Tag, FormField } from '../../components/ui';
  import { Pencil, Plus, Search, AlertTriangle } from 'lucide-svelte';
  import type { Ingredient, CreateIngredientDto, SimilarIngredient } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, UnitLabels, MONTHS } from '../../types/ingredient.types';
  import { validateIngredientForm, type ValidationErrors } from './validation';
  import { checkDuplicates, saveIngredient } from './actions';

  interface Props {
    isOpen?: boolean;
    ingredient?: Ingredient | null;
    showFoodTypeSelector?: boolean; // Afficher le choix alimentaire/non-alimentaire
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, ingredient = null, showFoodTypeSelector = false, onSave, onClose }: Props = $props();

  // Clé unique pour forcer la recréation du formulaire à chaque ouverture
  let drawerOpenKey = $state('');

  // Formulaire
  let label = $state(ingredient?.label || '');
  let aisle = $state<StoreAisle>(ingredient?.aisle || StoreAisle.FRUITS_ET_LEGUMES);
  let selectedUnits = $state<Set<Unit>>(new Set(ingredient?.units || []));
  let imageUrl = $state(ingredient?.imageUrl || '');
  let selectedMonths = $state<Set<number>>(new Set(ingredient?.seasonMonths || []));
  let articleType = $state('food'); // 'food' ou 'non-food'

  // Détection de doublons
  let similarIngredients = $state<SimilarIngredient[]>([]);
  let checkingDuplicates = $state(false);
  let duplicateCheckTimeout: ReturnType<typeof setTimeout>;

  // Validation et état
  let saving = $state(false);
  let errors = $state<ValidationErrors>({});

  // Réinitialiser le formulaire quand l'ingrédient change ou quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      // Générer une nouvelle clé unique à chaque ouverture
      drawerOpenKey = `${Date.now()}-${ingredient?.id || 'new'}`;

      if (ingredient) {
        label = ingredient.label;
        aisle = ingredient.aisle;
        selectedUnits = new Set(ingredient.units);
        imageUrl = ingredient.imageUrl || '';
        selectedMonths = new Set(ingredient.seasonMonths || []);
      } else {
        label = '';
        aisle = StoreAisle.FRUITS_ET_LEGUMES;
        selectedUnits = new Set();
        imageUrl = '';
        selectedMonths = new Set();
      }
      errors = {};
      similarIngredients = [];
    }
  });

  // Changer le rayon par défaut quand articleType change
  $effect(() => {
    if (!isOpen || ingredient) return; // Ne s'applique que lors de la création

    if (articleType === 'food' && aisle === 'ENTRETIEN_MAISON') {
      aisle = StoreAisle.FRUITS_ET_LEGUMES;
    } else if (articleType === 'non-food' && aisle === 'FRUITS_ET_LEGUMES') {
      aisle = 'ENTRETIEN_MAISON' as StoreAisle;
    }
  });

  async function handleCheckDuplicates() {
    checkingDuplicates = true;
    try {
      similarIngredients = await checkDuplicates(label, ingredient?.id);
    } finally {
      checkingDuplicates = false;
    }
  }

  function handleLabelInput() {
    errors.label = '';
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(handleCheckDuplicates, 500);
  }

  function toggleUnit(unit: Unit, isChecked: boolean) {
    if (isChecked) {
      selectedUnits.add(unit);
    } else {
      selectedUnits.delete(unit);
    }
    selectedUnits = new Set(selectedUnits);
    errors.units = '';
  }

  function toggleMonth(month: number) {
    if (selectedMonths.has(month)) {
      selectedMonths.delete(month);
    } else {
      selectedMonths.add(month);
    }
    selectedMonths = new Set(selectedMonths);
  }

  async function handleSubmit() {
    const validation = validateIngredientForm(label, selectedUnits, imageUrl);

    if (!validation.isValid) {
      errors = validation.errors;
      return;
    }

    saving = true;

    try {
      const data: CreateIngredientDto = {
        label: label.trim(),
        aisle,
        units: Array.from(selectedUnits),
        imageUrl: imageUrl.trim() || undefined,
        seasonMonths: Array.from(selectedMonths),
        isFood: showFoodTypeSelector ? articleType === 'food' : true,
      };

      await saveIngredient(ingredient, data);
      onSave();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }

  // Computed property pour l'icône du titre
  const titleIcon = $derived(ingredient ? Pencil : Plus);
  const titleText = $derived(ingredient ? "Modifier l'ingrédient" : "Ajouter un ingrédient");
</script>

<Drawer
  {isOpen}
  title={titleText}
  {onClose}
  primaryAction={{
    label: ingredient ? 'Modifier' : 'Ajouter',
    onClick: handleSubmit,
    disabled: saving,
    loading: saving
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  {#key drawerOpenKey}
    <form class="ingredient-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <!-- Nom de l'ingrédient -->
      <FormField
      name="label"
      label={showFoodTypeSelector ? "Nom de l'article" : "Nom de l'ingrédient"}
      required
      error={errors.label}
      variant="inverse"
      bind:value={label}
    >
      <Input
        id="label"
        oninput={handleLabelInput}
        placeholder={articleType === 'food' ? "Ex: Tomate" : "Ex: Lessive"}
        required
      />
    </FormField>

    <!-- Type d'article (alimentaire/non-alimentaire) - optionnel -->
    {#if showFoodTypeSelector}
      <FormField name="articleType" label="Type d'article" variant="inverse">
        <RadioGroup
          name="articleType"
          bind:value={articleType}
          variant="inverse"
          options={[
            {
              value: 'food',
              label: 'Alimentaire',
              description: 'Produits alimentaires et ingrédients de cuisine'
            },
            {
              value: 'non-food',
              label: 'Non-alimentaire',
              description: 'Articles ménagers, hygiène, etc.'
            }
          ]}
        />
      </FormField>
    {/if}

    <!-- Détection de doublons -->
    {#if checkingDuplicates}
      <div class="duplicates-check">
        <Search size={16} />
        <span>Vérification des doublons...</span>
      </div>
    {:else if similarIngredients.length > 0}
      <div class="duplicates">
        <p class="duplicates__title">
          <AlertTriangle size={16} />
          Ingrédients similaires trouvés :
        </p>
        <ul class="duplicates__list">
          {#each similarIngredients as similar}
            <li class="duplicates__item">
              <span class="duplicates__name">{similar.label}</span>
              <span class="duplicates__aisle">{similar.aisle}</span>
              <span class="duplicates__similarity">{similar.similarity}%</span>
            </li>
          {/each}
        </ul>
        <p class="duplicates__warning">
          Êtes-vous sûr de vouloir ajouter cet ingrédient ?
        </p>
      </div>
    {/if}

    <!-- Catégorie -->
    <FormField name="aisle" label="Catégorie" required variant="inverse" bind:value={aisle}>
      <Select
        id="aisle"
        required
      >
        {#each Object.entries(StoreAisleLabels) as [key, label]}
          <option value={key}>{label}</option>
        {/each}
      </Select>
    </FormField>

    <!-- Unités -->
    <FormField
      name="units"
      label="Unités disponibles"
      required
      error={errors.units}
      variant="inverse"
    >
      <div class="checkbox-grid">
        {#each Object.entries(UnitLabels) as [key, unitLabel]}
          <Checkbox
            checked={selectedUnits.has(key as Unit)}
            label={unitLabel}
            variant="inverse"
            onChange={(isChecked) => toggleUnit(key as Unit, isChecked)}
          />
        {/each}
      </div>
    </FormField>

    <!-- Image de l'ingrédient -->
    <FormField
      name="imageUrl"
      label="Image de l'ingrédient (optionnel)"
      error={errors.imageUrl}
      variant="inverse"
    >
      <ImageUpload
        value={imageUrl}
        onUpload={(url) => {
          imageUrl = url;
          errors.imageUrl = '';
        }}
        aspectRatio={1}
        cropShape="rect"
        maxSizeMB={5}
        variant="inverse"
      />
    </FormField>

    <!-- Mois de saison (uniquement pour les articles alimentaires) -->
    {#if !showFoodTypeSelector || articleType === 'food'}
      <FormField
        name="seasonMonths"
        label="Mois de disponibilité (optionnel)"
        helper="Sélectionnez les mois où cet ingrédient est de saison"
        variant="inverse"
      >
        <div class="months-grid">
          {#each MONTHS as { value, label }}
            <Tag
              variant={selectedMonths.has(value) ? 'success-inverse' : 'neutral-inverse'}
              size="small"
              onclick={() => toggleMonth(value)}
            >
              {label}
            </Tag>
          {/each}
        </div>
      </FormField>
    {/if}
  </form>
  {/key}
</Drawer>

<style lang="scss">
  @use '../../styles/variables' as *;

  .ingredient-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: $spacing-sm;
  }

  .months-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: $spacing-sm;
  }

  .duplicates-check {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-base;
    background: $color-primary-alpha-10;
    border-radius: $radius-lg;
    color: $brand-primary;
    font-size: $font-size-sm;
  }

  .duplicates {
    padding: $spacing-base;
    background: $color-warning-alpha-10;
    border: $border-width-base solid $color-warning;
    border-radius: $radius-lg;

    &__title {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin: 0 0 $spacing-sm 0;
      color: $color-warning;
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
    }

    &__list {
      list-style: none;
      padding: 0;
      margin: 0 0 $spacing-base 0;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-sm;
      background: $color-white;
      border-radius: $radius-md;
      margin-bottom: $spacing-sm;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__name {
      flex: 1;
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
    }

    &__aisle {
      color: $color-text-secondary;
      font-size: $font-size-xs;
    }

    &__similarity {
      padding: $spacing-xs $spacing-sm;
      background: $color-warning;
      color: $color-white;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
    }

    &__warning {
      margin: 0;
      color: $color-warning;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
    }
  }
</style>
