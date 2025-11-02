<script lang="ts">
  import { Drawer } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Ingredient, CreateIngredientDto, SimilarIngredient } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, UnitLabels, MONTHS } from '../../types/ingredient.types';

  interface Props {
    isOpen?: boolean;
    ingredient?: Ingredient | null;
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, ingredient = null, onSave, onClose }: Props = $props();

  // Formulaire
  let label = $state(ingredient?.label || '');
  let aisle = $state<StoreAisle>(ingredient?.aisle || StoreAisle.FRUITS_ET_LEGUMES);
  let selectedUnits = $state<Set<Unit>>(new Set(ingredient?.units || []));
  let imageUrl = $state(ingredient?.imageUrl || '');
  let selectedMonths = $state<Set<number>>(new Set(ingredient?.seasonMonths || []));

  // Détection de doublons
  let similarIngredients = $state<SimilarIngredient[]>([]);
  let checkingDuplicates = $state(false);
  let duplicateCheckTimeout: ReturnType<typeof setTimeout>;

  // Validation et état
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser le formulaire quand l'ingrédient change
  $effect(() => {
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
  });

  async function checkDuplicates() {
    if (label.length < 2) {
      similarIngredients = [];
      return;
    }

    checkingDuplicates = true;
    try {
      const result = await apiService.checkDuplicates(label);
      // Si on est en mode édition, exclure l'ingrédient en cours d'édition
      similarIngredients = result.similarIngredients.filter(
        (sim: SimilarIngredient) => sim.id !== ingredient?.id
      );
    } catch (err) {
      console.error('Erreur lors de la vérification des doublons:', err);
    } finally {
      checkingDuplicates = false;
    }
  }

  function handleLabelInput() {
    errors.label = '';
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkDuplicates, 500);
  }

  function toggleUnit(unit: Unit) {
    if (selectedUnits.has(unit)) {
      selectedUnits.delete(unit);
    } else {
      selectedUnits.add(unit);
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

  function validate(): boolean {
    errors = {};
    let isValid = true;

    if (label.trim().length < 2) {
      errors.label = 'Le nom doit contenir au moins 2 caractères';
      isValid = false;
    }

    if (selectedUnits.size === 0) {
      errors.units = 'Veuillez sélectionner au moins une unité';
      isValid = false;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      errors.imageUrl = 'URL invalide';
      isValid = false;
    }

    return isValid;
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit() {
    if (!validate()) {
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
      };

      if (ingredient) {
        await apiService.updateIngredient(ingredient.id, data);
      } else {
        await apiService.createIngredient(data);
      }

      onSave();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }
</script>

<Drawer
  {isOpen}
  title={ingredient ? '✏️ Modifier l\'ingrédient' : '➕ Ajouter un ingrédient'}
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
  <form class="ingredient-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <!-- Nom de l'ingrédient -->
    <div class="form-field">
      <label class="form-label" for="label">
        Nom de l'ingrédient <span class="required">*</span>
      </label>
      <input
        id="label"
        type="text"
        class="form-input"
        class:form-input--error={errors.label}
        bind:value={label}
        oninput={handleLabelInput}
        placeholder="Ex: Tomate"
      />
      {#if errors.label}
        <span class="form-error">{errors.label}</span>
      {/if}

      <!-- Détection de doublons -->
      {#if checkingDuplicates}
        <div class="duplicates-check">
          <span>🔍 Vérification des doublons...</span>
        </div>
      {:else if similarIngredients.length > 0}
        <div class="duplicates">
          <p class="duplicates__title">
            ⚠️ Ingrédients similaires trouvés :
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
    </div>

    <!-- Catégorie -->
    <div class="form-field">
      <label class="form-label" for="aisle">
        Catégorie <span class="required">*</span>
      </label>
      <select id="aisle" class="form-select" bind:value={aisle}>
        {#each Object.entries(StoreAisleLabels) as [key, label]}
          <option value={key}>{label}</option>
        {/each}
      </select>
    </div>

    <!-- Unités -->
    <div class="form-field">
      <label class="form-label">
        Unités disponibles <span class="required">*</span>
      </label>
      <div class="checkbox-grid">
        {#each Object.entries(UnitLabels) as [key, label]}
          <label class="checkbox">
            <input
              type="checkbox"
              checked={selectedUnits.has(key as Unit)}
              onchange={() => toggleUnit(key as Unit)}
            />
            <span>{label}</span>
          </label>
        {/each}
      </div>
      {#if errors.units}
        <span class="form-error">{errors.units}</span>
      {/if}
    </div>

    <!-- URL de l'image -->
    <div class="form-field">
      <label class="form-label" for="imageUrl">
        URL de l'image (optionnel)
      </label>
      <input
        id="imageUrl"
        type="url"
        class="form-input"
        class:form-input--error={errors.imageUrl}
        bind:value={imageUrl}
        oninput={() => (errors.imageUrl = '')}
        placeholder="https://exemple.com/image.png"
      />
      {#if errors.imageUrl}
        <span class="form-error">{errors.imageUrl}</span>
      {/if}
      {#if imageUrl && !errors.imageUrl}
        <div class="image-preview">
          <img src={imageUrl} alt="Prévisualisation" />
        </div>
      {/if}
    </div>

    <!-- Mois de saison -->
    <div class="form-field">
      <label class="form-label">
        Mois de disponibilité (optionnel)
      </label>
      <p class="form-hint">
        Sélectionnez les mois où cet ingrédient est de saison
      </p>
      <div class="months-grid">
        {#each MONTHS as { value, label }}
          <label class="month-btn">
            <input
              type="checkbox"
              checked={selectedMonths.has(value)}
              onchange={() => toggleMonth(value)}
            />
            <span>{label}</span>
          </label>
        {/each}
      </div>
    </div>
  </form>
</Drawer>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $warning-color: #ed8936;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .ingredient-form {
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

  .required {
    color: $danger-color;
  }

  .form-input,
  .form-select {
    width: 100%;
    padding: $spacing-base * 0.75;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &--error {
      border-color: $danger-color;
    }
  }

  .form-error {
    color: $danger-color;
    font-size: 0.9rem;
  }

  .form-hint {
    margin: 0;
    color: $text-gray;
    font-size: 0.9rem;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: $spacing-base * 0.5;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: $spacing-base * 0.5;
    padding: $spacing-base * 0.5;
    border: 2px solid $border-color;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-color;
      background: rgba(102, 126, 234, 0.05);
    }

    input {
      cursor: pointer;
    }

    span {
      font-size: 0.9rem;
    }
  }

  .months-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: $spacing-base * 0.5;
  }

  .month-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-base * 0.5;
    border: 2px solid $border-color;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    input {
      display: none;
    }

    span {
      font-size: 0.85rem;
    }

    &:has(input:checked) {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;
      border-color: transparent;
    }

    &:hover {
      border-color: $primary-color;
    }
  }

  .image-preview {
    margin-top: $spacing-base * 0.5;
    max-width: 200px;
    max-height: 200px;
    overflow: hidden;
    border-radius: 8px;
    border: 2px solid $border-color;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .duplicates-check {
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    color: $primary-color;
    font-size: 0.9rem;
  }

  .duplicates {
    padding: $spacing-base;
    background: rgba(237, 137, 54, 0.1);
    border: 2px solid $warning-color;
    border-radius: 8px;

    &__title {
      margin: 0 0 $spacing-base * 0.5 0;
      color: rgba(237, 137, 54, 0.8);
      font-weight: 600;
      font-size: 0.9rem;
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
      padding: $spacing-base * 0.5;
      background: $white;
      border-radius: 6px;
      margin-bottom: $spacing-base * 0.5;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__name {
      flex: 1;
      font-weight: 600;
      font-size: 0.9rem;
    }

    &__aisle {
      color: $text-gray;
      font-size: 0.85rem;
    }

    &__similarity {
      padding: $spacing-base * 0.25 $spacing-base * 0.5;
      background: $warning-color;
      color: $white;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    &__warning {
      margin: 0;
      color: rgba(237, 137, 54, 0.8);
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
</style>
