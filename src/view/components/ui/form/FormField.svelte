<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label?: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: Snippet;
  }

  let {
    label,
    required = false,
    error = '',
    hint = '',
    children
  }: Props = $props();
</script>

<div class="form-field">
  {#if label}
    <label class="form-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  <div class="form-field__content">
    {@render children()}
  </div>

  {#if error}
    <span class="form-error">{error}</span>
  {/if}

  {#if hint && !error}
    <span class="form-hint">{hint}</span>
  {/if}
</div>

<style lang="scss">
  $danger-color: #f56565;
  $text-dark: #333;
  $text-gray: #666;
  $spacing-base: 1rem;

  .form-field {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
    margin-bottom: $spacing-base * 1.5;
  }

  .form-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: $text-dark;
    display: block;
  }

  .required {
    color: $danger-color;
    margin-left: 0.25rem;
  }

  .form-field__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
  }

  .form-error {
    font-size: 0.85rem;
    color: $danger-color;
    margin-top: -0.25rem;
  }

  .form-hint {
    font-size: 0.85rem;
    color: $text-gray;
    margin-top: -0.25rem;
  }
</style>
