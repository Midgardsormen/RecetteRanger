<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    for?: string;
    required?: boolean;
    variant?: 'default' | 'inverse';
    children: Snippet;
  }

  let {
    for: htmlFor,
    required = false,
    variant = 'default',
    children
  }: Props = $props();
</script>

<label
  for={htmlFor}
  class="field-label"
  class:field-label--inverse={variant === 'inverse'}
>
  {@render children()}
  {#if required}
    <span class="field-label__required">*</span>
  {/if}
</label>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .field-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-label-text;
    display: block;

    &__required {
      color: $color-label-required;
      margin-left: $spacing-xs;
    }

    // Modifier: inverse variant (for dark backgrounds)
    &--inverse {
      color: $color-text-inverse;
    }
  }
</style>
