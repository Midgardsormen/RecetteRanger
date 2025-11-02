<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id?: string;
    value?: string | number;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    options?: Array<{ value: string | number; label: string }>;
    children?: Snippet;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    value = $bindable(''),
    label,
    required = false,
    disabled = false,
    error = '',
    hint = '',
    options = [],
    children,
    onchange
  }: Props = $props();
</script>

<div class="select-wrapper">
  {#if label}
    <label class="select-label" for={id}>
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  <select
    {id}
    {disabled}
    class="select"
    class:select--error={error}
    bind:value
    {onchange}
  >
    {#if options.length > 0}
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    {:else if children}
      {@render children()}
    {/if}
  </select>

  {#if error}
    <span class="select-error">{error}</span>
  {/if}

  {#if hint && !error}
    <span class="select-hint">{hint}</span>
  {/if}
</div>

<style lang="scss">
  $primary-color: #667eea;
  $danger-color: #f56565;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $border-error: #f56565;
  $spacing-base: 1rem;

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
  }

  .select-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: $text-dark;
    display: block;
  }

  .required {
    color: $danger-color;
    margin-left: 0.25rem;
  }

  .select {
    padding: $spacing-base * 0.75 $spacing-base;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;
    background: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--error {
      border-color: $border-error;

      &:focus {
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
      }
    }
  }

  .select-error {
    font-size: 0.85rem;
    color: $danger-color;
    margin-top: -0.25rem;
  }

  .select-hint {
    font-size: 0.85rem;
    color: $text-gray;
    margin-top: -0.25rem;
  }
</style>
