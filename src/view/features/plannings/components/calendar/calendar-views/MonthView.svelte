<script lang="ts">
  import type { MealPlanDay, MealSlotConfig } from '../../../../../types/meal-plan.types';
  import { MealSlotColors } from '../../../../../types/meal-plan.types';
  import { Badge, ListItem, IconButton } from '../../../../../components/ui';
  import { Copy, Plus, Eraser } from 'lucide-svelte';
  import { startOfWeek, startOfMonth, endOfMonth, addDays, isSameDay, formatDayName } from '../../../../../utils/date-range.utils';
  import { getMealPlanForDate, sortMealItems } from '../utils';

  interface Props {
    currentDate: Date;
    mealPlanDays: MealPlanDay[];
    slotConfigs: MealSlotConfig[];
    onDateClick?: (date: Date) => void;
    onMealEdit?: (item: any) => void;
    onMealDelete?: (item: any) => void;
    onMealDuplicate?: (item: any) => void;
    onDayDuplicate?: (date: Date) => void;
    onDayDelete?: (date: Date) => void;
  }

  let {
    currentDate,
    mealPlanDays,
    slotConfigs,
    onDateClick,
    onMealEdit,
    onMealDelete,
    onMealDuplicate,
    onDayDuplicate,
    onDayDelete
  }: Props = $props();

  const dates = $derived.by(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfMonth(currentDate);
    const datesList: Date[] = [];
    let current = start;

    while (current <= end || datesList.length < 35) {
      datesList.push(new Date(current));
      current = addDays(current, 1);
    }

    return datesList;
  });

  const weekDays = $derived.by(() => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => formatDayName(addDays(start, i)));
  });

  const today = new Date();

  function handleItemClick(item: any) {
    if (item.menu) {
      window.location.href = `/menus/${item.menu.id}`;
    } else if (item.recipe) {
      window.location.href = `/recettes/${item.recipe.id}`;
    } else if (item.ingredient) {
      window.location.href = `/ingredients/${item.ingredient.id}`;
    }
  }

  // Référence au conteneur scrollable
  let scrollContainerElement: HTMLDivElement;

  // Auto-scroll vers le jour sélectionné
  $effect(() => {
    if (scrollContainerElement && currentDate) {
      scrollToCurrentDay();
    }
  });

  function scrollToCurrentDay() {
    if (!scrollContainerElement) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const dayIndex = dates.findIndex(date => isSameDay(date, currentDate));
    if (dayIndex === -1) return;

    const dayElements = scrollContainerElement.querySelectorAll('.month-view__day');
    const targetDayElement = dayElements[dayIndex] as HTMLElement;

    if (targetDayElement) {
      // Calculer la position pour avoir 40px du jour précédent visible
      const containerTop = scrollContainerElement.getBoundingClientRect().top;
      const dayTop = targetDayElement.getBoundingClientRect().top;
      const currentScroll = scrollContainerElement.scrollTop;
      const offset = 40; // 40px du jour précédent visible

      const scrollPosition = currentScroll + (dayTop - containerTop) - offset;

      scrollContainerElement.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }
</script>

<div class="month-view">
  <!-- En-têtes des jours de la semaine (en dehors du scroll en mobile) -->
  <div class="month-view__header">
    {#each weekDays as dayName}
      <div class="month-view__header-day">{dayName}</div>
    {/each}
  </div>

  <!-- Conteneur scrollable pour les jours en mobile -->
  <div class="month-view__scroll-container" bind:this={scrollContainerElement}>
    <div class="month-view__grid">
      {#each dates as date}
        {@const mealPlan = getMealPlanForDate(mealPlanDays, date)}
        {@const isToday = isSameDay(date, today)}
        {@const isSelected = isSameDay(date, currentDate)}
        {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}
        {@const sortedItems = mealPlan ? sortMealItems(mealPlan.items, slotConfigs) : []}

        <div
          class="month-view__day"
          class:month-view__day--today={isToday}
          class:month-view__day--selected={isSelected}
          class:month-view__day--other-month={!isCurrentMonth}
          class:month-view__day--has-meals={mealPlan && mealPlan.items.length > 0}
        >
          <div class="month-view__day-header">
            <div class="month-view__day-number">
              {date.getDate()}
            </div>
            <div class="month-view__day-header-actions">
              <IconButton
                variant="ghost"
                size="small"
                onclick={(e: MouseEvent) => {
                  e.stopPropagation();
                  onDateClick?.(date);
                }}
                ariaLabel="Ajouter un repas"
              >
                <Plus size={12} />
              </IconButton>
              {#if mealPlan && mealPlan.items.length > 0}
                {#if onDayDuplicate}
                  <IconButton
                    variant="ghost"
                    size="small"
                    onclick={(e: MouseEvent) => {
                      e.stopPropagation();
                      onDayDuplicate?.(date);
                    }}
                    ariaLabel="Dupliquer ce jour"
                  >
                    <Copy size={12} />
                  </IconButton>
                {/if}
                {#if onDayDelete}
                  <IconButton
                    variant="danger"
                    size="small"
                    onclick={(e: MouseEvent) => {
                      e.stopPropagation();
                      onDayDelete?.(date);
                    }}
                    ariaLabel="Vider ce jour"
                  >
                    <Eraser size={12} />
                  </IconButton>
                {/if}
              {/if}
            </div>
          </div>

          {#if mealPlan}
            <div class="month-view__meals">
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
                  onClick={() => handleItemClick(item)}
                >
                  {#snippet header()}
                  {/snippet}

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
  </div>
</div>

<style lang="scss">
  @use '../../../../../styles/variables' as *;

  // Block: month-view
  .month-view {
    display: flex;
    flex-direction: column;
    gap: 0;

    // Element: header (jours de la semaine)
    &__header {
      display: none;

      @media (max-width: $breakpoint-md - 1) {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: $spacing-2xs;
        flex-shrink: 0;
        margin-bottom: $spacing-sm;
      }

      @media (min-width: $breakpoint-md) {
        display: contents;
      }
    }

    // Element: header-day
    &__header-day {
      text-align: center;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      color: $color-text-secondary;
      text-transform: uppercase;
      padding: $spacing-2xs;

      @media (min-width: $breakpoint-md) {
        padding: $spacing-md;
        font-size: $font-size-sm;
      }
    }

    // Element: scroll-container (scrollable en mobile)
    &__scroll-container {
      @media (max-width: $breakpoint-md - 1) {
        position: relative;
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;
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

        // Gradient fade au dessus
        &::before {
          content: '';
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to bottom, $color-white 0%, rgba($color-white, 0) 100%);
          pointer-events: none;
          z-index: 1;
          display: block;
        }

        // Gradient fade en dessous
        &::after {
          content: '';
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, $color-white 0%, rgba($color-white, 0) 100%);
          pointer-events: none;
          z-index: 1;
          display: block;
        }
      }

      @media (min-width: $breakpoint-md) {
        overflow: visible;
      }
    }

    // Element: grid
    &__grid {
      // Mobile: 1 colonne
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-sm;

      @media (min-width: $breakpoint-md) {
        // Desktop: grille 7 colonnes
        grid-template-columns: repeat(7, 1fr);
        gap: $spacing-md;
      }
    }

    // Element: day
    &__day {
      min-height: 100px;
      padding: $spacing-sm;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      transition: all $transition-base;
      background: $color-background-primary;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      min-width: 0;

      @media (min-width: $breakpoint-md) {
        min-height: 120px;
        padding: $spacing-md;
        border-radius: $radius-xl;
      }

      // Modifier: today
      &--today {
        border-color: $color-warning;
        background: $color-warning-bright-alpha-05;
      }

      // Modifier: selected
      &--selected {
        border-color: $brand-primary;
        border-width: 3px;
      }

      // Modifier: other-month
      &--other-month {
        opacity: 0.4;
      }

      // Modifier: has-meals
      &--has-meals {
        background: $color-primary-alpha-03;
      }
    }

    // Element: day-header
    &__day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-xs;
    }

    // Element: day-number
    &__day-number {
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    // Element: day-header-actions
    &__day-header-actions {
      display: flex;
      gap: $spacing-2xs;
      align-items: center;
    }

    // Element: meals
    &__meals {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
    }
  }
</style>
