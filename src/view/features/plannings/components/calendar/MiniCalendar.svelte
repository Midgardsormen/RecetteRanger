<script lang="ts">
  import type { CalendarView } from '../../../../types/meal-plan.types';

  interface Props {
    currentDate?: Date;
    view?: CalendarView;
    onDateSelect?: (date: Date) => void;
  }

  let {
    currentDate = $bindable(new Date()),
    view = 'month',
    onDateSelect
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

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function formatDayName(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'narrow' });
  }

  // Générer les dates selon la vue
  function getDatesToDisplay(): Date[] {
    if (view === 'week') {
      // En mode semaine : afficher les 7 jours de la semaine courante
      const start = startOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      // En mode mois : afficher le mois complet
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfMonth(currentDate);
      const dates: Date[] = [];
      let current = start;

      while (current <= end || dates.length < 42) {
        dates.push(new Date(current));
        current = addDays(current, 1);

        // Limiter à 6 semaines (42 jours)
        if (dates.length >= 42) break;
      }

      return dates;
    }
  }

  let displayDates = $derived(getDatesToDisplay());
  const today = new Date();

  // Générer les en-têtes de jours (Lun, Mar, Mer, etc.)
  const weekDays = $derived.by(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => formatDayName(addDays(start, i)));
  });

  function handleDateClick(date: Date) {
    currentDate = date;
    onDateSelect?.(date);
  }

  // Référence au conteneur scrollable
  let gridContainer: HTMLDivElement;

  // Auto-scroll vers le jour sélectionné quand il change
  $effect(() => {
    if (gridContainer && currentDate && view === 'month') {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) return;

      // Trouver l'index du jour sélectionné
      const selectedIndex = displayDates.findIndex(date => isSameDay(date, currentDate));
      if (selectedIndex === -1) return;

      // Calculer quelle ligne contient le jour sélectionné (7 jours par ligne)
      const row = Math.floor(selectedIndex / 7);

      // Trouver le bouton du jour sélectionné
      const dayButtons = gridContainer.querySelectorAll('.mini-calendar__day');
      const selectedButton = dayButtons[selectedIndex] as HTMLElement;

      if (selectedButton) {
        // Scroller pour centrer le jour sélectionné
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  });
</script>

<div class="mini-calendar">
  <!-- En-têtes des jours -->
  <div class="mini-calendar__header">
    {#each weekDays as dayName}
      <div class="mini-calendar__day-name">{dayName}</div>
    {/each}
  </div>

  <!-- Conteneur scrollable pour la grille -->
  <div
    bind:this={gridContainer}
    class="mini-calendar__grid-container"
    class:mini-calendar__grid-container--month={view === 'month'}
  >
    <div class="mini-calendar__grid" class:mini-calendar__grid--week={view === 'week'}>
      {#each displayDates as date}
        {@const isToday = isSameDay(date, today)}
        {@const isSelected = isSameDay(date, currentDate)}
        {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}

        <button
          class="mini-calendar__day"
          class:mini-calendar__day--today={isToday}
          class:mini-calendar__day--selected={isSelected}
          class:mini-calendar__day--other-month={!isCurrentMonth}
          onclick={() => handleDateClick(date)}
          type="button"
        >
          {date.getDate()}
        </button>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  .mini-calendar {
    background: $color-white;
    border-radius: $radius-lg;
    padding: $spacing-md;
    box-shadow: 0 2px 8px $color-black-alpha-08;

    &__header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: $spacing-2xs;
      margin-bottom: $spacing-sm;
    }

    &__day-name {
      text-align: center;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      color: $color-gray-600;
      text-transform: uppercase;
      padding: $spacing-2xs;
    }

    &__grid-container {
      // Par défaut, pas de scroll
      overflow: visible;

      &--month {
        // En mode month sur mobile uniquement, limiter la hauteur et activer le scroll
        @media (max-width: 767px) {
          position: relative;
          max-height: 80px;
          overflow-y: auto;
          overflow-x: hidden;

          // Smooth scrolling
          scroll-behavior: smooth;

          // Masquer la scrollbar mais garder le scroll
          scrollbar-width: thin;
          scrollbar-color: rgba($brand-primary, 0.3) transparent;

          &::-webkit-scrollbar {
            width: 4px;
          }

          &::-webkit-scrollbar-track {
            background: transparent;
          }

          &::-webkit-scrollbar-thumb {
            background: rgba($brand-primary, 0.3);
            border-radius: 2px;
          }

          &::-webkit-scrollbar-thumb:hover {
            background: rgba($brand-primary, 0.5);
          }

          // Gradient fade au dessus (pour indiquer qu'il y a du contenu au-dessus)
          &::before {
            content: '';
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(to bottom, $color-white 0%, rgba($color-white, 0) 100%);
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
            height: 20px;
            background: linear-gradient(to top, $color-white 0%, rgba($color-white, 0) 100%);
            pointer-events: none;
            z-index: 1;
            display: block;
          }
        }
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: $spacing-2xs;

      &--week {
        // En mode semaine, afficher en une seule ligne horizontale
        grid-template-rows: 1fr;
      }
    }

    &__day {
      aspect-ratio: 6/5;
      border: none;
      background: transparent;
      border-radius: $radius-sm;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-gray-800;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:hover {
        background: rgba($brand-primary, 0.1);
        color: $brand-primary;
      }

      &--today {
        background: $color-warning-alpha-10;
        color: $color-warning;
        font-weight: $font-weight-bold;

        &:hover {
          background: $color-warning-alpha-30;
        }
      }

      &--selected {
        background: $brand-primary;
        color: $color-white;
        font-weight: $font-weight-bold;

        &:hover {
          background: darken($brand-primary, 10%);
        }
      }

      &--other-month {
        color: $color-gray-400;
        opacity: 0.5;
      }
    }
  }
</style>
