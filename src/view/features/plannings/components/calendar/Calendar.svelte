<script lang="ts">
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../../../types/meal-plan.types';
  import { MealSlotColors } from '../../../../types/meal-plan.types';
  import { Button, IconButton, Badge, ListItem } from '../../../../components/ui';
  import { ArrowLeft, ArrowRight, Pencil, Trash2 } from 'lucide-svelte';

  interface Props {
    view?: CalendarView;
    currentDate?: Date;
    mealPlanDays?: MealPlanDay[];
    slotConfigs?: MealSlotConfig[];
    onDateClick?: (date: Date) => void;
    onViewChange?: (view: CalendarView) => void;
    onDateNavigate?: (date: Date) => void;
    onMealEdit?: (item: any) => void;
    onMealDelete?: (item: any) => void;
    headerActions?: import('svelte').Snippet;
  }

  let {
    view = $bindable('week'),
    currentDate = $bindable(new Date()),
    mealPlanDays = [],
    slotConfigs = [],
    onDateClick,
    onViewChange,
    onDateNavigate,
    onMealEdit,
    onMealDelete,
    headerActions
  }: Props = $props();

  // Fonctions utilitaires de date
  function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi = premier jour
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

  function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
  }

  function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  function formatDayName(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  function formatMonthYear(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  // Trouver le MealPlanDay pour une date donnée
  function getMealPlanForDate(date: Date): MealPlanDay | undefined {
    return mealPlanDays.find(day => isSameDay(new Date(day.date), date));
  }

  // Trier les items d'un repas selon l'ordre des créneaux dans slotConfigs
  function sortMealItems(items: any[]): any[] {
    if (!items || items.length === 0) return [];

    return [...items].sort((a, b) => {
      // Les repas exceptionnels à la fin
      if (a.isExceptional && !b.isExceptional) return 1;
      if (!a.isExceptional && b.isExceptional) return -1;
      if (a.isExceptional && b.isExceptional) return 0;

      // Sinon, trier selon l'ordre dans slotConfigs
      const indexA = slotConfigs.findIndex(c => c.slot === a.slot);
      const indexB = slotConfigs.findIndex(c => c.slot === b.slot);

      // Si un slot n'est pas trouvé, le mettre à la fin
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }

  // Générer les dates à afficher selon la vue
  function getDatesToDisplay(): Date[] {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      // month
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfMonth(currentDate);
      const dates: Date[] = [];
      let current = start;

      while (current <= end || dates.length < 35) {
        dates.push(new Date(current));
        current = addDays(current, 1);
      }

      return dates;
    }
  }

  let dates = $derived(getDatesToDisplay());

  // Navigation
  function goToToday() {
    const today = new Date();
    currentDate = today;
    onDateNavigate?.(today);
  }

  function goToPrevious() {
    let newDate: Date;
    if (view === 'day') {
      newDate = addDays(currentDate, -1);
    } else if (view === 'week') {
      newDate = addWeeks(currentDate, -1);
    } else {
      newDate = addMonths(currentDate, -1);
    }
    currentDate = newDate;
    onDateNavigate?.(newDate);
  }

  function goToNext() {
    let newDate: Date;
    if (view === 'day') {
      newDate = addDays(currentDate, 1);
    } else if (view === 'week') {
      newDate = addWeeks(currentDate, 1);
    } else {
      newDate = addMonths(currentDate, 1);
    }
    currentDate = newDate;
    onDateNavigate?.(newDate);
  }

  function handleDateClick(date: Date) {
    onDateClick?.(date);
  }

  function handleViewChange(newView: CalendarView) {
    view = newView;
    onViewChange?.(newView);
  }

  const today = new Date();

  // Référence pour le scroll horizontal en mode semaine et mois
  let calendarGridElement: HTMLDivElement;

  // Centrer sur le jour actuel au chargement
  $effect(() => {
    if (calendarGridElement && currentDate) {
      scrollToCurrentDay();
    }
  });

  function scrollToCurrentDay() {
    if (!calendarGridElement) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const dayIndex = dates.findIndex(date => isSameDay(date, currentDate));
    if (dayIndex === -1) return;

    if (view === 'week') {
      // En mode semaine : scroll horizontal
      const dayWidth = calendarGridElement.scrollWidth / 7;
      const scrollPosition = dayWidth * dayIndex;

      calendarGridElement.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    } else if (view === 'month') {
      // En mode mois : scroll vertical vers le jour
      const dayElements = calendarGridElement.querySelectorAll('.calendar-day');
      const targetDayElement = dayElements[dayIndex] as HTMLElement;

      if (targetDayElement) {
        targetDayElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }
</script>

<div class="calendar">
  <!-- Header avec navigation fusionnée -->
  <div class="calendar-header">
    <div class="calendar-nav">
      <IconButton variant="ghost" size="medium" onclick={goToPrevious} ariaLabel="Précédent">
        <ArrowLeft size={20} />
      </IconButton>

      <h2 class="calendar-title">
        {#if view === 'day'}
          Aujourd'hui
        {:else if view === 'week'}
          Semaine du {formatDate(dates[0])} au {formatDate(dates[6])}
        {:else}
          {formatMonthYear(currentDate)}
        {/if}
      </h2>

      <IconButton variant="ghost" size="medium" onclick={goToNext} ariaLabel="Suivant">
        <ArrowRight size={20} />
      </IconButton>
    </div>

    <div class="view-switcher-container">
      <Button
        variant="ghost"
        size="small"
        onclick={goToToday}
      >
        Aujourd'hui
      </Button>

      <div class="view-switcher">
        <Button
          variant={view === 'day' ? 'primary' : 'outlined'}
          size="small"
          onclick={() => handleViewChange('day')}
        >
          Jour
        </Button>
        <Button
          variant={view === 'week' ? 'primary' : 'outlined'}
          size="small"
          onclick={() => handleViewChange('week')}
        >
          Semaine
        </Button>
        <Button
          variant={view === 'month' ? 'primary' : 'outlined'}
          size="small"
          onclick={() => handleViewChange('month')}
        >
          Mois
        </Button>
      </div>
      {#if headerActions}
        <div class="header-actions">
          {@render headerActions()}
        </div>
      {/if}
    </div>
  </div>

  <!-- Grid du calendrier -->
  <div
    class="calendar-grid"
    class:day-view={view === 'day'}
    class:week-view={view === 'week'}
    class:month-view={view === 'month'}
    bind:this={calendarGridElement}
  >
    {#if view === 'month'}
      <!-- En-têtes des jours de la semaine -->
      {#each Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i)) as date}
        <div class="day-header">{formatDayName(date)}</div>
      {/each}
    {/if}

    {#each dates as date}
      {@const mealPlan = getMealPlanForDate(date)}
      {@const isToday = isSameDay(date, today)}
      {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}
      {@const sortedItems = mealPlan ? sortMealItems(mealPlan.items) : []}

      <div
        class="calendar-day"
        class:today={isToday}
        class:other-month={view === 'month' && !isCurrentMonth}
        class:has-meals={mealPlan && mealPlan.items.length > 0}
        onclick={() => handleDateClick(date)}
      >
        <div class="day-number">
          {#if view === 'week' || view === 'day'}
            <span class="day-name">{formatDayName(date)}</span>
          {/if}
          {date.getDate()}
        </div>

        {#if mealPlan}
          <div class="meals-preview">
            {#each sortedItems.slice(0, 3) as item}
              <ListItem
                title={item.recipe?.label || 'Sans recette'}
                subtitle={item.servings ? `${item.servings} personne${item.servings > 1 ? 's' : ''}` : undefined}
                showThumbnail={false}
                layout="column"
                onEdit={() => onMealEdit?.(item)}
                onDelete={() => onMealDelete?.(item)}
                onClick={() => onMealEdit?.(item)}
              >
                {#snippet badge()}
                  {#if item.isExceptional && item.customSlotName}
                    <Badge variant="warning" size="xs">{item.customSlotName}</Badge>
                  {:else}
                    <Badge variant={MealSlotColors[item.slot]} size="xs">{slotConfigs.find(c => c.slot === item.slot)?.label || item.slot}</Badge>
                  {/if}
                {/snippet}
              </ListItem>
            {/each}
            {#if sortedItems.length > 3}
              <div class="more-meals">+{sortedItems.length - 3} repas</div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  $primary-color: $brand-primary;
  $secondary-color: $brand-secondary;
  $success-color: $color-success;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $border-color: $color-gray-200;
  $today-color: $color-warning;
  $spacing-base: 1rem;

  .calendar {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
    background: $white;
    border-radius: 16px;
    padding: $spacing-base;
    box-shadow: 0 2px 12px $color-black-alpha-08;
    min-width: 0; // Permet au calendrier de rétrécir
    overflow: hidden;

    @media (min-width: 768px) {
      padding: $spacing-base * 2;
    }
  }

  .calendar-header {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .calendar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-base;
    flex: 1;

    @media (min-width: 768px) {
      justify-content: flex-start;
      flex: 0 1 auto;
    }
  }

  .calendar-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-dark;
    margin: 0;
    text-transform: capitalize;
    text-align: center;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 768px) {
      font-size: $font-size-xl;
    }
  }

  .view-switcher-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
  }

  .view-switcher {
    display: flex;
    gap: $spacing-2xs;
    background: rgba($brand-primary, 0.1);
    padding: $spacing-2xs;
    border-radius: $radius-md;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .view-btn {
    padding: $spacing-base * 0.5 $spacing-base;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    color: $text-gray;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba($brand-primary, 0.15);
      color: $primary-color;
    }

    &.active {
      background: $primary-color;
      color: $white;
    }
  }

  .calendar-grid {
    display: grid;
    gap: $spacing-base * 0.5;
    min-width: 0;

    @media (min-width: 768px) {
      gap: $spacing-base * 0.75;
    }

    &.day-view {
      grid-template-columns: 1fr;
    }

    &.week-view {
      // Mobile: 1 jour visible + 0.3 jour de preview à droite
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-left: 0;
      gap: $spacing-base * 0.5;
      padding-right: $spacing-base;

      // Masquer la scrollbar mais garder le scroll
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .calendar-day {
        // Chaque jour fait 83.33% de la largeur (1 jour + 0.2 du suivant = 1.2 jours visibles)
        flex: 0 0 83.33%;
        scroll-snap-align: start;

        &:last-child {
          // Le dernier jour peut prendre toute la largeur
          flex: 0 0 100%;
        }
      }

      @media (min-width: 768px) {
        // Desktop: grille normale avec 7 colonnes
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        overflow-x: visible;
        scroll-snap-type: none;
        gap: $spacing-base * 0.75;
        padding-right: 0;

        .calendar-day {
          flex: unset;
        }
      }
    }

    &.month-view {
      // Mobile: vue jour par défaut ou grille compacte avec scroll
      grid-template-columns: 1fr;
      max-height: 70vh;
      overflow-y: auto;
      scroll-behavior: smooth;

      @media (min-width: 768px) {
        grid-template-columns: repeat(7, 1fr);
        max-height: none;
        overflow-y: visible;
      }

      .day-header {
        @media (max-width: 767px) {
          display: none;
        }
      }
    }
  }

  .day-header {
    padding: $spacing-base * 0.75;
    text-align: center;
    font-weight: 600;
    color: $text-gray;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  .calendar-day {
    min-height: 100px;
    padding: $spacing-base * 0.5;
    border: 2px solid $border-color;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: $white;
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
    min-width: 0;

    @media (min-width: 768px) {
      min-height: 120px;
      padding: $spacing-base * 0.75;
      border-radius: 12px;
    }

    &:hover {
      border-color: $primary-color;
      box-shadow: 0 4px 12px rgba($brand-primary, 0.15);
      transform: translateY(-2px);
    }

    &.today {
      border-color: $today-color;
      background: $color-warning-bright-alpha-05;

      .day-number {
        color: $today-color;
        font-weight: 700;
      }
    }

    &.other-month {
      opacity: 0.4;
    }

    &.has-meals {
      background: rgba($brand-primary, 0.03);
    }
  }

  .day-number {
    font-size: 1.1rem;
    font-weight: 600;
    color: $text-dark;
    display: flex;
    align-items: center;
    gap: $spacing-base * 0.5;

    .day-name {
      font-size: 0.85rem;
      color: $text-gray;
      font-weight: 500;
      text-transform: uppercase;
    }
  }

  .meals-preview {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.4;
    flex: 1;
  }

  .meal-preview-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-base * 0.5;
    padding: $spacing-base * 0.5;
    background: rgba($brand-primary, 0.08);
    border-radius: 6px;
    font-size: 0.85rem;
    transition: background 0.2s;

    &:hover {
      background: rgba($brand-primary, 0.12);
    }
  }

  .meal-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.25;
    flex: 1;
    min-width: 0; // Pour permettre le text-overflow
  }

  .meal-actions {
    display: flex;
    gap: $spacing-base * 0.25;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .meal-preview-item:hover .meal-actions {
    opacity: 1;
  }

  .meal-action-btn {
    background: none;
    border: none;
    padding: $spacing-base * 0.25;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: $color-black-alpha-10;
    }

    &.edit {
      &:hover {
        background: rgba($brand-primary, 0.2);
      }
    }

    &.delete {
      &:hover {
        background: $color-danger-alpha-20;
      }
    }
  }

  .recipe-name {
    color: $text-dark;
    font-weight: 500;
  }

  .more-meals {
    font-size: 0.75rem;
    color: $text-gray;
    font-style: italic;
    padding: $spacing-base * 0.25;
  }
</style>
