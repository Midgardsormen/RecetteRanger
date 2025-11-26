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
    <label class="form-field__label">
      {label}
      {#if required}
        <span class="form-field__required">*</span>
      {/if}
    </label>
  {/if}

  <div class="form-field__content">
    {@render children()}
  </div>

  {#if error}
    <span class="form-field__error">{error}</span>
  {/if}

  {#if hint && !error}
    <span class="form-field__hint">{hint}</span>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: form-field
  .form-field {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    width: 100%;
    @media (min-width: $breakpoint-sm) {
      width: auto;
    }
    // Element: label
    &__label {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-label-text;
      display: block;
    }

    // Element: required
    &__required {
      color: $color-label-required;
      margin-left: $spacing-xs;
    }

    // Element: content
    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    // Element: error
    &__error {
      font-size: $font-size-sm;
      color: $color-text-error;
      margin-top: -$spacing-xs;
    }

    // Element: hint
    &__hint {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin-top: -$spacing-xs;
    }
  }
</style>
