<script lang="ts">
  import type { Snippet } from 'svelte';
  import FormField from './FormField.svelte';

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

<FormField {label} {required} {error} {hint}>
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
</FormField>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .select {
    padding: $spacing-md $spacing-base;
    border: 2px solid $color-input-border;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all $transition-base $transition-ease;
    cursor: pointer;
    appearance: none;
    background-color: $color-input-background;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 16px 16px;
    padding-right: 2.5rem;
    width: 100%;
    max-width: 100%;

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

    // Options styling
    option {
      background-color: $color-white!important;
      color: $color-text-primary!important;
      padding: $spacing-sm;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      // Réduire la taille sur mobile pour éviter le débordement
      @media (max-width: $breakpoint-sm) {
        font-size: $font-size-sm;
      }

      &:checked, &:focus {
        background-color: $brand-primary!important;
        color: $color-white!important;
      }

      &:hover {
        background-color: $color-primary-alpha-10;
      }
    }
  }
</style>
