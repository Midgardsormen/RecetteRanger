<script lang="ts">
  import type { CalendarView, MealPlanDay, MealSlotConfig } from '../../../../types/meal-plan.types';
  import { MealSlotColors } from '../../../../types/meal-plan.types';
  import { Button, IconButton, Badge, ListItem } from '../../../../components/ui';
  import { ArrowLeft, ArrowRight, Pencil, Trash2, Copy } from 'lucide-svelte';
  import {
    startOfWeek,
    startOfMonth,
    addDays,
    addWeeks,
    addMonths,
    isSameDay,
    formatDate,
    formatDayName,
    formatMonthYear
  } from '../../../../utils/date-range.utils';
  import { getMealPlanForDate, sortMealItems, getDatesToDisplay } from './utils';

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
      // En mode mois : scroll vertical avec 40px du jour précédent visible
      const scrollContainer = calendarGridElement.querySelector('.month-view-scroll-container') as HTMLElement;
      if (!scrollContainer) return;

      const dayElements = scrollContainer.querySelectorAll('.calendar-day');
      const targetDayElement = dayElements[dayIndex] as HTMLElement;

      if (targetDayElement) {
        // Calculer la position pour avoir 40px du jour précédent visible
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const dayTop = targetDayElement.getBoundingClientRect().top;
        const currentScroll = scrollContainer.scrollTop;
        const offset = 40; // 40px du jour précédent visible

        const scrollPosition = currentScroll + (dayTop - containerTop) - offset;

        scrollContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }
</script>

<div class="calendar">
  <!-- Header avec navigation fusionnée (affiché si showHeader est true) -->
  {#if showHeader}
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
      </div>
    </div>
  {/if}

  <!-- Grid du calendrier -->
  <div
    class="calendar-grid"
    class:day-view={view === 'day'}
    class:week-view={view === 'week'}
    class:month-view={view === 'month'}
    bind:this={calendarGridElement}
  >
    {#if view === 'month'}
      <!-- En-têtes des jours de la semaine (en dehors du scroll en mobile) -->
      <div class="month-view-header">
        {#each Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i)) as date}
          <div class="day-header">{formatDayName(date)}</div>
        {/each}
      </div>

      <!-- Conteneur scrollable pour les jours en mobile -->
      <div class="month-view-scroll-container">
        {#each dates as date}
      {@const mealPlan = getMealPlanForDate(mealPlanDays, date)}
      {@const isToday = isSameDay(date, today)}
      {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}
      {@const sortedItems = mealPlan ? sortMealItems(mealPlan.items, slotConfigs) : []}

      <div
        class="calendar-day"
        class:today={isToday}
        class:other-month={view === 'month' && !isCurrentMonth}
        class:has-meals={mealPlan && mealPlan.items.length > 0}
        onclick={() => handleDateClick(date)}
      >
        <div class="day-header-row">
          <div class="day-number">
            {#if view === 'week' || view === 'day'}
              <span class="day-name">{formatDayName(date)}</span>
            {/if}
            {date.getDate()}
          </div>
          {#if mealPlan && mealPlan.items.length > 0 && onDayDuplicate}
            <IconButton
              variant="ghost"
              size="small"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                onDayDuplicate?.(date);
              }}
              ariaLabel="Dupliquer ce jour"
            >
              <Copy size={16} />
            </IconButton>
          {/if}
        </div>

        {#if mealPlan}
          <div class="meals-preview">
            {#each sortedItems as item}
              <ListItem
                title={item.menu ? item.menu.name : (item.ingredient ? item.ingredient.label : (item.recipe?.label || 'Sans recette'))}
                subtitle={item.menu ? `${item.menu.items?.length || 0} item${item.menu.items?.length > 1 ? 's' : ''}` : (item.ingredient ? `${item.quantity || ''} ${item.unit || ''}`.trim() : (item.servings ? `${item.servings} personne${item.servings > 1 ? 's' : ''}` : undefined))}
                showThumbnail={false}
                layout="column"
                size="compact"
                onEdit={() => onMealEdit?.(item)}
                onDelete={() => onMealDelete?.(item)}
                onDuplicate={() => onMealDuplicate?.(item)}
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
          </div>
        {/if}
      </div>
        {/each}
      </div>
    {:else}
      {#each dates as date}
      {@const mealPlan = getMealPlanForDate(mealPlanDays, date)}
      {@const isToday = isSameDay(date, today)}
      {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}
      {@const sortedItems = mealPlan ? sortMealItems(mealPlan.items, slotConfigs) : []}

      <div
        class="calendar-day"
        class:today={isToday}
        class:other-month={view === 'month' && !isCurrentMonth}
        class:has-meals={mealPlan && mealPlan.items.length > 0}
        onclick={() => handleDateClick(date)}
      >
        <div class="day-header-row">
          <div class="day-number">
            {#if view === 'week' || view === 'day'}
              <span class="day-name">{formatDayName(date)}</span>
            {/if}
            {date.getDate()}
          </div>
          {#if mealPlan && mealPlan.items.length > 0 && onDayDuplicate}
            <IconButton
              variant="ghost"
              size="small"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                onDayDuplicate?.(date);
              }}
              ariaLabel="Dupliquer ce jour"
            >
              <Copy size={16} />
            </IconButton>
          {/if}
        </div>

        {#if mealPlan}
          <div class="meals-preview">
            {#each sortedItems as item}
              <ListItem
                title={item.menu ? item.menu.name : (item.ingredient ? item.ingredient.label : (item.recipe?.label || 'Sans recette'))}
                subtitle={item.menu ? `${item.menu.items?.length || 0} item${item.menu.items?.length > 1 ? 's' : ''}` : (item.ingredient ? `${item.quantity || ''} ${item.unit || ''}`.trim() : (item.servings ? `${item.servings} personne${item.servings > 1 ? 's' : ''}` : undefined))}
                showThumbnail={false}
                layout="column"
                size="compact"
                onEdit={() => onMealEdit?.(item)}
                onDelete={() => onMealDelete?.(item)}
                onDuplicate={() => onMealDuplicate?.(item)}
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
          </div>
        {/if}
      </div>
    {/each}
    {/if}
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
      // Mobile: flex container pour header + scroll
      @media (max-width: 767px) {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      @media (min-width: 768px) {
        grid-template-columns: repeat(7, 1fr);
      }
    }
  }

  // En-tête du mois (jours de la semaine) en mode month
  .month-view-header {
    display: none;

    @media (max-width: 767px) {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: $spacing-2xs;
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      display: contents;
    }
  }

  // Conteneur scrollable pour les jours en mode month mobile
  .month-view-scroll-container {
    @media (max-width: 767px) {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 0.5;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;

      // Masquer la scrollbar mais garder le scroll
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      // Gradient fade au dessus (pour indiquer qu'il y a du contenu au-dessus)
      &::before {
        content: '';
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(to bottom, $white 0%, rgba($white, 0) 100%);
        pointer-events: none;
        z-index: 1;
        display: block;
      }

      // Gradient fade en dessous (pour indiquer qu'il y a du contenu en-dessous)
      &::after {
        content: '';
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(to top, $white 0%, rgba($white, 0) 100%);
        pointer-events: none;
        z-index: 1;
        display: block;
      }
    }

    @media (min-width: 768px) {
      display: contents;
    }
  }

  .calendar-grid {
    .day-header {
      @media (max-width: 767px) {
        display: none;
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

  .day-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-xs;
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
    gap: $spacing-xs;
    flex: 1;
  }
</style>
