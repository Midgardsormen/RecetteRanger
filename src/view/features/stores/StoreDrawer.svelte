<script lang="ts">
  import { Drawer, Input } from '../../components/ui';
  import { apiService } from '../../services/api.service';

  interface Store {
    id: string;
    name: string;
    logoUrl?: string | null;
    color?: string;
  }

  interface Props {
    isOpen?: boolean;
    store?: Store | null;
    initialName?: string;
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, store = null, initialName = '', onSave, onClose }: Props = $props();

  // Formulaire
  let name = $state(store?.name || '');
  let logoUrl = $state(store?.logoUrl || '');
  let color = $state(store?.color || '$brand-primary');

  // Détection de doublons
  let similarStores = $state<any[]>([]);
  let checkingDuplicates = $state(false);
  let duplicateCheckTimeout: ReturnType<typeof setTimeout>;

  // Validation et état
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser le formulaire quand l'enseigne change ou quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      if (store) {
        name = store.name;
        logoUrl = store.logoUrl || '';
        color = store.color || '$brand-primary';
      } else {
        name = initialName || '';
        logoUrl = '';
        color = '$brand-primary';
      }
      errors = {};
      similarStores = [];
    }
  });

  async function checkDuplicates() {
    if (name.length < 2) {
      similarStores = [];
      return;
    }

    checkingDuplicates = true;
    try {
      const result = await apiService.checkStoreDuplicates(name);
      // Si on est en mode édition, exclure l'enseigne en cours d'édition
      similarStores = result.similarStores.filter(
        (sim: any) => sim.id !== store?.id
      );
    } catch (err) {
      console.error('Erreur lors de la vérification des doublons:', err);
    } finally {
      checkingDuplicates = false;
    }
  }

  function handleNameInput() {
    errors.name = '';
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkDuplicates, 500);
  }

  function validate(): boolean {
    errors = {};
    let isValid = true;

    if (name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
      isValid = false;
    }

    if (logoUrl && !isValidUrl(logoUrl)) {
      errors.logoUrl = 'URL invalide';
      isValid = false;
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      errors.color = 'Couleur invalide (format: #RRGGBB)';
      isValid = false;
    }

    return isValid;
  }

  function isValidUrl(url: string): boolean {
    if (url.startsWith('/')) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit() {
    if (!validate()) return;

    saving = true;

    try {
      const data = {
        name: name.trim(),
        logoUrl: logoUrl.trim() || undefined,
        color: color || '$brand-primary',
      };

      if (store) {
        await apiService.updateStore(store.id, data);
      } else {
        await apiService.createStore(data);
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
  title={store ? 'Modifier l\'enseigne' : 'Ajouter une enseigne'}
  {onClose}
  primaryAction={{
    label: store ? 'Modifier' : 'Ajouter',
    onClick: handleSubmit,
    disabled: saving,
    loading: saving
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <form class="store-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <!-- Nom de l'enseigne -->
    <Input
      id="name"
      label="Nom de l'enseigne"
      bind:value={name}
      oninput={handleNameInput}
      placeholder="Ex: Auchan, Lidl, Carrefour..."
      required
      error={errors.name}
    />

    <!-- Détection de doublons -->
    {#if checkingDuplicates}
      <div class="duplicates-check">
        <span>🔍 Vérification des doublons...</span>
      </div>
    {:else if similarStores.length > 0}
      <div class="duplicates">
        <p class="duplicates__title">
          ⚠️ Enseignes similaires trouvées :
        </p>
        <ul class="duplicates__list">
          {#each similarStores as similar}
            <li class="duplicates__item">
              <span class="duplicates__name">{similar.name}</span>
            </li>
          {/each}
        </ul>
        <p class="duplicates__warning">
          Êtes-vous sûr de vouloir ajouter cette enseigne ?
        </p>
      </div>
    {/if}

    <!-- URL du logo -->
    <Input
      id="logoUrl"
      label="URL du logo (optionnel)"
      bind:value={logoUrl}
      placeholder="https://exemple.com/logo.png"
      error={errors.logoUrl}
    />

    <!-- Couleur -->
    <div class="form-field">
      <label class="form-label" for="color">Couleur (pour l'UI)</label>
      <div class="color-input">
        <input
          id="color"
          type="color"
          bind:value={color}
          class="color-picker"
        />
        <Input
          id="color-text"
          bind:value={color}
          placeholder="$brand-primary"
          error={errors.color}
        />
      </div>
    </div>
  </form>
</Drawer>

<style lang="scss">
  @use '../../styles/variables' as *;
  $primary-color: $brand-primary;
  $secondary-color: $brand-secondary;
  $warning-color: $color-warning;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $border-color: $color-gray-200;
  $spacing-base: 1rem;

  .store-form {
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

  .color-input {
    display: flex;
    gap: $spacing-base;
    align-items: center;
  }

  .color-picker {
    width: 60px;
    height: 40px;
    border: 2px solid $border-color;
    border-radius: 8px;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }
  }

  .duplicates-check {
    padding: $spacing-base;
    background: rgba($brand-primary, 0.1);
    border-radius: 8px;
    color: $primary-color;
    font-size: 0.9rem;
  }

  .duplicates {
    padding: $spacing-base;
    background: $color-warning-alpha-10;
    border: 2px solid $warning-color;
    border-radius: 8px;

    &__title {
      margin: 0 0 $spacing-base * 0.5 0;
      color: $color-warning;
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

    &__warning {
      margin: 0;
      color: $color-warning;
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
</style>
