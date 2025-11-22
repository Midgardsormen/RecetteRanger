<script lang="ts">
  import type { StepItemProps } from '../../../types/ui.types';
  import NumberBadge from '../NumberBadge/NumberBadge.svelte';
  import IconText from '../IconText/IconText.svelte';
  import { Clock } from 'lucide-svelte';
  import { STEP_ITEM_DEFAULTS, STEP_ITEM_ICON_SIZES } from './StepItem.config';

  let {
    stepNumber,
    description,
    duration,
    badgeColor = STEP_ITEM_DEFAULTS.badgeColor,
    badgeSize = STEP_ITEM_DEFAULTS.badgeSize,
    badgeVariant = STEP_ITEM_DEFAULTS.badgeVariant,
    badgeShape = STEP_ITEM_DEFAULTS.badgeShape
  }: StepItemProps = $props();
</script>

<div class="step-item">
  <NumberBadge
    number={stepNumber}
    size={badgeSize}
    variant={badgeVariant}
    color={badgeColor}
    shape={badgeShape}
  />
  <div class="step-item__content">
    <p class="step-item__description">{description}</p>
    {#if duration}
      <IconText
        icon={() => Clock}
        title={duration}
        variant="neutral"
        size="small"
        class="step-item__duration"
      />
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .step-item {
    display: flex;
    gap: $spacing-base;
    padding: $spacing-base;
    border-radius: $radius-lg;
    background: $color-background-secondary;
    transition: background $transition-base $transition-ease;

    &:hover {
      background: $color-gray-100;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
      flex: 1;
    }

    &__description {
      margin: 0;
      color: $color-text-primary;
      line-height: $line-height-relaxed;
      font-size: $font-size-base;
    }
  }
</style>
