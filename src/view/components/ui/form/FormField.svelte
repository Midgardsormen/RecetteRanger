<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setFormFieldContext, type FormFieldContext } from './context/formFieldContext';

  interface Props {
    name: string;
    label?: string;
    helper?: string;
    required?: boolean;
    disabled?: boolean;
    value?: any;
    error?: string;
    validate?: (value: any) => string | null;
    variant?: 'default' | 'inverse';
    children: Snippet;
  }

  let {
    name,
    label,
    helper,
    required = false,
    disabled = false,
    value = $bindable(''),
    error = '',
    validate,
    variant = 'default',
    children
  }: Props = $props();

  // Génération des IDs stables
  const fieldId = `field-${name}`;
  const helperId = `helper-${name}`;
  const errorId = `error-${name}`;

  // État interne
  let touched = $state(false);
  let dirty = $state(false);
  let internalError = $state(error);

  // Calculer aria-describedby
  const describedBy = $derived.by(() => {
    const parts: string[] = [];
    if (helper) parts.push(helperId);
    if (internalError) parts.push(errorId);
    return parts.join(' ');
  });

  // Fonction pour mettre à jour la valeur
  function setValue(newValue: any) {
    value = newValue;
    dirty = true;

    // Valider si une fonction de validation est fournie
    if (validate) {
      internalError = validate(newValue) || '';
    }
  }

  // Mettre à jour l'erreur externe si elle change
  $effect(() => {
    internalError = error;
  });

  // Créer et fournir le contexte
  const context: FormFieldContext = {
    id: fieldId,
    name,
    value,
    setValue,
    error: internalError,
    touched,
    dirty,
    required,
    disabled,
    helperId,
    errorId,
    describedBy
  };

  setFormFieldContext(context);
</script>

<div class="form-field" class:form-field--inverse={variant === 'inverse'} data-field-name={name}>
  {#if label}
    <label for={fieldId} class="form-field__label">
      {label}
      {#if required}
        <span class="form-field__required">*</span>
      {/if}
    </label>
  {/if}

  <div class="form-field__content">
    {@render children()}
  </div>

  {#if helper && !internalError}
    <p class="form-field__hint" id={helperId}>{helper}</p>
  {/if}

  {#if internalError}
    <p class="form-field__error" id={errorId}>{internalError}</p>
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

    // Modifier: inverse variant (for dark backgrounds)
    &--inverse {
      .form-field__label {
        color: $color-text-inverse;
      }

      .form-field__hint {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
</style>
