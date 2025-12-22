<script lang="ts">
  import type { MealPlanDay, MealSlotConfig } from '../../../../../types/meal-plan.types';
  import { MealSlotColors } from '../../../../../types/meal-plan.types';
  import { Badge, ListItem, IconButton, Carousel } from '../../../../../components/ui';
  import { Copy } from 'lucide-svelte';
  import { startOfWeek, addDays, isSameDay, formatDayName } from '../../../../../utils/date-range.utils';
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
  }

  let {
    currentDate,
    mealPlanDays,
    slotConfigs,
    onDateClick,
    onMealEdit,
    onMealDelete,
    onMealDuplicate,
    onDayDuplicate
  }: Props = $props();

  const dates = $derived.by(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const today = new Date();

  // Index du jour actif pour le carousel
  const activeIndex = $derived(dates.findIndex(date => isSameDay(date, currentDate)));
</script>

<div class="week-view">
  <Carousel itemsVisible={{ sm: 1.2, md: 1.2, lg: 2.2, xl: 3.2, '2xl': 7 }} gap="sm" {activeIndex} autoScroll={true} displayControls="desktop-only">
    {#each dates as date}
      {@const mealPlan = getMealPlanForDate(mealPlanDays, date)}
      {@const isToday = isSameDay(date, today)}
      {@const isSelected = isSameDay(date, currentDate)}
      {@const sortedItems = mealPlan ? sortMealItems(mealPlan.items, slotConfigs) : []}

      <div
        class="carousel__item week-view__day"
        class:week-view__day--today={isToday}
        class:week-view__day--selected={isSelected}
        class:week-view__day--has-meals={mealPlan && mealPlan.items.length > 0}
        onclick={() => onDateClick?.(date)}
      >
        <div class="week-view__day-header">
          <div class="week-view__day-number">
            <span class="week-view__day-name">{formatDayName(date)}</span>
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
          <div class="week-view__meals">
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
  </Carousel>
</div>

<style lang="scss">
  @use '../../../../../styles/variables' as *;

  // Block: week-view
  .week-view {
    display: flex;
    flex-direction: column;

    // Element: day
    &__day {
      min-height: 150px;
      padding: $spacing-sm;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      cursor: pointer;
      transition: all $transition-base;
      background: $color-background-primary;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      min-width: 0;

      @media (min-width: $breakpoint-md) {
        min-height: 180px;
        padding: $spacing-md;
        border-radius: $radius-xl;
      }

      &:hover {
        border-color: $brand-primary;
        box-shadow: 0 4px 12px rgba($brand-primary, 0.15);
        transform: translateY(-2px);
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
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xl;
      }
    }

    // Element: day-name
    &__day-name {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      font-weight: $font-weight-medium;
      text-transform: uppercase;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-base;
      }
    }

    // Element: meals
    &__meals {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
