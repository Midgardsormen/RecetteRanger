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
  $primary-color: #667eea;
  $danger-color: #f56565;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $border-error: #f56565;
  $spacing-base: 1rem;

  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.5;
  }

  .input-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: $text-dark;
    display: block;
  }

  .required {
    color: $danger-color;
    margin-left: 0.25rem;
  }

  .input {
    padding: $spacing-base * 0.75 $spacing-base;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;
    background: white;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--error {
      border-color: $border-error;

      &:focus {
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
      }
    }

    &::placeholder {
      color: $text-light;
    }
  }

  .input-error {
    font-size: 0.85rem;
    color: $danger-color;
    margin-top: -0.25rem;
  }

  .input-hint {
    font-size: 0.85rem;
    color: $text-gray;
    margin-top: -0.25rem;
  }
</style>
