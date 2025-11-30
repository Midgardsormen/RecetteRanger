<script lang="ts">
  import { getFormFieldContext } from './context/formFieldContext';
  import FormField from './FormField.svelte';

  interface Props {
    id?: string;
    name?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value?: string | number;
    placeholder?: string;
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
    type = 'text',
    value = $bindable(''),
    placeholder = '',
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

  // Référence à l'élément input pour forcer la synchronisation
  let inputElement: HTMLInputElement | null = null;

  // Synchroniser la valeur de l'input avec la prop value
  $effect(() => {
    const currentValue = ctx?.value ?? value;
    if (inputElement && inputElement.value !== String(currentValue)) {
      inputElement.value = String(currentValue);
    }
  });

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;

    // Si on a un contexte FormField, l'utiliser
    if (ctx) {
      ctx.setValue(target.value);
    }
    // Sinon, toujours mettre à jour la valeur locale (nécessaire pour bind:value)
    else {
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
    <input
      bind:this={inputElement}
      {id}
      {type}
      {placeholder}
      value={value}
      class="input"
      oninput={handleInput}
      onchange={onchange}
      onblur={handleBlur}
    />
  </FormField>
{:else}
  <input
    bind:this={inputElement}
    id={ctx?.id ?? id}
    name={ctx?.name ?? name}
    {type}
    {placeholder}
    value={ctx?.value ?? value}
    disabled={ctx?.disabled ?? disabled}
    required={ctx?.required ?? required}
    class="input"
    class:input--error={ctx?.error}
    aria-invalid={ctx?.error ? true : undefined}
    aria-describedby={ctx?.describedBy || undefined}
    oninput={handleInput}
    onchange={onchange}
    onblur={handleBlur}
  />
{/if}

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
