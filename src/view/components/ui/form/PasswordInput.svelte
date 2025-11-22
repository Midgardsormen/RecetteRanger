<script lang="ts">
  import FormField from './FormField.svelte';
  import { Eye, EyeOff } from 'lucide-svelte';

  interface Props {
    id: string;
    label?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
  }

  let {
    id,
    label,
    value = $bindable(''),
    placeholder = '',
    required = false,
    disabled = false,
    error,
    hint
  }: Props = $props();

  let showPassword = $state(false);

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<FormField {label} {required} {error} {hint}>
  <div class="password-input__wrapper">
    <input
      {id}
      type={showPassword ? 'text' : 'password'}
      bind:value
      {placeholder}
      {required}
      {disabled}
      class="password-input__input"
      class:password-input__input--error={error}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
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
