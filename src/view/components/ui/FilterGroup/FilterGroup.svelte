<script lang="ts">
  import Select from '../form/Select.svelte';
  import type { FilterGroupProps } from '../../../types/ui.types';
  import { FILTER_GROUP_DEFAULTS } from './FilterGroup.config';
  import { toKebabCase } from '../../../utils/ui.utils';

  let {
    label,
    value = $bindable(FILTER_GROUP_DEFAULTS.value),
    options,
    onchange,
    inverse = FILTER_GROUP_DEFAULTS.inverse
  }: FilterGroupProps = $props();

  // Generate a kebab-case ID from the label
  const selectId = $derived(toKebabCase(label));
</script>

<div class="filter-group" class:filter-group--inverse={inverse}>
  <span class="filter-group__label">{label}</span>
  <Select
    id={selectId}
    bind:value={value}
    {options}
    {onchange}
  />
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;

    &__label {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: $letter-spacing-wide;
    }

    &--inverse {
      .filter-group__label {
        color: $brand-cream;
        text-shadow: $text-shadow-soft-sm;
      }
    }
  }
</style>
