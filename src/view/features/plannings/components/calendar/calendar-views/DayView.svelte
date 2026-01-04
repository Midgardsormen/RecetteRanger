<script lang="ts">
  import type { MealPlanDay, MealSlotConfig } from '../../../../../types/meal-plan.types';
  import { MealSlotColors } from '../../../../../types/meal-plan.types';
  import { Badge, ListItem, IconButton } from '../../../../../components/ui';
  import { Copy, Plus, Eraser } from 'lucide-svelte';
  import { isSameDay } from '../../../../../utils/date-range.utils';
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

  const mealPlan = $derived(getMealPlanForDate(mealPlanDays, currentDate));
  const sortedItems = $derived(mealPlan ? sortMealItems(mealPlan.items, slotConfigs) : []);
  const today = new Date();
  const isToday = $derived(isSameDay(currentDate, today));

  function handleItemClick(item: any) {
    if (item.menu) {
      window.location.href = `/menus/${item.menu.id}`;
    } else if (item.recipe) {
      window.location.href = `/recettes/${item.recipe.id}`;
    } else if (item.ingredient) {
      window.location.href = `/ingredients/${item.ingredient.id}`;
    }
  }
</script>

<div class="day-view">
  <div
    class="day-view__container"
    class:day-view__container--today={isToday}
    class:day-view__container--has-meals={mealPlan && mealPlan.items.length > 0}
  >
    <div class="day-view__header">
      <div class="day-view__date">
        {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <div class="day-view__header-actions">
        <IconButton
          variant="ghost"
          size="small"
          onclick={(e: MouseEvent) => {
            e.stopPropagation();
            onDateClick?.(currentDate);
          }}
          ariaLabel="Ajouter un repas"
        >
          <Plus size={16} />
        </IconButton>
        {#if mealPlan && mealPlan.items.length > 0}
          {#if onDayDuplicate}
            <IconButton
              variant="ghost"
              size="small"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                onDayDuplicate?.(currentDate);
              }}
              ariaLabel="Dupliquer ce jour"
            >
              <Copy size={16} />
            </IconButton>
          {/if}
          {#if onDayDelete}
            <IconButton
              variant="danger"
              size="small"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                onDayDelete?.(currentDate);
              }}
              ariaLabel="Vider ce jour"
            >
              <Eraser size={16} />
            </IconButton>
          {/if}
        {/if}
      </div>
    </div>

    {#if mealPlan}
      <div class="day-view__meals">
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
</div>

<style lang="scss">
  @use '../../../../../styles/variables' as *;

  // Block: day-view
  .day-view {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;

    // Element: container
    &__container {
      min-height: 200px;
      padding: $spacing-base;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      transition: all $transition-base;
      background: $color-background-primary;
      display: flex;
      flex-direction: column;
      gap: $spacing-base;

      @media (min-width: $breakpoint-md) {
        min-height: 300px;
        padding: $spacing-lg;
        border-radius: $radius-xl;
      }

      // Modifier: today
      &--today {
        border-color: $color-warning;
        background: $color-warning-bright-alpha-05;
      }

      // Modifier: has-meals
      &--has-meals {
        background: $color-primary-alpha-03;
      }
    }

    // Element: header
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-sm;
    }

    // Element: date
    &__date {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      text-transform: capitalize;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xl;
      }
    }

    // Element: header-actions
    &__header-actions {
      display: flex;
      gap: $spacing-xs;
      align-items: center;
    }

    // Element: meals
    &__meals {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      flex: 1;
    }
  }
</style>
