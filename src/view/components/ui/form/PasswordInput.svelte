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
  .password-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #333;
    }

    &__required {
      color: #f56565;
    }

    &__wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    &__input {
      width: 100%;
      padding: 0.75rem;
      padding-right: 3rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #667eea;
      }

      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }

      &--error {
        border-color: #f56565;
      }
    }

    &__toggle {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      &:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
      }
    }

    &__error {
      color: #f56565;
      font-size: 0.875rem;
    }
  }
</style>
