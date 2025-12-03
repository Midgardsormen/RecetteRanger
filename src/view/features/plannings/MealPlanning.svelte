<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Calendar } from './components/calendar';
  import { MealPlanDrawer } from './components/meal-plan-drawer';
  import { Button, PageHero, ConfirmModal, Spinner } from '../../components/ui';
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../types/meal-plan.types';
  import { Settings } from 'lucide-svelte';
  import { loadMealPlanData, deleteMealPlanItem, findMealPlanDayForItem } from './actions';

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
      const { days, configs } = await loadMealPlanData(user.id, currentDate, view);
      mealPlanDays = days;
      slotConfigs = configs;
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      loading = false;
    }
  }

  function handleDateClick(date: Date) {
    selectedDate = date;
    editingMealItem = null;
    showMealDrawer = true;
  }

  function handleMealEdit(item: any) {
    editingMealItem = item;
    // Trouver le mealPlanDay correspondant pour avoir la date
    const mealDay = findMealPlanDayForItem(mealPlanDays, item.id);
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
      await deleteMealPlanItem(mealToDelete.id);
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
      <div class="meal-planning__loading">
        <Spinner size="lg" variant="primary" />
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
  @use '../../styles/variables' as *;

  // Block: meal-planning
  .meal-planning {
    display: flex;
    flex-direction: column;

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
  }
</style>
