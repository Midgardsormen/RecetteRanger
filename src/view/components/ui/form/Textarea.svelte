<script lang="ts">
  import { getFormFieldContext } from './formFieldContext';
  import FormField from './FormField.svelte';

  interface Props {
    id?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    maxlength?: number;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    error?: string;
    hint?: string;
    variant?: 'default' | 'inverse';
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onblur?: (e: Event) => void;
  }

  let {
    id,
    name,
    value = $bindable(''),
    placeholder = '',
    rows = 4,
    maxlength,
    disabled = false,
    required = false,
    label,
    error = '',
    hint = '',
    variant = 'default',
    oninput,
    onchange,
    onblur
  }: Props = $props();

  // Récupérer le contexte du FormField parent (optionnel)
  const ctx = getFormFieldContext();

  // Déterminer si on doit wrapper avec FormField
  const shouldWrapWithFormField = !ctx && (label || error || hint);

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLTextAreaElement;

    // Si on a un contexte FormField, l'utiliser
    if (ctx) {
      ctx.setValue(target.value);
    } else {
      // Sinon, mettre à jour la valeur directement
      value = target.value;
    }

    oninput?.(e);
  }

  function handleBlur(e: Event) {
    if (ctx) {
      ctx.touched = true;
    }
    onblur?.(e);
  }
</script>

{#if shouldWrapWithFormField}
  <FormField {name} {label} helper={hint} {error} {required} bind:value {disabled} {variant}>
    <textarea
      {id}
      {placeholder}
      {rows}
      {maxlength}
      class="textarea"
      oninput={oninput}
      onchange={onchange}
      onblur={onblur}
    ></textarea>
  </FormField>
{:else}
  <textarea
    id={ctx?.id ?? id}
    name={ctx?.name ?? name}
    {placeholder}
    {rows}
    {maxlength}
    value={ctx?.value ?? value}
    disabled={ctx?.disabled ?? disabled}
    required={ctx?.required ?? required}
    class="textarea"
    class:textarea--error={ctx?.error}
    aria-invalid={ctx?.error ? true : undefined}
    aria-describedby={ctx?.describedBy || undefined}
    oninput={handleInput}
    onchange={onchange}
    onblur={handleBlur}
  ></textarea>
{/if}

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
