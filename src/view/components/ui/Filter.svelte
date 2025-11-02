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
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .filter {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.75;
  }

  .filter__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: $text-dark;
  }

  .filter__clear {
    padding: $spacing-base * 0.25 $spacing-base * 0.5;
    background: transparent;
    border: none;
    color: $primary-color;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color $transition-duration ease;

    &:hover {
      color: $secondary-color;
      text-decoration: underline;
    }

    &--accordion {
      margin-bottom: $spacing-base * 0.75;
      display: block;
      width: 100%;
      text-align: left;
    }
  }

  .filter__select {
    width: 100%;
    padding: $spacing-base * 0.75;
    border: 2px solid $border-color;
    border-radius: 8px;
    background: $white;
    font-size: 0.95rem;
    font-family: inherit;
    color: $text-dark;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:hover {
      border-color: $primary-color;
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .filter__count {
    color: $primary-color;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .filter__dropdown-content {
    padding: $spacing-base * 0.5;
    max-width: 400px;
    min-width: 250px;
  }

  .filter__clear-dropdown {
    width: 100%;
    padding: $spacing-base * 0.5;
    margin-bottom: $spacing-base * 0.5;
    background: rgba(245, 101, 101, 0.1);
    border: none;
    border-radius: 6px;
    color: $danger-color;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-duration ease;
    text-align: left;

    &:hover {
      background: rgba(245, 101, 101, 0.2);
    }
  }

  .filter__dropdown-option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-base * 0.5;
    padding: $spacing-base * 0.75;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: $text-dark;
    font-size: 0.95rem;
    text-align: left;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    &--selected {
      background: rgba(102, 126, 234, 0.15);
      font-weight: 500;
    }
  }

  .filter__check {
    color: $primary-color;
    font-weight: 700;
  }

  .filter__options {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-base * 0.5;
  }

  .filter__option {
    display: inline-flex;
    align-items: center;
    gap: $spacing-base * 0.25;
    padding: $spacing-base * 0.5 $spacing-base * 0.75;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 8px;
    color: $text-gray;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
      transform: translateY(-2px);
    }

    &--selected {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      border-color: transparent;
      color: $white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }
  }

  .filter__option-label {
    line-height: 1;
  }

  .filter__option-count {
    opacity: 0.8;
    font-size: 0.75rem;
    line-height: 1;
  }
</style>
