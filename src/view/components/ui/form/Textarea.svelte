<script lang="ts">
  import FormField from './FormField.svelte';

  interface Props {
    id?: string;
    value?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    rows?: number;
    maxlength?: number;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onblur?: (e: Event) => void;
  }

  let {
    id,
    value = $bindable(''),
    placeholder = '',
    label,
    required = false,
    disabled = false,
    error = '',
    hint = '',
    rows = 4,
    maxlength,
    oninput,
    onchange,
    onblur
  }: Props = $props();
</script>

<FormField {label} {required} {error} {hint}>
  <textarea
    {id}
    {placeholder}
    {disabled}
    {rows}
    {maxlength}
    class="textarea"
    class:textarea--error={error}
    bind:value
    {oninput}
    {onchange}
    {onblur}
  ></textarea>
</FormField>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .textarea {
    padding: $spacing-md $spacing-base;
    border: 2px solid $color-input-border;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all $transition-base $transition-ease;
    background: $color-input-background;
    resize: vertical;
    min-height: 100px;
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
