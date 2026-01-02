<script lang="ts">
  import type { FilterProps } from '../../../types/ui.types';
  import Accordion from '../Accordion.svelte';
  import Dropdown from '../Dropdown/Dropdown.svelte';
  import Chip from '../Chip/Chip.svelte';
  import { FILTER_DEFAULTS, FILTER_LABELS, FILTER_SIZES } from './Filter.config';
  import {
    createOptionClickHandler,
    createDropdownOptionClickHandler,
    createSelectChangeHandler,
    createClearAllHandler,
    isSelected,
    hasSelection,
    getSelectedLabel
  } from './Filter.actions';

  let {
    label,
    options,
    multiple = FILTER_DEFAULTS.multiple,
    value = $bindable(multiple ? [] : ''),
    showCounts = FILTER_DEFAULTS.showCounts,
    mode = FILTER_DEFAULTS.mode,
    onchange,
    children
  }: FilterProps = $props();

  let isAccordionOpen = $state(FILTER_DEFAULTS.isAccordionOpen);
  let isDropdownOpen = $state(FILTER_DEFAULTS.isDropdownOpen);

  // Create handlers
  const handleOptionClick = createOptionClickHandler(
    multiple,
    value,
    (newValue) => {
      value = newValue;
    },
    onchange
  );

  const handleDropdownOptionClick = createDropdownOptionClickHandler(
    multiple,
    handleOptionClick,
    (isOpen) => {
      isDropdownOpen = isOpen;
    }
  );

  const handleSelectChange = createSelectChangeHandler(
    (newValue) => {
      value = newValue;
    },
    onchange
  );

  const clearAll = createClearAllHandler(
    multiple,
    (newValue) => {
      value = newValue;
    },
    onchange
  );

  // Derived state
  const selectedLabel = $derived(getSelectedLabel(value, options, label));
  const hasActiveSelection = $derived(hasSelection(value, multiple));
</script>

<div class="filter">
  {#if children}
    {@render children()}
  {:else if mode === 'select'}
    <!-- Mode Select (HTML select) -->
    <label class="filter__label">
      {#if label}
        <span class="filter__label-text">{label}</span>
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
    </label>
  {:else if mode === 'dropdown'}
    <!-- Mode Dropdown (Overlay) -->
    <Dropdown bind:isOpen={isDropdownOpen}>
      {#snippet trigger()}
        <span>{selectedLabel}</span>
        <span class="filter__count">
          {#if hasActiveSelection && !Array.isArray(value)}
            {FILTER_LABELS.checkMark}
          {:else if Array.isArray(value) && value.length > 0}
            ({value.length})
          {/if}
        </span>
      {/snippet}
      {#snippet children()}
        <div class="filter__dropdown-content">
          {#if hasActiveSelection}
            <button
              type="button"
              class="filter__clear-dropdown"
              onclick={clearAll}
            >
              {FILTER_LABELS.clearIcon} {FILTER_LABELS.clearAll}
            </button>
          {/if}
          {#each options as option (option.value)}
            <button
              type="button"
              class="filter__dropdown-option"
              class:filter__dropdown-option--selected={isSelected(option.value, value, multiple)}
              onclick={() => handleDropdownOptionClick(option.value)}
            >
              <span class="filter__option-label">{option.label}</span>
              {#if showCounts && option.count !== undefined}
                <span class="filter__option-count">({option.count})</span>
              {/if}
              {#if isSelected(option.value, value, multiple)}
                <span class="filter__check">{FILTER_LABELS.checkMark}</span>
              {/if}
            </button>
          {/each}
        </div>
      {/snippet}
    </Dropdown>
  {:else if mode === 'accordion'}
    <!-- Mode Accordion -->
    <Accordion title={label || FILTER_LABELS.accordionTitle} bind:isOpen={isAccordionOpen}>
      {#if hasActiveSelection}
        <button
          type="button"
          class="filter__clear filter__clear--accordion"
          onclick={clearAll}
        >
          {FILTER_LABELS.clearAll}
        </button>
      {/if}
      <div class="filter__options">
        {#each options as option (option.value)}
          <Chip
            clickable={true}
            variant={isSelected(option.value, value, multiple) ? 'inverse' : 'default'}
            size="md"
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Chip>
        {/each}
      </div>
    </Accordion>
  {:else}
    <!-- Mode Pills (par défaut) -->
    {#if label}
      <div class="filter__header">
        <span class="filter__label">{label}</span>
        {#if hasActiveSelection}
          <button
            type="button"
            class="filter__clear"
            onclick={clearAll}
          >
            {FILTER_LABELS.clear}
          </button>
        {/if}
      </div>
    {/if}
    <div class="filter__options">
      {#each options as option (option.value)}
        <Chip
          clickable={true}
          variant={isSelected(option.value, value, multiple) ? 'inverse' : 'default'}
          size="md"
          onClick={() => handleOptionClick(option.value)}
        >
          {option.label}
        </Chip>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

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
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .filter__label-text {
    display: block;
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
      background: $color-danger-alpha-20;
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
      background: $color-primary-alpha-10;
    }

    &--selected {
      background: $color-primary-alpha-15;
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
</style>
