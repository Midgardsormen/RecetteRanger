<script lang="ts">
  import { Drawer, Button } from '../../../../components/ui';
  import { Calendar, Copy } from 'lucide-svelte';
  import { apiService } from '../../../../services/api.service';
  import type { MealPlanItem } from '../../../../types/meal-plan.types';

  interface Props {
    isOpen?: boolean;
    sourceMeal: MealPlanItem | null;
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
  }

  let {
    isOpen = false,
    sourceMeal = null,
    userId,
    onClose,
    onSuccess
  }: Props = $props();

  // État
  let selectedDates = $state<Date[]>([]);
  let duplicating = $state(false);
  let currentMonth = $state(new Date());
  let tempSelectedDates = $state<Set<string>>(new Set()); // Format YYYY-MM-DD

  // Fonctions utilitaires de date
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

  function formatMonthYear(date: Date): string {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  function toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function fromDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi = premier jour
    return new Date(d.setDate(diff));
  }

  // Générer les jours du mois
  function getDaysInMonth(): Date[] {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfMonth(currentMonth);
    const days: Date[] = [];
    let current = start;

    while (current <= end || days.length < 35) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    return days;
  }

  let daysInMonth = $derived(getDaysInMonth());

  // Toggle sélection d'une date
  function toggleDate(date: Date) {
    const dateStr = toDateString(date);
    const newSet = new Set(tempSelectedDates);

    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }

    tempSelectedDates = newSet;
    selectedDates = Array.from(newSet).map(fromDateString);
  }

  function isDateSelected(date: Date): boolean {
    return tempSelectedDates.has(toDateString(date));
  }

  function isSourceDate(date: Date): boolean {
    return sourceMeal?.day ? isSameDay(new Date(sourceMeal.day.date), date) : false;
  }

  // Navigation mois
  function goToPreviousMonth() {
    currentMonth = addMonths(currentMonth, -1);
  }

  function goToNextMonth() {
    currentMonth = addMonths(currentMonth, 1);
  }

  function goToCurrentMonth() {
    currentMonth = new Date();
  }

  // Soumettre la duplication
  async function handleDuplicate() {
    if (selectedDates.length === 0) {
      alert('Veuillez sélectionner au moins une date cible');
      return;
    }

    if (!sourceMeal) {
      alert('Repas source manquant');
      return;
    }

    duplicating = true;

    try {
      // Convertir les dates en UTC à minuit
      const toUTCMidnight = (date: Date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString();
      };

      const data = {
        sourceMealItemId: sourceMeal.id,
        targetDates: selectedDates.map(d => toUTCMidnight(d))
      };

      const results = await apiService.duplicateSingleMeal(userId, data);

      // Compter les succès
      const successes = results.filter((r: any) => r.status === 'success').length;

      alert(`✓ Repas dupliqué sur ${successes} date(s) avec succès`);
      resetForm();
      onSuccess();
    } catch (err: any) {
      console.error('Erreur lors de la duplication:', err);
      alert('Erreur lors de la duplication: ' + err.message);
    } finally {
      duplicating = false;
    }
  }

  function resetForm() {
    selectedDates = [];
    tempSelectedDates = new Set();
    currentMonth = new Date();
  }

  // Réinitialiser quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
      if (sourceMeal?.day) {
        currentMonth = new Date(sourceMeal.day.date);
      }
    }
  });

  const today = new Date();

  // Obtenir le label du repas
  function getMealLabel(meal: MealPlanItem | null): string {
    if (!meal) return '';
    if (meal.menu) return meal.menu.name;
    if (meal.recipe) return meal.recipe.label;
    if (meal.ingredient) return meal.ingredient.label;
    return 'Repas';
  }
</script>

<Drawer
  {isOpen}
  title="Dupliquer le repas"
  onClose={onClose}
  primaryAction={{
    label: 'Dupliquer',
    onClick: handleDuplicate,
    disabled: duplicating || selectedDates.length === 0,
    loading: duplicating,
    icon: Copy
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <div class="duplicate-drawer">
    {#if sourceMeal}
      <div class="source-info">
        <div class="source-info__header">
          <Calendar size={20} />
          <span>Repas à dupliquer</span>
        </div>
        <p class="source-info__meal">{getMealLabel(sourceMeal)}</p>
        {#if sourceMeal.day}
          <p class="source-info__date">
            {new Date(sourceMeal.day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        {/if}
      </div>

      <div class="date-selector">
        <div class="date-selector__header">
          <h3>Sélectionner les dates cibles ({selectedDates.length} sélectionnée{selectedDates.length > 1 ? 's' : ''})</h3>
          <div class="month-nav">
            <button type="button" onclick={goToPreviousMonth} class="month-nav__btn">‹</button>
            <button type="button" onclick={goToCurrentMonth} class="month-nav__current">{formatMonthYear(currentMonth)}</button>
            <button type="button" onclick={goToNextMonth} class="month-nav__btn">›</button>
          </div>
        </div>

        <div class="calendar-mini">
          <!-- En-têtes des jours -->
          {#each ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as dayName}
            <div class="calendar-mini__day-header">{dayName}</div>
          {/each}

          <!-- Jours du mois -->
          {#each daysInMonth as date}
            {@const isSelected = isDateSelected(date)}
            {@const isSource = isSourceDate(date)}
            {@const isToday = isSameDay(date, today)}
            {@const isCurrentMonth = date.getMonth() === currentMonth.getMonth()}

            <button
              type="button"
              class="calendar-mini__day"
              class:selected={isSelected}
              class:source={isSource}
              class:today={isToday}
              class:other-month={!isCurrentMonth}
              onclick={() => toggleDate(date)}
            >
              {date.getDate()}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <p class="no-source">Aucun repas sélectionné</p>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  .duplicate-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .source-info {
    background: $color-white-alpha-10;
    border: 1px solid $color-white-alpha-30;
    border-radius: $radius-lg;
    padding: $spacing-base;

    &__header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      color: $color-white;
      font-weight: $font-weight-semibold;
      margin-bottom: $spacing-xs;
    }

    &__meal {
      color: $color-white;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      margin: 0 0 $spacing-2xs 0;
    }

    &__date {
      color: $color-white-alpha-90;
      font-size: $font-size-sm;
      margin: 0;
      text-transform: capitalize;
    }
  }

  .date-selector {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;

    &__header {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      h3 {
        margin: 0;
        color: $color-white;
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
      }
    }
  }

  .month-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;

    &__btn {
      background: $color-white-alpha-10;
      border: 1px solid $color-white-alpha-30;
      border-radius: $radius-md;
      padding: $spacing-xs $spacing-base;
      color: $color-white;
      font-size: $font-size-lg;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        background: $color-white-alpha-15;
        border-color: $color-white;
      }
    }

    &__current {
      flex: 1;
      background: transparent;
      border: none;
      color: $color-white;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      text-transform: capitalize;
      cursor: pointer;
      padding: $spacing-xs;
      transition: color $transition-base;

      &:hover {
        color: $color-white;
        text-decoration: underline;
      }
    }
  }

  .calendar-mini {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: $spacing-2xs;
    background: $color-white-alpha-10;
    padding: $spacing-base;
    border-radius: $radius-md;

    &__day-header {
      text-align: center;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      color: $color-white-alpha-90;
      padding: $spacing-2xs;
    }

    &__day {
      aspect-ratio: 1;
      border: 1px solid $color-white-alpha-30;
      border-radius: $radius-sm;
      background: $color-white-alpha-10;
      color: $color-white;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: all $transition-base;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:hover:not(:disabled) {
        background: $color-white-alpha-20;
        border-color: $color-white;
      }

      &.selected {
        background: $brand-primary;
        border-color: $brand-primary;
        color: $color-white;
        font-weight: $font-weight-semibold;
      }

      &.source {
        background: $color-warning;
        border-color: $color-warning;
        color: $color-gray-900;
        font-weight: $font-weight-semibold;
      }

      &.today:not(.source):not(.selected) {
        border-color: $color-warning;
        border-width: 2px;
      }

      &.other-month {
        opacity: 0.3;
      }
    }
  }

  .no-source {
    text-align: center;
    color: $color-white-alpha-90;
    padding: $spacing-xl;
    font-style: italic;
  }
</style>
