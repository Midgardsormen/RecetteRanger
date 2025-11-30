<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Calendar } from './components/calendar';
  import { MealPlanDrawer } from './components/meal-plan-drawer';
  import { Button, PageHero, ConfirmModal } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../types/meal-plan.types';
  import { Settings } from 'lucide-svelte';

  let { user }: { user: any } = $props();

  // État
  let view = $state<CalendarView>('week');
  let currentDate = $state(new Date());
  let mealPlanDays = $state<MealPlanDay[]>([]);
  let slotConfigs = $state<MealSlotConfig[]>([]);
  let loading = $state(true);
  let showMealDrawer = $state(false);
  let selectedDate = $state(new Date());
  let editingMealItem = $state<any>(null);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let mealToDelete = $state<any>(null);
  let deleteError = $state<string>('');

  // Charger les données
  async function loadData() {
    if (!user) return;

    loading = true;
    try {
      // Calculer la plage de dates en fonction de la vue
      const { fromDate, toDate } = getDateRange();

      // Charger les plannings et les configs en parallèle
      const [days, configs] = await Promise.all([
        apiService.getMealPlanDays({
          userId: user.id,
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString()
        }),
        apiService.getMealSlotConfigs(user.id)
      ]);

      mealPlanDays = days;
      slotConfigs = configs;

      // Si pas de configs, initialiser les configs par défaut
      if (configs.length === 0) {
        await apiService.initializeDefaultMealSlotConfigs(user.id);
        const newConfigs = await apiService.getMealSlotConfigs(user.id);
        slotConfigs = newConfigs;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      loading = false;
    }
  }

  function getDateRange(): { fromDate: Date; toDate: Date } {
    const from = new Date(currentDate);
    const to = new Date(currentDate);

    if (view === 'day') {
      // Même jour
      return { fromDate: from, toDate: to };
    } else if (view === 'week') {
      // Début et fin de semaine
      const day = from.getDay();
      const diff = from.getDate() - day + (day === 0 ? -6 : 1);
      from.setDate(diff);
      to.setDate(from.getDate() + 6);
    } else {
      // Mois entier + quelques jours avant/après pour remplir le calendrier
      from.setDate(1);
      from.setDate(from.getDate() - 7);
      to.setMonth(to.getMonth() + 1);
      to.setDate(0);
      to.setDate(to.getDate() + 7);
    }

    return { fromDate: from, toDate: to };
  }

  function handleDateClick(date: Date) {
    selectedDate = date;
    editingMealItem = null;
    showMealDrawer = true;
  }

  function handleMealEdit(item: any) {
    editingMealItem = item;
    // Trouver le mealPlanDay correspondant pour avoir la date
    const mealDay = mealPlanDays.find(d => d.items.some(i => i.id === item.id));
    if (mealDay) {
      selectedDate = new Date(mealDay.date);
    }
    showMealDrawer = true;
  }

  function openDeleteConfirmation(item: any) {
    mealToDelete = item;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    mealToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!mealToDelete) return;

    try {
      await apiService.deleteMealPlanItem(mealToDelete.id);
      await loadData(); // Recharger les données
      isConfirmModalOpen = false;
      mealToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
    }
  }

  function handleViewChange(newView: CalendarView) {
    view = newView;
    loadData();
  }

  function handleDateNavigate(date: Date) {
    currentDate = date;
    loadData();
  }

  function handleMealSaved() {
    showMealDrawer = false;
    editingMealItem = null;
    loadData(); // Recharger les données
  }

  function openSettings() {
    window.location.href = '/plannings/settings';
  }

  // Charger les données au montage et quand l'utilisateur change
  $effect(() => {
    if (user) {
      loadData();
    }
  });
</script>

<Layout title="Planning des repas" currentPage="/planning" {user}>
  <div class="meal-planning">
    <PageHero
      title="Planning des repas"
      actionLabel="Personnaliser les créneaux"
      onAction={openSettings}
    >
      {#snippet actionIcon()}
        <Settings size={18} />
      {/snippet}
    </PageHero>

    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement du planning...</p>
      </div>
    {:else}
      <Calendar
        bind:view
        bind:currentDate
        {mealPlanDays}
        {slotConfigs}
        onDateClick={handleDateClick}
        onViewChange={handleViewChange}
        onDateNavigate={handleDateNavigate}
        onMealEdit={handleMealEdit}
        onMealDelete={openDeleteConfirmation}
      />
    {/if}
  </div>
</Layout>

<MealPlanDrawer
  isOpen={showMealDrawer}
  {selectedDate}
  mealPlanDay={mealPlanDays.find(d => new Date(d.date).toDateString() === selectedDate.toDateString())}
  {slotConfigs}
  userId={user?.id}
  editingItem={editingMealItem}
  onClose={() => { showMealDrawer = false; editingMealItem = null; }}
  onSave={handleMealSaved}
/>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer le repas"
  message={deleteError || "Êtes-vous sûr de vouloir supprimer ce repas ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<style lang="scss">
  .meal-planning {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1.5rem;

    p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
