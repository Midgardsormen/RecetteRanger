<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Calendar } from './components/calendar';
  import { MealPlanDrawer } from './components/meal-plan-drawer';
  import { Button } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../types/meal-plan.types';

  let { user }: { user: any } = $props();

  // État
  let view = $state<CalendarView>('week');
  let currentDate = $state(new Date());
  let mealPlanDays = $state<MealPlanDay[]>([]);
  let slotConfigs = $state<MealSlotConfig[]>([]);
  let loading = $state(true);
  let showMealDrawer = $state(false);
  let selectedDate = $state(new Date());

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
    showMealDrawer = true;
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
    loadData(); // Recharger les données
  }

  function openSettings() {
    window.location.href = '/planning/settings';
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
    <div class="planning-header">
      <div class="header-content">
        <h1>📅 Planning des repas</h1>
        <p class="subtitle">Organisez vos repas de la semaine</p>
      </div>
      <Button variant="secondary" onclick={openSettings}>
        ⚙️ Personnaliser les créneaux
      </Button>
    </div>

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
  onClose={() => { showMealDrawer = false; }}
  onSave={handleMealSaved}
/>

<style lang="scss">
  .meal-planning {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .planning-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .header-content {
    h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-color);
    }

    .subtitle {
      margin: 0.5rem 0 0 0;
      color: var(--text-secondary);
      font-size: 1.1rem;
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
