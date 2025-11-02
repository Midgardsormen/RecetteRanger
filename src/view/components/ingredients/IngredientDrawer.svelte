<script lang="ts">
  import { apiService } from '../../services/api.service';
  import type { Ingredient, CreateIngredientDto, SimilarIngredient } from '../../types/ingredient.types';
  import { StoreAisle, Unit, StoreAisleLabels, UnitLabels, MONTHS } from '../../types/ingredient.types';

  interface Props {
    ingredient?: Ingredient | null;
    onSave: () => void;
    onClose: () => void;
  }

  let { ingredient = null, onSave, onClose }: Props = $props();

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

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

<div class="drawer-overlay" onclick={handleOverlayClick}>
  <div class="drawer">
    <div class="drawer__header">
      <h2 class="drawer__title">
        {ingredient ? '✏️ Modifier l\'ingrédient' : '➕ Ajouter un ingrédient'}
      </h2>
      <button class="drawer__close" onclick={onClose}>✕</button>
    </div>

    <form class="drawer__form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <!-- Nom de l'ingrédient -->
      <div class="drawer__field">
        <label class="drawer__label" for="label">
          Nom de l'ingrédient <span class="drawer__required">*</span>
        </label>
        <input
          id="label"
          type="text"
          class="drawer__input"
          class:drawer__input--error={errors.label}
          bind:value={label}
          oninput={handleLabelInput}
          placeholder="Ex: Tomate"
        />
        {#if errors.label}
          <span class="drawer__error">{errors.label}</span>
        {/if}

        <!-- Détection de doublons -->
        {#if checkingDuplicates}
          <div class="drawer__duplicates-check">
            <span>🔍 Vérification des doublons...</span>
          </div>
        {:else if similarIngredients.length > 0}
          <div class="drawer__duplicates">
            <p class="drawer__duplicates-title">
              ⚠️ Ingrédients similaires trouvés :
            </p>
            <ul class="drawer__duplicates-list">
              {#each similarIngredients as similar}
                <li class="drawer__duplicates-item">
                  <span class="drawer__duplicates-name">{similar.label}</span>
                  <span class="drawer__duplicates-aisle">{similar.aisle}</span>
                  <span class="drawer__duplicates-similarity">{similar.similarity}%</span>
                </li>
              {/each}
            </ul>
            <p class="drawer__duplicates-warning">
              Êtes-vous sûr de vouloir ajouter cet ingrédient ?
            </p>
          </div>
        {/if}
      </div>

      <!-- Catégorie -->
      <div class="drawer__field">
        <label class="drawer__label" for="aisle">
          Catégorie <span class="drawer__required">*</span>
        </label>
        <select id="aisle" class="drawer__select" bind:value={aisle}>
          {#each Object.entries(StoreAisleLabels) as [key, label]}
            <option value={key}>{label}</option>
          {/each}
        </select>
      </div>

      <!-- Unités -->
      <div class="drawer__field">
        <label class="drawer__label">
          Unités disponibles <span class="drawer__required">*</span>
        </label>
        <div class="drawer__checkbox-grid">
          {#each Object.entries(UnitLabels) as [key, label]}
            <label class="drawer__checkbox">
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
          <span class="drawer__error">{errors.units}</span>
        {/if}
      </div>

      <!-- URL de l'image -->
      <div class="drawer__field">
        <label class="drawer__label" for="imageUrl">
          URL de l'image (optionnel)
        </label>
        <input
          id="imageUrl"
          type="url"
          class="drawer__input"
          class:drawer__input--error={errors.imageUrl}
          bind:value={imageUrl}
          oninput={() => (errors.imageUrl = '')}
          placeholder="https://exemple.com/image.png"
        />
        {#if errors.imageUrl}
          <span class="drawer__error">{errors.imageUrl}</span>
        {/if}
        {#if imageUrl && !errors.imageUrl}
          <div class="drawer__image-preview">
            <img src={imageUrl} alt="Prévisualisation" />
          </div>
        {/if}
      </div>

      <!-- Mois de saison -->
      <div class="drawer__field">
        <label class="drawer__label">
          Mois de disponibilité (optionnel)
        </label>
        <p class="drawer__hint">
          Sélectionnez les mois où cet ingrédient est de saison
        </p>
        <div class="drawer__months-grid">
          {#each MONTHS as { value, label }}
            <label class="drawer__month-btn">
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

      <!-- Actions -->
      <div class="drawer__actions">
        <button
          type="button"
          class="drawer__btn drawer__btn--cancel"
          onclick={onClose}
        >
          Annuler
        </button>
        <button
          type="submit"
          class="drawer__btn drawer__btn--submit"
          disabled={saving}
        >
          {saving ? 'Enregistrement...' : ingredient ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  </div>
</div>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $warning-color: #ed8936;
  $success-color: #48bb78;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.1);
  $spacing-base: 1rem;

  .drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 1000;
    overflow-y: auto;
    padding: $spacing-base;
  }

  .drawer {
    background: $white;
    width: 100%;
    max-width: 600px;
    min-height: 100vh;
    box-shadow: -4px 0 24px $shadow-light;
    display: flex;
    flex-direction: column;
  }

  .drawer__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base * 1.5;
    border-bottom: 1px solid $border-color;
    position: sticky;
    top: 0;
    background: $white;
    z-index: 10;
  }

  .drawer__title {
    margin: 0;
    color: $text-dark;
    font-size: 1.5rem;
  }

  .drawer__close {
    background: none;
    border: none;
    font-size: 2rem;
    color: $text-gray;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;

    &:hover {
      background: rgba(245, 101, 101, 0.2);
      color: $danger-color;
    }
  }

  .drawer__form {
    flex: 1;
    padding: $spacing-base * 1.5;
    overflow-y: auto;
  }

  .drawer__field {
    margin-bottom: $spacing-base * 1.5;
  }

  .drawer__label {
    display: block;
    margin-bottom: $spacing-base * 0.5;
    color: $text-dark;
    font-weight: 600;
  }

  .drawer__required {
    color: $danger-color;
  }

  .drawer__input,
  .drawer__select {
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

  .drawer__error {
    display: block;
    margin-top: $spacing-base * 0.25;
    color: $danger-color;
    font-size: 0.9rem;
  }

  .drawer__hint {
    margin: $spacing-base * 0.5 0;
    color: $text-gray;
    font-size: 0.9rem;
  }

  .drawer__checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: $spacing-base * 0.5;
  }

  .drawer__checkbox {
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

  .drawer__months-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: $spacing-base * 0.5;
  }

  .drawer__month-btn {
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

  .drawer__image-preview {
    margin-top: $spacing-base;
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

  .drawer__duplicates-check {
    margin-top: $spacing-base * 0.5;
    padding: $spacing-base;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
    color: $primary-color;
    font-size: 0.9rem;
  }

  .drawer__duplicates {
    margin-top: $spacing-base * 0.5;
    padding: $spacing-base;
    background: rgba(237, 137, 54, 0.1);
    border: 2px solid $warning-color;
    border-radius: 8px;
  }

  .drawer__duplicates-title {
    margin: 0 0 $spacing-base * 0.5 0;
    color: rgba(237, 137, 54, 0.8);
    font-weight: 600;
  }

  .drawer__duplicates-list {
    list-style: none;
    padding: 0;
    margin: 0 0 $spacing-base 0;
  }

  .drawer__duplicates-item {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base * 0.5;
    background: $white;
    border-radius: 6px;
    margin-bottom: $spacing-base * 0.5;
  }

  .drawer__duplicates-name {
    flex: 1;
    font-weight: 600;
  }

  .drawer__duplicates-aisle {
    color: $text-gray;
    font-size: 0.85rem;
  }

  .drawer__duplicates-similarity {
    padding: $spacing-base * 0.25 $spacing-base * 0.5;
    background: $warning-color;
    color: $white;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .drawer__duplicates-warning {
    margin: 0;
    color: rgba(237, 137, 54, 0.8);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .drawer__actions {
    display: flex;
    gap: $spacing-base;
    padding-top: $spacing-base;
    border-top: 1px solid $border-color;
    margin-top: $spacing-base * 2;
    position: sticky;
    bottom: 0;
    background: $white;
    padding-bottom: $spacing-base;
  }

  .drawer__btn {
    flex: 1;
    padding: $spacing-base;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &--cancel {
      background: rgba(102, 102, 102, 0.1);
      color: $text-gray;

      &:hover {
        background: rgba(102, 102, 102, 0.15);
      }
    }

    &--submit {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
</style>
