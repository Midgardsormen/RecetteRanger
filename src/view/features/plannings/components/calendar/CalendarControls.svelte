<script lang="ts">
  import type { CalendarView } from '../../../../types/meal-plan.types';
  import { Button, IconButton, DropdownMenu } from '../../../../components/ui';
  import { ArrowLeft, ArrowRight, Settings, CalendarDays } from 'lucide-svelte';
  import type { DropdownMenuItem } from '../../../../types/ui.types';
  import { addDays, addWeeks, addMonths, formatDate, formatMonthYear } from '../../../../utils/date-range.utils';

  interface Props {
    view?: CalendarView;
    currentDate?: Date;
    dates?: Date[];
    onViewChange?: (view: CalendarView) => void;
    onDateNavigate?: (date: Date) => void;
    settingsMenuItems?: DropdownMenuItem[];
  }

  let {
    view = $bindable('week'),
    currentDate = $bindable(new Date()),
    dates = [],
    onViewChange,
    onDateNavigate,
    settingsMenuItems = []
  }: Props = $props();

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

<div class="calendar-controls">
  <div class="calendar-controls__nav">
    <IconButton variant="ghost-inverse" size="medium" onclick={goToPrevious} ariaLabel="Précédent">
      <ArrowLeft size={20} />
    </IconButton>

    <h2 class="calendar-controls__title">
      {#if view === 'day'}
        Aujourd'hui
      {:else if view === 'week' && dates.length >= 7}
        Semaine du {formatDate(dates[0])} au {formatDate(dates[6])}
      {:else}
        {formatMonthYear(currentDate)}
      {/if}
    </h2>

    <IconButton variant="ghost-inverse" size="medium" onclick={goToNext} ariaLabel="Suivant">
      <ArrowRight size={20} />
    </IconButton>
  </div>

  <div class="calendar-controls__actions">
    <!-- Mobile: IconButton uniquement -->
    <div class="today-button--mobile">
      <IconButton
        variant="ghost-inverse"
        size="small"
        onclick={goToToday}
        ariaLabel="Aujourd'hui"
      >
        <CalendarDays size={18} />
      </IconButton>
    </div>

    <!-- Desktop: Button avec texte -->
    <div class="today-button--desktop">
      <Button
        variant="ghost-inverse"
        size="small"
        onclick={goToToday}
      >
        <CalendarDays size={18} />
        Aujourd'hui
      </Button>
    </div>

    <div class="calendar-controls__view-switcher">
      <Button
        variant={view === 'day' ? 'primary-inverse' : 'outlined-inverse'}
        size="small"
        onclick={() => handleViewChange('day')}
      >
        <span class="view-label--short">J</span>
        <span class="view-label--full">Jour</span>
      </Button>
      <Button
        variant={view === 'week' ? 'primary-inverse' : 'outlined-inverse'}
        size="small"
        onclick={() => handleViewChange('week')}
      >
        <span class="view-label--short">S</span>
        <span class="view-label--full">Semaine</span>
      </Button>
      <Button
        variant={view === 'month' ? 'primary-inverse' : 'outlined-inverse'}
        size="small"
        onclick={() => handleViewChange('month')}
      >
        <span class="view-label--short">M</span>
        <span class="view-label--full">Mois</span>
      </Button>
    </div>

    {#if settingsMenuItems.length > 0}
      <DropdownMenu items={settingsMenuItems} align="right">
        {#snippet trigger()}
          <IconButton
            variant="ghost-inverse"
            size="small"
            ariaLabel="Paramètres"
          >
            <Settings size={18} />
          </IconButton>
        {/snippet}
      </DropdownMenu>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  .calendar-controls {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .calendar-controls__nav {
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

  .calendar-controls__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-white;
    margin: 0;
    text-transform: capitalize;
    text-align: center;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    @media (min-width: 768px) {
      font-size: $font-size-xl;
    }
  }

  .calendar-controls__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
  }

  .calendar-controls__view-switcher {
    display: flex;
    gap: $spacing-2xs;
    background: rgba($color-white, 0.1);
    padding: $spacing-2xs;
    border-radius: $radius-md;
    backdrop-filter: blur(10px);

    // Labels des boutons de vue - version courte/complète selon taille d'écran
    .view-label--short {
      display: inline;

      @media (min-width: 360px) {
        display: none;
      }
    }

    .view-label--full {
      display: none;

      @media (min-width: 360px) {
        display: inline;
      }
    }
  }

  // Bouton "Aujourd'hui" - IconButton en mobile, Button avec texte en desktop
  .today-button--mobile {
    display: block;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .today-button--desktop {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }

    :global(.button) {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }
  }
</style>
