<script lang="ts">
  interface Props {
    id?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value?: string | number;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onblur?: (e: Event) => void;
  }

  let {
    id,
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    label,
    required = false,
    disabled = false,
    error = '',
    hint = '',
    oninput,
    onchange,
    onblur
  }: Props = $props();
</script>

<div class="input-wrapper">
  {#if label}
    <label class="input-label" for={id}>
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {type}
    {placeholder}
    {disabled}
    class="input"
    class:input--error={error}
    bind:value
    {oninput}
    {onchange}
    {onblur}
  />

  {#if error}
    <span class="input-error">{error}</span>
  {/if}

  {#if hint && !error}
    <span class="input-hint">{hint}</span>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .input-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-label-text;
    display: block;
  }

  .required {
    color: $color-label-required;
    margin-left: $spacing-xs;
  }

  .input {
    padding: $spacing-md $spacing-base;
    border: 2px solid $color-input-border;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all $transition-base $transition-ease;
    background: $color-input-background;

    &:focus {
      outline: none;
      border-color: $color-input-border-focus;
      box-shadow: $shadow-focus-primary;
    }

    &:disabled {
      background: $color-input-disabled-background;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--error {
      border-color: $color-input-error-border;

      &:focus {
        box-shadow: $shadow-focus-danger;
      }
    }

    &::placeholder {
      color: $color-input-placeholder;
    }
  }

  .input-error {
    font-size: $font-size-sm;
    color: $color-text-error;
    margin-top: -$spacing-xs;
  }

  .input-hint {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-top: -$spacing-xs;
  }
</style>
