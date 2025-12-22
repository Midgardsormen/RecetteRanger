<script lang="ts">
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../../../types/meal-plan.types';
  import { Button, IconButton } from '../../../../components/ui';
  import { ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { addDays, addWeeks, addMonths, formatDate, formatMonthYear } from '../../../../utils/date-range.utils';
  import { getDatesToDisplay } from './utils';
  import DayView from './calendar-views/DayView.svelte';
  import WeekView from './calendar-views/WeekView.svelte';
  import MonthView from './calendar-views/MonthView.svelte';

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
    onMealDuplicate?: (item: any) => void;
    onDayDuplicate?: (date: Date) => void;
    showHeader?: boolean;
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
    onMealDuplicate,
    onDayDuplicate,
    showHeader = true
  }: Props = $props();

  let dates = $derived(getDatesToDisplay(currentDate, view));

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

  function handleViewChange(newView: CalendarView) {
    view = newView;
    onViewChange?.(newView);
  }
</script>

<div class="calendar">
  <!-- Header avec navigation fusionnée (affiché si showHeader est true) -->
  {#if showHeader}
    <div class="calendar__header">
      <div class="calendar__nav">
        <IconButton variant="ghost" size="medium" onclick={goToPrevious} ariaLabel="Précédent">
          <ArrowLeft size={20} />
        </IconButton>

        <h2 class="calendar__title">
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

      <div class="calendar__view-switcher-container">
        <Button
          variant="ghost"
          size="small"
          onclick={goToToday}
        >
          Aujourd'hui
        </Button>

        <div class="calendar__view-switcher">
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
      </div>
    </div>
  {/if}

  <!-- Vue du calendrier selon le mode sélectionné -->
  <div class="calendar__content">
    {#if view === 'day'}
      <DayView
        {currentDate}
        {mealPlanDays}
        {slotConfigs}
        {onDateClick}
        {onMealEdit}
        {onMealDelete}
        {onMealDuplicate}
        {onDayDuplicate}
      />
    {:else if view === 'week'}
      <WeekView
        {currentDate}
        {mealPlanDays}
        {slotConfigs}
        {onDateClick}
        {onMealEdit}
        {onMealDelete}
        {onMealDuplicate}
        {onDayDuplicate}
      />
    {:else}
      <MonthView
        {currentDate}
        {mealPlanDays}
        {slotConfigs}
        {onDateClick}
        {onMealEdit}
        {onMealDelete}
        {onMealDuplicate}
        {onDayDuplicate}
      />
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  // Block: calendar
  .calendar {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
    background: $color-white;
    border-radius: $radius-xl;
    padding: $spacing-base;
    box-shadow: 0 2px 12px $color-black-alpha-08;
    min-width: 0;
    overflow: hidden;

    @media (min-width: $breakpoint-md) {
      padding: $spacing-xl;
      gap: $spacing-lg;
    }

    // Element: header
    &__header {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      @media (min-width: $breakpoint-md) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    // Element: nav
    &__nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-base;
      flex: 1;

      @media (min-width: $breakpoint-md) {
        justify-content: flex-start;
        flex: 0 1 auto;
      }
    }

    // Element: title
    &__title {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      margin: 0;
      text-transform: capitalize;
      text-align: center;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xl;
      }
    }

    // Element: view-switcher-container
    &__view-switcher-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-sm;
    }

    // Element: view-switcher
    &__view-switcher {
      display: flex;
      gap: $spacing-2xs;
      background: $color-primary-alpha-10;
      padding: $spacing-2xs;
      border-radius: $radius-md;
    }

    // Element: content
    &__content {
      min-width: 0;
    }
  }
</style>
