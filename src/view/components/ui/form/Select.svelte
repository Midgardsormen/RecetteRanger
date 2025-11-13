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
  @use '../../../styles/variables' as *;

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .select-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-label-text;
    display: block;
  }

  .required {
    color: $color-label-required;
    margin-left: $spacing-xs;
  }

  .select {
    padding: $spacing-md $spacing-base;
    border: 2px solid $color-input-border;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all $transition-base $transition-ease;
    background: $color-input-background;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right $spacing-base center;
    padding-right: 2.5rem;

    &:focus {
      outline: none;
      border-color: $color-input-border-focus;
      box-shadow: $shadow-focus-primary;
    }

    &:disabled {
      background-color: $color-input-disabled-background;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--error {
      border-color: $color-input-error-border;

      &:focus {
        box-shadow: $shadow-focus-danger;
      }
    }
  }

  .select-error {
    font-size: $font-size-sm;
    color: $color-text-error;
    margin-top: -$spacing-xs;
  }

  .select-hint {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-top: -$spacing-xs;
  }
</style>
