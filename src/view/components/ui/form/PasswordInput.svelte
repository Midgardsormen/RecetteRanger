<script lang="ts">
  import { getFormFieldContext } from './formFieldContext';
  import FormField from './FormField.svelte';
  import { Eye, EyeOff } from 'lucide-svelte';

  interface Props {
    id?: string;
    name?: string;
    value?: string;
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

  let showPassword = $state(false);

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;

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
    <div class="password-input__wrapper">
      <input
        {id}
        type={showPassword ? 'text' : 'password'}
        {placeholder}
        class="password-input__input"
        oninput={oninput}
        onchange={onchange}
        onblur={onblur}
      />
      <button
        type="button"
        class="password-input__toggle"
        onclick={togglePasswordVisibility}
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={showPassword}
        title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {#if showPassword}
          <EyeOff size={18} />
        {:else}
          <Eye size={18} />
        {/if}
      </button>
    </div>
  </FormField>
{:else}
  <div class="password-input__wrapper">
    <input
      id={ctx?.id ?? id}
      name={ctx?.name ?? name}
      type={showPassword ? 'text' : 'password'}
      value={ctx?.value ?? value}
      {placeholder}
      disabled={ctx?.disabled ?? disabled}
      required={ctx?.required ?? required}
      class="password-input__input"
      class:password-input__input--error={ctx?.error}
      aria-invalid={ctx?.error ? true : undefined}
      aria-describedby={ctx?.describedBy || undefined}
      oninput={handleInput}
      onchange={onchange}
      onblur={handleBlur}
    />
    <button
      type="button"
      class="password-input__toggle"
      onclick={togglePasswordVisibility}
      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      aria-pressed={showPassword}
      title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      {#if showPassword}
        <EyeOff size={18} />
      {:else}
        <Eye size={18} />
      {/if}
    </button>
  </div>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .password-input {
    &__wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    &__input {
      width: 100%;
      padding: $spacing-md;
      padding-right: 3rem;
      border: 2px solid $color-input-border;
      border-radius: $radius-lg;
      font-size: $font-size-base;
      transition: border-color $transition-base $transition-ease;

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

    &__toggle {
      position: absolute;
      right: $spacing-sm;
      background: none;
      border: none;
      cursor: pointer;
      padding: $spacing-sm;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $radius-sm;
      transition: background $transition-base $transition-ease;

      &:hover {
        background: $color-black-alpha-05;
      }

      &:focus {
        outline: 2px solid $brand-primary;
        outline-offset: 2px;
      }
    }
  }
</style>
