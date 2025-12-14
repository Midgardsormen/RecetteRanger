<script lang="ts">
  import { Drawer, Button, FormField } from '../../../../components/ui';
  import { RadioGroup } from '../../../../components/ui/form';
  import type { MealPlanDay, ConflictMode } from '../../../../types/meal-plan.types';
  import { Calendar, Copy } from 'lucide-svelte';
  import { apiService } from '../../../../services/api.service';

  interface Props {
    isOpen?: boolean;
    sourceDate: Date | null;
    sourceMealPlan?: MealPlanDay | null;
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
  }

  let {
    isOpen = false,
    sourceDate,
    sourceMealPlan = null,
    userId,
    onClose,
    onSuccess
  }: Props = $props();

  // État
  let selectedDates = $state<Date[]>([]);
  let conflictMode = $state<ConflictMode>('skip');
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

  function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
    if (!sourceDate) return;

    // Ne pas permettre de sélectionner la date source
    if (isSameDay(date, sourceDate)) return;

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
    return sourceDate ? isSameDay(date, sourceDate) : false;
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

    if (!sourceDate) {
      alert('Date source manquante');
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
        sourceDate: toUTCMidnight(sourceDate),
        targetDates: selectedDates.map(d => toUTCMidnight(d)),
        conflictMode
      };

      const results = await apiService.duplicateMeals(userId, data);

      // Compter les succès et les échecs
      const successes = results.filter((r: any) => r.status === 'success').length;
      const skipped = results.filter((r: any) => r.status === 'skipped').length;

      let message = '';
      if (successes > 0) {
        message += `✓ ${successes} date(s) dupliquée(s) avec succès`;
      }
      if (skipped > 0) {
        if (message) message += '\n';
        message += `⚠ ${skipped} date(s) ignorée(s) (repas déjà existants)`;
      }

      alert(message);
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
    conflictMode = 'skip';
    currentMonth = new Date();
  }

  // Réinitialiser quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      resetForm();
      if (sourceDate) {
        currentMonth = new Date(sourceDate);
      }
    }
  });

  const today = new Date();
</script>

<Drawer
  {isOpen}
  title="Dupliquer les repas"
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
    {#if sourceDate && sourceMealPlan}
      <div class="source-info">
        <div class="source-info__header">
          <Calendar size={20} />
          <span>Source : {sourceDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <p class="source-info__count">{sourceMealPlan.items.length} repas à dupliquer</p>
      </div>

      <RadioGroup
        name="conflictMode"
        label="Que faire si des repas existent déjà aux dates cibles ?"
        bind:value={conflictMode}
        options={[
          { value: 'skip', label: 'Ignorer (ne pas dupliquer sur ces dates)' },
          { value: 'replace', label: 'Remplacer (supprimer les repas existants)' }
        ]}
        variant="inverse"
      />

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
              disabled={isSource}
              onclick={() => toggleDate(date)}
            >
              {date.getDate()}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <p class="no-source">Aucune date source sélectionnée</p>
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
      text-transform: capitalize;
    }

    &__count {
      color: $color-white-alpha-90;
      font-size: $font-size-sm;
      margin: 0;
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
        transform: scale(1.05);
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
        cursor: not-allowed;
        font-weight: $font-weight-semibold;
      }

      &.today:not(.source):not(.selected) {
        border-color: $color-warning;
        border-width: 2px;
      }

      &.other-month {
        opacity: 0.3;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
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
