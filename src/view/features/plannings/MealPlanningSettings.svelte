<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, PageHero, Breadcrumb, ConfirmModal, Spinner, Alert, FormField, IconButton } from '../../components/ui';
  import { ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { MealSlotConfig } from '../../types/meal-plan.types';
  import { MealSlotLabels } from '../../types/meal-plan.types';
  import { loadMealSlotConfigs, saveMealSlotConfigs, moveConfigUp, moveConfigDown, updateConfigField } from './actions-settings';

  let { user }: { user: any } = $props();

  // État
  let slotConfigs = $state<MealSlotConfig[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let hasChanges = $state(false);
  let successMessage = $state('');
  let errorMessage = $state('');

  // Modal de confirmation pour quitter sans sauvegarder
  let isConfirmModalOpen = $state(false);

  // Charger les configurations
  async function loadConfigs() {
    if (!user) return;

    loading = true;
    try {
      slotConfigs = await loadMealSlotConfigs(user.id);
    } catch (err) {
      console.error('Erreur lors du chargement des configurations:', err);
      errorMessage = 'Erreur lors du chargement des configurations';
    } finally {
      loading = false;
    }
  }

  function updateConfig(index: number, field: keyof MealSlotConfig, value: any) {
    slotConfigs = updateConfigField(slotConfigs, index, field, value);
    hasChanges = true;
  }

  async function saveConfigs() {
    saving = true;
    errorMessage = '';
    successMessage = '';
    try {
      await saveMealSlotConfigs(slotConfigs);
      hasChanges = false;
      successMessage = 'Configurations enregistrées avec succès !';

      // Effacer le message après 3 secondes
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      errorMessage = 'Erreur lors de l\'enregistrement des configurations';
    } finally {
      saving = false;
    }
  }

  function moveUp(index: number) {
    slotConfigs = moveConfigUp(slotConfigs, index);
    hasChanges = true;
  }

  function moveDown(index: number) {
    slotConfigs = moveConfigDown(slotConfigs, index);
    hasChanges = true;
  }

  function attemptGoBack() {
    if (hasChanges) {
      isConfirmModalOpen = true;
    } else {
      goBack();
    }
  }

  function goBack() {
    window.location.href = '/plannings';
  }

  function cancelGoBack() {
    isConfirmModalOpen = false;
  }

  // Charger au montage
  $effect(() => {
    if (user) {
      loadConfigs();
    }
  });
</script>

<Layout title="Configuration des créneaux de repas" currentPage="/plannings" {user}>
  <div class="meal-planning-settings">
    <Breadcrumb
      mode="simple"
      backLabel="Planning des repas"
      onBack={attemptGoBack}
    />

    <PageHero
      title="Configuration des créneaux"
      subtitle="Personnalisez les noms et l'ordre de vos créneaux de repas"
    />

    {#if errorMessage}
      <Alert variant="error" closable onClose={() => errorMessage = ''}>
        {errorMessage}
      </Alert>
    {/if}

    {#if successMessage}
      <Alert variant="success" closable onClose={() => successMessage = ''}>
        {successMessage}
      </Alert>
    {/if}

    {#if loading}
      <div class="meal-planning-settings__loading">
        <Spinner size="lg" variant="primary" />
        <p>Chargement des configurations...</p>
      </div>
    {:else}
      <div class="meal-planning-settings__content">
        <div class="meal-planning-settings__info-box">
          <p><strong>💡 Astuce :</strong> Vous pouvez personnaliser les noms des créneaux selon vos habitudes régionales. Par exemple, dans le Nord on dit "Déjeuner/Dîner/Souper" au lieu de "Petit-déjeuner/Déjeuner/Dîner".</p>
        </div>

        <div class="meal-planning-settings__list">
          {#each slotConfigs as config, index}
            <div class="meal-planning-settings__item" class:meal-planning-settings__item--disabled={!config.isEnabled}>
              <div class="meal-planning-settings__item-header">
                <div class="meal-planning-settings__order-controls">
                  <IconButton
                    variant="ghost"
                    size="small"
                    onclick={() => moveUp(index)}
                    disabled={index === 0}
                    ariaLabel="Monter"
                  >
                    <ChevronUp size={16} />
                  </IconButton>
                  <span class="meal-planning-settings__order-number">{index + 1}</span>
                  <IconButton
                    variant="ghost"
                    size="small"
                    onclick={() => moveDown(index)}
                    disabled={index === slotConfigs.length - 1}
                    ariaLabel="Descendre"
                  >
                    <ChevronDown size={16} />
                  </IconButton>
                </div>

                <div class="meal-planning-settings__item-info">
                  <span class="meal-planning-settings__slot-type">{MealSlotLabels[config.slot]}</span>
                  <span class="meal-planning-settings__slot-badge">{config.slot}</span>
                </div>

                <div class="meal-planning-settings__toggle">
                  <input
                    type="checkbox"
                    id={`enabled-${config.id}`}
                    checked={config.isEnabled}
                    onchange={(e) => updateConfig(index, 'isEnabled', e.currentTarget.checked)}
                  />
                  <label for={`enabled-${config.id}`}>Actif</label>
                </div>
              </div>

              <div class="meal-planning-settings__item-fields">
                <FormField
                  id={`label-${config.id}`}
                  label="Nom personnalisé"
                  type="text"
                  value={config.label}
                  oninput={(e) => updateConfig(index, 'label', e.currentTarget.value)}
                  placeholder="Ex: Petit-déjeuner"
                  disabled={!config.isEnabled}
                />
              </div>
            </div>
          {/each}
        </div>

        <div class="meal-planning-settings__actions">
          <Button
            variant="primary"
            onclick={saveConfigs}
            disabled={!hasChanges || saving}
            loading={saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </div>
    {/if}
  </div>
</Layout>

<!-- Modal de confirmation pour quitter sans sauvegarder -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Modifications non enregistrées"
  message="Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter sans enregistrer ?"
  confirmLabel="Quitter sans enregistrer"
  cancelLabel="Annuler"
  onConfirm={goBack}
  onCancel={cancelGoBack}
  variant="warning"
/>

<style lang="scss">
  @use '../../styles/variables' as *;

  // Block: meal-planning-settings
  .meal-planning-settings {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    @media (min-width: $breakpoint-md) {
      gap: $spacing-xl;
    }

    // Element: loading
    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: $spacing-lg;

      p {
        color: $color-gray-600;
        font-size: $font-size-lg;
        text-align: center;
      }
    }

    // Element: content
    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        gap: $spacing-xl;
      }
    }

    // Element: info-box
    &__info-box {
      padding: $spacing-base;
      background: $color-primary-alpha-08;
      border-left: 4px solid $brand-primary;
      border-radius: $radius-lg;

      @media (min-width: $breakpoint-md) {
        padding: $spacing-lg;
      }

      p {
        margin: 0;
        color: $color-text-primary;
        line-height: $line-height-normal;
      }
    }

    // Element: list
    &__list {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;

      @media (min-width: $breakpoint-md) {
        gap: $spacing-base;
      }
    }

    // Element: item
    &__item {
      padding: $spacing-base;
      background: $color-background-primary;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      transition: box-shadow $transition-base;

      @media (min-width: $breakpoint-md) {
        padding: $spacing-lg;
        border-radius: $radius-xl;
      }

      &:hover {
        box-shadow: $shadow-list-item-hover;
      }

      // Modifier: disabled
      &--disabled {
        opacity: 0.5;
        background: $color-background-secondary;
      }
    }

    // Element: item-header
    &__item-header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      flex-wrap: wrap;

      @media (min-width: $breakpoint-md) {
        gap: $spacing-base;
        flex-wrap: nowrap;
      }
    }

    // Element: order-controls
    &__order-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-2xs;
    }

    // Element: order-number
    &__order-number {
      font-weight: $font-weight-semibold;
      color: $brand-primary;
      font-size: $font-size-lg;
    }

    // Element: item-info
    &__item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      min-width: 0;
    }

    // Element: slot-type
    &__slot-type {
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    // Element: slot-badge
    &__slot-badge {
      display: inline-block;
      padding: $spacing-2xs $spacing-md;
      background: $color-primary-alpha-10;
      color: $brand-primary;
      border-radius: $radius-xl;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      text-transform: uppercase;
      align-self: flex-start;
    }

    // Element: toggle
    &__toggle {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: $brand-primary;
      }

      label {
        font-size: $font-size-sm;
        color: $color-text-primary;
        cursor: pointer;
        user-select: none;

        @media (min-width: $breakpoint-md) {
          font-size: $font-size-base;
        }
      }
    }

    // Element: item-fields
    &__item-fields {
      padding-left: 0;

      @media (min-width: $breakpoint-md) {
        padding-left: 48px;
      }
    }

    // Element: actions
    &__actions {
      display: flex;
      justify-content: flex-start;

      @media (min-width: $breakpoint-md) {
        justify-content: flex-end;
      }
    }
  }
</style>
