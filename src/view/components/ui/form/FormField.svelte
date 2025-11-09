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
  @import '../../../styles/variables';

  .form-field {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;
  }

  .form-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-label-text;
    display: block;
  }

  .required {
    color: $color-label-required;
    margin-left: $spacing-xs;
  }

  .form-field__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .form-error {
    font-size: $font-size-sm;
    color: $color-text-error;
    margin-top: -$spacing-xs;
  }

  .form-hint {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-top: -$spacing-xs;
  }
</style>
