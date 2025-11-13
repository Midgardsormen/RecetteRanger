<script lang="ts">
  import type { Snippet } from 'svelte';
  import Accordion from './Accordion.svelte';
  import Dropdown from './Dropdown.svelte';

  interface FilterOption {
    value: string;
    label: string;
    count?: number;
  }

  type DisplayMode = 'pills' | 'accordion' | 'dropdown' | 'select';

  interface Props {
    label?: string;
    options: FilterOption[];
    value?: string | string[];
    multiple?: boolean;
    showCounts?: boolean;
    mode?: DisplayMode;
    onchange?: (value: string | string[]) => void;
    children?: Snippet;
  }

  let {
    label,
    options,
    multiple = false,
    value = $bindable(multiple ? [] : ''),
    showCounts = false,
    mode = 'pills',
    onchange,
    children
  }: Props = $props();

  let isAccordionOpen = $state(false);
  let isDropdownOpen = $state(false);

  function handleOptionClick(optionValue: string) {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        value = currentValues.filter(v => v !== optionValue);
      } else {
        value = [...currentValues, optionValue];
      }
    } else {
      value = value === optionValue ? '' : optionValue;
    }

    if (onchange) {
      onchange(value);
    }
  }

  function isSelected(optionValue: string): boolean {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  }

  function clearAll() {
    value = multiple ? [] : '';
    if (onchange) {
      onchange(value);
    }
  }

  function hasSelection(): boolean {
    if (multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== '';
  }

  function handleSelectChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    value = target.value;
    if (onchange) {
      onchange(value);
    }
  }

  function getSelectedLabel(): string {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return label || 'Sélectionner...';
    }
    const selected = options.find(opt => opt.value === value);
    return selected?.label || label || 'Sélectionner...';
  }

  function handleDropdownOptionClick(optionValue: string) {
    handleOptionClick(optionValue);
    if (!multiple) {
      isDropdownOpen = false;
    }
  }
</script>

<div class="filter">
  {#if children}
    {@render children()}
  {:else if mode === 'select'}
    <!-- Mode Select (HTML select) -->
    {#if label}
      <label class="filter__label">{label}</label>
    {/if}
    <select
      class="filter__select"
      bind:value
      onchange={handleSelectChange}
    >
      {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else if mode === 'dropdown'}
    <!-- Mode Dropdown (Overlay) -->
    <Dropdown bind:isOpen={isDropdownOpen}>
      {#snippet trigger()}
        <span>{getSelectedLabel()}</span>
        <span class="filter__count">
          {#if hasSelection() && !Array.isArray(value)}
            ✓
          {:else if Array.isArray(value) && value.length > 0}
            ({value.length})
          {/if}
        </span>
      {/snippet}
      {#snippet children()}
        <div class="filter__dropdown-content">
          {#if hasSelection()}
            <button
              type="button"
              class="filter__clear-dropdown"
              onclick={clearAll}
            >
              ✕ Effacer tout
            </button>
          {/if}
          {#each options as option (option.value)}
            <button
              type="button"
              class="filter__dropdown-option"
              class:filter__dropdown-option--selected={isSelected(option.value)}
              onclick={() => handleDropdownOptionClick(option.value)}
            >
              <span class="filter__option-label">{option.label}</span>
              {#if showCounts && option.count !== undefined}
                <span class="filter__option-count">({option.count})</span>
              {/if}
              {#if isSelected(option.value)}
                <span class="filter__check">✓</span>
              {/if}
            </button>
          {/each}
        </div>
      {/snippet}
    </Dropdown>
  {:else if mode === 'accordion'}
    <!-- Mode Accordion -->
    <Accordion title={label || 'Filtrer'} bind:isOpen={isAccordionOpen}>
      {#if hasSelection()}
        <button
          type="button"
          class="filter__clear filter__clear--accordion"
          onclick={clearAll}
        >
          Effacer tout
        </button>
      {/if}
      <div class="filter__options">
        {#each options as option (option.value)}
          <button
            type="button"
            class="filter__option"
            class:filter__option--selected={isSelected(option.value)}
            onclick={() => handleOptionClick(option.value)}
          >
            <span class="filter__option-label">{option.label}</span>
            {#if showCounts && option.count !== undefined}
              <span class="filter__option-count">({option.count})</span>
            {/if}
          </button>
        {/each}
      </div>
    </Accordion>
  {:else}
    <!-- Mode Pills (par défaut) -->
    {#if label}
      <div class="filter__header">
        <span class="filter__label">{label}</span>
        {#if hasSelection()}
          <button
            type="button"
            class="filter__clear"
            onclick={clearAll}
          >
            Effacer
          </button>
        {/if}
      </div>
    {/if}
    <div class="filter__options">
      {#each options as option (option.value)}
        <button
          type="button"
          class="filter__option"
          class:filter__option--selected={isSelected(option.value)}
          onclick={() => handleOptionClick(option.value)}
        >
          <span class="filter__option-label">{option.label}</span>
          {#if showCounts && option.count !== undefined}
            <span class="filter__option-count">({option.count})</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .filter {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .filter__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .filter__clear {
    padding: $spacing-xs $spacing-sm;
    background: transparent;
    border: none;
    color: $brand-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: color $transition-base $transition-ease;

    &:hover {
      color: $brand-secondary;
      text-decoration: underline;
    }

    &--accordion {
      margin-bottom: $spacing-md;
      display: block;
      width: 100%;
      text-align: left;
    }
  }

  .filter__select {
    width: 100%;
    padding: $spacing-md;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    background: $color-white;
    font-size: $font-size-sm;
    font-family: inherit;
    color: $color-text-primary;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      border-color: $brand-primary;
    }

    &:focus {
      outline: none;
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;
    }
  }

  .filter__count {
    color: $brand-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
  }

  .filter__dropdown-content {
    padding: $spacing-sm;
    max-width: 400px;
    min-width: 250px;
  }

  .filter__clear-dropdown {
    width: 100%;
    padding: $spacing-sm;
    margin-bottom: $spacing-sm;
    background: $color-background-danger;
    border: none;
    border-radius: $radius-md;
    color: $color-danger;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    text-align: left;

    &:hover {
      background: rgba($color-danger, 0.2);
    }
  }

  .filter__dropdown-option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: transparent;
    border: none;
    border-radius: $radius-md;
    color: $color-text-primary;
    font-size: $font-size-sm;
    text-align: left;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      background: rgba($brand-primary, 0.1);
    }

    &--selected {
      background: rgba($brand-primary, 0.15);
      font-weight: $font-weight-medium;
    }
  }

  .filter__check {
    color: $brand-primary;
    font-weight: $font-weight-bold;
  }

  .filter__options {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  .filter__option {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    color: $color-text-secondary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      border-color: $brand-primary;
      color: $brand-primary;
      transform: translateY(-2px);
    }

    &--selected {
      @include brand-gradient-primary;
      border-color: transparent;
      color: $color-white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($brand-primary, 0.3);
      }
    }
  }

  .filter__option-label {
    line-height: 1;
  }

  .filter__option-count {
    opacity: $opacity-80;
    font-size: $font-size-xs;
    line-height: 1;
  }
</style>
