<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Calendar, CalendarControls } from './components/calendar';
  import { MealPlanDrawer } from './components/meal-plan-drawer';
  import { DuplicateMealsDrawer } from './components/duplicate-meals-drawer';
  import { Button, PageHero, ConfirmModal, Spinner, IconButton, DropdownMenu } from '../../components/ui';
  import { GenerateShoppingListDrawer } from '../shopping-lists/components';
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../types/meal-plan.types';
  import type { DropdownMenuItem } from '../../types/ui.types';
  import { Settings, ShoppingCart } from 'lucide-svelte';
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
  let showGenerateDrawer = $state(false);
  let showDuplicateDrawer = $state(false);
  let duplicateSourceDate = $state<Date | null>(null);
  let duplicateSourceMealPlan = $state<MealPlanDay | null>(null);

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
    currentDate = date; // Garder le calendrier centré sur cette date
    editingMealItem = null;

    // Si le jour a des repas, proposer d'ajouter ou de dupliquer
    const mealDay = mealPlanDays.find(d => new Date(d.date).toDateString() === date.toDateString());

    // Toujours ouvrir le drawer d'ajout de repas
    showMealDrawer = true;
  }

  function handleDuplicateClick(date: Date) {
    const mealDay = mealPlanDays.find(d => new Date(d.date).toDateString() === date.toDateString());
    if (mealDay && mealDay.items.length > 0) {
      duplicateSourceDate = date;
      duplicateSourceMealPlan = mealDay;
      showDuplicateDrawer = true;
    }
  }

  function handleMealEdit(item: any) {
    editingMealItem = item;
    // Trouver le mealPlanDay correspondant pour avoir la date
    const mealDay = findMealPlanDayForItem(mealPlanDays, item.id);
    if (mealDay) {
      selectedDate = new Date(mealDay.date);
      currentDate = new Date(mealDay.date); // Garder le calendrier centré sur cette date
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

  function handleGenerateClick() {
    showGenerateDrawer = true;
  }

  function handleListGenerated() {
    // Optionnel : rediriger vers la liste ou afficher un message
    showGenerateDrawer = false;
  }

  function handleDuplicateSuccess() {
    showDuplicateDrawer = false;
    duplicateSourceDate = null;
    duplicateSourceMealPlan = null;
    loadData(); // Recharger les données
  }

  // Menu de configuration
  const configMenuItems: DropdownMenuItem[] = [
    {
      label: 'Personnaliser les créneaux',
      onClick: openSettings
    }
  ];

  // Fonctions utilitaires de date pour CalendarControls
  function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Calculer les dates à afficher selon la vue
  let dates = $derived.by(() => {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfMonth(currentDate);
      const datesList: Date[] = [];
      let current = start;

      while (current <= end || datesList.length < 35) {
        datesList.push(new Date(current));
        current = addDays(current, 1);
      }

      return datesList;
    }
  });

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
      actionLabel="+ Générer la liste de courses"
      onAction={handleGenerateClick}
    >
      {#snippet actionIcon()}
        <ShoppingCart size={18} />
      {/snippet}
      {#snippet children()}
        <CalendarControls
          bind:view
          bind:currentDate
          {dates}
          onViewChange={handleViewChange}
          onDateNavigate={handleDateNavigate}
          settingsMenuItems={configMenuItems}
        />
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
        showHeader={false}
        onDateClick={handleDateClick}
        onViewChange={handleViewChange}
        onDateNavigate={handleDateNavigate}
        onMealEdit={handleMealEdit}
        onMealDelete={openDeleteConfirmation}
        onDayDuplicate={handleDuplicateClick}
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

<GenerateShoppingListDrawer
  isOpen={showGenerateDrawer}
  onClose={() => { showGenerateDrawer = false; }}
  onGenerate={handleListGenerated}
/>

<DuplicateMealsDrawer
  isOpen={showDuplicateDrawer}
  sourceDate={duplicateSourceDate}
  sourceMealPlan={duplicateSourceMealPlan}
  userId={user?.id}
  onClose={() => { showDuplicateDrawer = false; duplicateSourceDate = null; duplicateSourceMealPlan = null; }}
  onSuccess={handleDuplicateSuccess}
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
