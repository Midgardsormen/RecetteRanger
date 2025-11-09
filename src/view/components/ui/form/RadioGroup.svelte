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
  }

  let {
    label,
    options,
    value = $bindable(''),
    name,
    required = false,
    disabled = false,
    direction = 'horizontal'
  }: Props = $props();

  function handleChange(optionValue: string) {
    value = optionValue;
  }
</script>

<div class="radio-group" class:radio-group--vertical={direction === 'vertical'}>
  {#if label}
    <label class="radio-group__label">
      {label}
      {#if required}
        <span class="radio-group__required">*</span>
      {/if}
    </label>
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
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #333;
    }

    &__required {
      color: #f56565;
    }

    &__options {
      display: flex;
      gap: 1rem;

      &--vertical {
        flex-direction: column;
      }
    }

    &__option {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;

      &:hover:not(&--disabled) {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
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
        border-color: #667eea;
        background: #667eea;

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      &:focus + .radio-group__circle {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
      }
    }

    &__circle {
      width: 20px;
      height: 20px;
      min-width: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 50%;
      position: relative;
      transition: all 0.2s;
      background: white;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        opacity: 0;
        transition: all 0.2s;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    &__option-label {
      font-weight: 500;
      color: #333;
      font-size: 0.95rem;
    }

    &__description {
      font-size: 0.85rem;
      color: #666;
      line-height: 1.4;
    }
  }
</style>
