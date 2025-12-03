<script lang="ts">
  import { Drawer, FormField, Input, Button } from '../../../components/ui';
  import { Calendar, AlertCircle } from 'lucide-svelte';
  import { initializeDates, validateGenerateForm, generateShoppingList } from './actions';
  import { DESCRIPTION_TEXT, NAME_HINT_TEXT } from './config';

  interface Props {
    isOpen?: boolean;
    onClose: () => void;
    onGenerate: () => void;
  }

  let { isOpen = false, onClose, onGenerate }: Props = $props();

  // État du formulaire
  let fromDate = $state('');
  let toDate = $state('');
  let customName = $state('');
  let generating = $state(false);
  let generalError = $state('');

  // Réinitialiser le formulaire
  function resetForm() {
    const dates = initializeDates();
    fromDate = dates.fromDate;
    toDate = dates.toDate;
    customName = '';
    generalError = '';
  }

  async function handleGenerate() {
    const validation = validateGenerateForm({ fromDate, toDate, customName });

    if (!validation.isValid) {
      generalError = validation.errors.general || '';
      return;
    }

    generating = true;
    generalError = '';

    try {
      await generateShoppingList({ fromDate, toDate, customName });

      // Succès
      onClose();
      onGenerate(); // Recharger la liste
    } catch (err: any) {
      generalError = err.message || 'Erreur lors de la génération de la liste';
    } finally {
      generating = false;
    }
  }

  // Réinitialiser le formulaire quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
    }
  });
</script>

<Drawer
  {isOpen}
  title="Générer une liste de courses"
  onClose={onClose}
  primaryAction={{
    label: 'Générer la liste',
    onClick: handleGenerate,
    disabled: generating,
    loading: generating
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <form class="generate-shopping-list-drawer" onsubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
    <!-- Description -->
    <div class="generate-shopping-list-drawer__description">
      <Calendar size={20} />
      <p class="generate-shopping-list-drawer__description-text">
        {DESCRIPTION_TEXT}
      </p>
    </div>

    <!-- Erreur générale -->
    {#if generalError}
      <div class="generate-shopping-list-drawer__error">
        <AlertCircle size={18} />
        <span>{generalError}</span>
      </div>
    {/if}

    <!-- Période -->
    <div class="generate-shopping-list-drawer__section">
      <h3 class="generate-shopping-list-drawer__section-title">Période</h3>
      <div class="generate-shopping-list-drawer__date-inputs">
        <FormField
          name="fromDate"
          label="Date de début"
          variant="inverse"
          required
          bind:value={fromDate}
        >
          <Input
            id="fromDate"
            type="date"
          />
        </FormField>

        <FormField
          name="toDate"
          label="Date de fin"
          variant="inverse"
          required
          bind:value={toDate}
        >
          <Input
            id="toDate"
            type="date"
          />
        </FormField>
      </div>
    </div>

    <!-- Nom personnalisé -->
    <FormField
      name="customName"
      label="Nom de la liste (optionnel)"
      helper={NAME_HINT_TEXT}
      variant="inverse"
      bind:value={customName}
    >
      <Input
        id="customName"
        placeholder="Ex: Courses de la semaine"
      />
    </FormField>
  </form>
</Drawer>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: generate-shopping-list-drawer
  .generate-shopping-list-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    // Element: description
    &__description {
      display: flex;
      align-items: flex-start;
      gap: $spacing-base;
      padding: $spacing-base;
      background: $color-white-alpha-10;
      border: $border-width-base solid $color-white-alpha-30;
      border-radius: $radius-lg;
      color: $color-white-alpha-90;

      :global(svg) {
        flex-shrink: 0;
        margin-top: $spacing-2xs;
      }
    }

    &__description-text {
      margin: 0;
      line-height: $line-height-relaxed;
      font-size: $font-size-sm;

      @media (min-width: 768px) {
        font-size: $font-size-base;
      }
    }

    // Element: error
    &__error {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-base;
      background: $color-danger-alpha-10;
      border: $border-width-base solid $color-danger;
      border-radius: $radius-lg;
      color: $color-danger-light;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;

      :global(svg) {
        flex-shrink: 0;
      }

      @media (min-width: 768px) {
        font-size: $font-size-base;
      }
    }

    // Element: section
    &__section {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    // Element: section-title
    &__section-title {
      margin: 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-white;

      @media (min-width: 768px) {
        font-size: $font-size-lg;
      }
    }

    // Element: date-inputs
    &__date-inputs {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 768px) {
        gap: $spacing-lg;
      }
    }
  }
</style>
