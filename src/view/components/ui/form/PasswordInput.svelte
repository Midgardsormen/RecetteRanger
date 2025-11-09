<script lang="ts">
  interface Props {
    id: string;
    label?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
  }

  let {
    id,
    label,
    value = $bindable(''),
    placeholder = '',
    required = false,
    disabled = false,
    error
  }: Props = $props();

  let showPassword = $state(false);

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="password-input">
  {#if label}
    <label for={id} class="password-input__label">
      {label}
      {#if required}
        <span class="password-input__required">*</span>
      {/if}
    </label>
  {/if}
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
    />
    <button
      type="button"
      class="password-input__toggle"
      onclick={togglePasswordVisibility}
      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      {#if showPassword}
        👁️
      {:else}
        👁️‍🗨️
      {/if}
    </button>
  </div>
  {#if error}
    <span class="password-input__error">{error}</span>
  {/if}
</div>

<style lang="scss">
  @import '../../../styles/variables';

  .password-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    &__label {
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
      color: $color-label-text;
    }

    &__required {
      color: $color-label-required;
    }

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
      }

      &:disabled {
        background: $color-input-disabled-background;
        cursor: not-allowed;
      }

      &--error {
        border-color: $color-input-error-border;
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
        background: rgba(0, 0, 0, 0.05);
      }

      &:focus {
        outline: 2px solid $brand-primary;
        outline-offset: 2px;
      }
    }

    &__error {
      color: $color-text-error;
      font-size: $font-size-sm;
    }
  }
</style>
