<script lang="ts">
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

<div class="textarea-wrapper">
  {#if label}
    <label class="textarea-label" for={id}>
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

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

  {#if error}
    <span class="textarea-error">{error}</span>
  {/if}

  {#if hint && !error}
    <span class="textarea-hint">{hint}</span>
  {/if}
</div>

<style lang="scss">
  @import '../../../styles/variables';

  .textarea-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .textarea-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-label-text;
    display: block;
  }

  .required {
    color: $color-label-required;
    margin-left: $spacing-xs;
  }

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

  .textarea-error {
    font-size: $font-size-sm;
    color: $color-text-error;
    margin-top: -$spacing-xs;
  }

  .textarea-hint {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-top: -$spacing-xs;
  }
</style>
