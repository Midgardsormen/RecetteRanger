<script lang="ts">
  import FormField from './FormField.svelte';

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

<FormField {label} {required} {error} {hint}>
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
</FormField>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .input {
    padding: $spacing-md $spacing-base;
    border: 2px solid $color-input-border;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all $transition-base $transition-ease;
    background: $color-input-background;
    width: 100%;

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
</style>
