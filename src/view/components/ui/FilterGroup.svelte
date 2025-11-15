<script lang="ts">
  import Select from './form/Select.svelte';

  interface Props {
    label: string;
    value?: string;
    options: Array<{ value: string; label: string }>;
    onchange?: () => void;
    inverse?: boolean;
  }

  let {
    label,
    value = $bindable(''),
    options,
    onchange,
    inverse = false
  }: Props = $props();
</script>

<div class="filter-group" class:filter-group--inverse={inverse}>
  <span class="filter-group__label">{label}</span>
  <Select
    id={label.toLowerCase().replace(/\s+/g, '-')}
    bind:value={value}
    {options}
    {onchange}
  />
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    &__label {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &--inverse {
      .filter-group__label {
        color: $brand-cream;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
