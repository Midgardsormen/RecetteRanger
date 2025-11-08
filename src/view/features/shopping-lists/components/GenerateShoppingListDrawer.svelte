<script lang="ts">
  import { Drawer, Input, Button } from '../../../components/ui';
  import { apiService } from '../../../services/api.service';

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
  let error = $state('');

  // Initialiser les dates à aujourd'hui et dans 7 jours
  function resetForm() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    fromDate = today.toISOString().split('T')[0];
    toDate = nextWeek.toISOString().split('T')[0];
    customName = '';
    error = '';
  }

  function validate(): boolean {
    error = '';

    if (!fromDate || !toDate) {
      error = 'Veuillez sélectionner les dates de début et de fin';
      return false;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      error = 'La date de début doit être avant la date de fin';
      return false;
    }

    return true;
  }

  async function handleGenerate() {
    if (!validate()) {
      return;
    }

    generating = true;
    error = '';

    try {
      await apiService.generateShoppingList({
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        name: customName || undefined
      });

      // Succès
      onClose();
      onGenerate(); // Recharger la liste
    } catch (err: any) {
      error = err.message || 'Erreur lors de la génération de la liste';
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
  <form class="generate-form" onsubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
    <div class="form-section">
      <p class="description">
        Générez automatiquement une liste de courses à partir de votre planning de repas.
        Les quantités seront calculées en fonction du nombre de personnes de chaque repas.
      </p>
    </div>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <div class="form-section">
      <h3>Période</h3>
      <div class="date-inputs">
        <Input
          id="fromDate"
          label="Date de début"
          type="date"
          bind:value={fromDate}
          required
        />
        <Input
          id="toDate"
          label="Date de fin"
          type="date"
          bind:value={toDate}
          required
        />
      </div>
    </div>

    <div class="form-section">
      <Input
        id="customName"
        label="Nom de la liste (optionnel)"
        bind:value={customName}
        placeholder="Ex: Courses de la semaine"
      />
      <p class="hint">
        Si vide, un nom sera généré automatiquement avec les dates
      </p>
    </div>
  </form>
</Drawer>

<style lang="scss">
  .generate-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-section {
    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: var(--text-color);
    }

    .description {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .hint {
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
      color: var(--text-tertiary);
    }
  }

  .date-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .error-message {
    padding: 1rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    color: #c33;
    font-size: 0.95rem;
  }
</style>
