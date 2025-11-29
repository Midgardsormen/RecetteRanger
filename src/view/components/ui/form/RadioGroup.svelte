<script lang="ts">
  interface RadioOption {
    value: string;
    label: string;
    description?: string;
  }

  interface Props {
    label?: string;
    options: RadioOption[];
    value?: string;
    name: string;
    required?: boolean;
    disabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    variant?: 'default' | 'inverse';
  }

  let {
    label,
    options,
    value = $bindable(''),
    name,
    required = false,
    disabled = false,
    direction = 'horizontal',
    variant = 'default'
  }: Props = $props();

  function handleChange(optionValue: string) {
    value = optionValue;
  }
</script>

<div
  class="radio-group"
  class:radio-group--vertical={direction === 'vertical'}
  class:radio-group--inverse={variant === 'inverse'}
  role="radiogroup"
  aria-label={label}
>
  {#if label}
    <div class="radio-group__label">
      {label}
      {#if required}
        <span class="radio-group__required">*</span>
      {/if}
    </div>
  {/if}
  <div class="radio-group__options" class:radio-group__options--vertical={direction === 'vertical'}>
    {#each options as option}
      <label class="radio-group__option" class:radio-group__option--disabled={disabled}>
        <input
          type="radio"
          {name}
          value={option.value}
          checked={value === option.value}
          onchange={() => handleChange(option.value)}
          {disabled}
          class="radio-group__input"
        />
        <span class="radio-group__circle"></span>
        <div class="radio-group__content">
          <span class="radio-group__option-label">{option.label}</span>
          {#if option.description}
            <span class="radio-group__description">{option.description}</span>
          {/if}
        </div>
      </label>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    &__label {
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
      color: $color-label-text;
    }

    &__required {
      color: $color-label-required;
    }

    // Modifier: inverse variant (for dark backgrounds)
    &--inverse {
      .radio-group__label {
        color: $color-text-inverse;
      }

      .radio-group__option {
        border-color: $color-white-alpha-30;
        background: $color-white-alpha-10;

        &:hover:not(.radio-group__option--disabled) {
          border-color: $color-white;
          background: $color-white-alpha-20;
        }
      }

      .radio-group__circle {
        border-color: $color-white-alpha-30;
        background: transparent;
      }

      .radio-group__input:checked + .radio-group__circle {
        border-color: $color-white;
        background: $color-white;

        &::after {
          background: $brand-primary;
        }
      }

      .radio-group__input:focus + .radio-group__circle {
        box-shadow: 0 0 0 3px $color-white-alpha-20;
      }

      .radio-group__option-label {
        color: $color-white;
      }

      .radio-group__description {
        color: $color-white-alpha-90;
      }
    }

    &__options {
      display: flex;
      gap: $spacing-base;

      &--vertical {
        flex-direction: column;
      }
    }

    &__option {
      display: flex;
      align-items: flex-start;
      gap: $spacing-md;
      padding: $spacing-base;
      border: 2px solid $color-border-primary;
      border-radius: $radius-lg;
      cursor: pointer;
      transition: all $transition-base $transition-ease;
      position: relative;

      &:hover:not(&--disabled) {
        border-color: $brand-primary;
        background: $color-primary-alpha-05;
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &__input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .radio-group__circle {
        border-color: $brand-primary;
        background: $brand-primary;

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:focus + .radio-group__circle {
        box-shadow: 0 0 0 3px $color-primary-alpha-20;
      }
    }

    &__circle {
      width: 20px;
      height: 20px;
      min-width: 20px;
      border: 2px solid $color-border-primary;
      border-radius: $radius-full;
      position: relative;
      transition: all $transition-base $transition-ease;
      background: $color-white;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 8px;
        height: 8px;
        border-radius: $radius-full;
        background: $color-white;
        opacity: 0;
        transition: all $transition-base $transition-ease;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
    }

    &__option-label {
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      font-size: $font-size-sm;
    }

    &__description {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      line-height: $line-height-normal;
    }
  }
</style>
