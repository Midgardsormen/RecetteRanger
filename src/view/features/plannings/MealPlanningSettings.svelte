<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, Input, Select } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { MealSlotConfig, MealSlot } from '../../types/meal-plan.types';
  import { MealSlot as MealSlotEnum, MealSlotLabels } from '../../types/meal-plan.types';

  let { user }: { user: any } = $props();

  // État
  let slotConfigs = $state<MealSlotConfig[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let hasChanges = $state(false);

  // Charger les configurations
  async function loadConfigs() {
    if (!user) return;

    loading = true;
    try {
      const configs = await apiService.getMealSlotConfigs(user.id);
      slotConfigs = configs.sort((a, b) => a.order - b.order);

      // Si pas de configs, initialiser
      if (configs.length === 0) {
        await apiService.initializeDefaultMealSlotConfigs(user.id);
        const newConfigs = await apiService.getMealSlotConfigs(user.id);
        slotConfigs = newConfigs.sort((a, b) => a.order - b.order);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des configurations:', err);
      alert('Erreur lors du chargement des configurations');
    } finally {
      loading = false;
    }
  }

  function updateConfig(index: number, field: keyof MealSlotConfig, value: any) {
    slotConfigs[index] = { ...slotConfigs[index], [field]: value };
    slotConfigs = [...slotConfigs];
    hasChanges = true;
  }

  async function saveConfigs() {
    saving = true;
    try {
      // Mettre à jour toutes les configurations
      await Promise.all(
        slotConfigs.map(config =>
          apiService.updateMealSlotConfig(config.id, {
            label: config.label,
            order: config.order,
            isEnabled: config.isEnabled
          })
        )
      );

      hasChanges = false;
      alert('Configurations enregistrées avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      alert('Erreur lors de l\'enregistrement des configurations');
    } finally {
      saving = false;
    }
  }

  function moveUp(index: number) {
    if (index === 0) return;

    const temp = slotConfigs[index];
    slotConfigs[index] = slotConfigs[index - 1];
    slotConfigs[index - 1] = temp;

    // Mettre à jour les ordres
    slotConfigs = slotConfigs.map((config, i) => ({ ...config, order: i }));
    hasChanges = true;
  }

  function moveDown(index: number) {
    if (index === slotConfigs.length - 1) return;

    const temp = slotConfigs[index];
    slotConfigs[index] = slotConfigs[index + 1];
    slotConfigs[index + 1] = temp;

    // Mettre à jour les ordres
    slotConfigs = slotConfigs.map((config, i) => ({ ...config, order: i }));
    hasChanges = true;
  }

  function goBack() {
    if (hasChanges && !confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?')) {
      return;
    }
    window.location.href = '/planning';
  }

  // Charger au montage
  $effect(() => {
    if (user) {
      loadConfigs();
    }
  });
</script>

<Layout title="Configuration des créneaux de repas" currentPage="/planning" {user}>
  <div class="settings-page">
    <div class="settings-header">
      <Button variant="secondary" onclick={goBack}>
        ← Retour au planning
      </Button>

      <div class="header-content">
        <h1>⚙️ Configuration des créneaux</h1>
        <p class="subtitle">Personnalisez les noms et l'ordre de vos créneaux de repas</p>
      </div>
    </div>

    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des configurations...</p>
      </div>
    {:else}
      <div class="settings-content">
        <div class="info-box">
          <p><strong>💡 Astuce :</strong> Vous pouvez personnaliser les noms des créneaux selon vos habitudes régionales. Par exemple, dans le Nord on dit "Déjeuner/Dîner/Souper" au lieu de "Petit-déjeuner/Déjeuner/Dîner".</p>
        </div>

        <div class="configs-list">
          {#each slotConfigs as config, index}
            <div class="config-item" class:disabled={!config.isEnabled}>
              <div class="config-header">
                <div class="order-controls">
                  <button
                    class="order-btn"
                    onclick={() => moveUp(index)}
                    disabled={index === 0}
                    title="Monter"
                  >
                    ↑
                  </button>
                  <span class="order-number">{index + 1}</span>
                  <button
                    class="order-btn"
                    onclick={() => moveDown(index)}
                    disabled={index === slotConfigs.length - 1}
                    title="Descendre"
                  >
                    ↓
                  </button>
                </div>

                <div class="config-info">
                  <span class="slot-type">{MealSlotLabels[config.slot]}</span>
                  <span class="slot-badge">{config.slot}</span>
                </div>

                <div class="config-toggle">
                  <input
                    type="checkbox"
                    id={`enabled-${config.id}`}
                    checked={config.isEnabled}
                    onchange={(e) => updateConfig(index, 'isEnabled', e.currentTarget.checked)}
                  />
                  <label for={`enabled-${config.id}`}>Actif</label>
                </div>
              </div>

              <div class="config-fields">
                <Input
                  id={`label-${config.id}`}
                  label="Nom personnalisé"
                  value={config.label}
                  oninput={(e) => updateConfig(index, 'label', e.currentTarget.value)}
                  placeholder="Ex: Petit-déjeuner"
                  disabled={!config.isEnabled}
                />
              </div>
            </div>
          {/each}
        </div>

        <div class="actions">
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

<style lang="scss">
  @use '../../styles/variables' as *;
  $primary-color: $brand-primary;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $border-color: $color-gray-200;
  $spacing-base: 1rem;

  .settings-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .settings-header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .header-content {
      h1 {
        margin: 0;
        font-size: 2rem;
        color: $text-dark;
      }

      .subtitle {
        margin: 0.5rem 0 0 0;
        color: $text-gray;
        font-size: 1.1rem;
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1.5rem;

    p {
      color: $text-gray;
      font-size: 1.1rem;
    }
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid $border-color;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-box {
    padding: 1.5rem;
    background: rgba($brand-primary, 0.08);
    border-left: 4px solid $primary-color;
    border-radius: 8px;

    p {
      margin: 0;
      color: $text-dark;
      line-height: 1.6;
    }
  }

  .configs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .config-item {
    padding: 1.5rem;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.2s;

    &.disabled {
      opacity: 0.5;
      background: $color-gray-50;
    }

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  .config-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .order-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    .order-number {
      font-weight: 600;
      color: $primary-color;
      font-size: 1.1rem;
    }
  }

  .order-btn {
    width: 32px;
    height: 32px;
    border: 2px solid $border-color;
    background: $white;
    color: $text-gray;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: $primary-color;
      color: $primary-color;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .config-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .slot-type {
      font-size: 1.1rem;
      font-weight: 600;
      color: $text-dark;
    }

    .slot-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba($brand-primary, 0.1);
      color: $primary-color;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      align-self: flex-start;
    }
  }

  .config-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: $primary-color;
    }

    label {
      font-size: 0.9rem;
      color: $text-dark;
      cursor: pointer;
      user-select: none;
    }
  }

  .config-fields {
    padding-left: 3rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
