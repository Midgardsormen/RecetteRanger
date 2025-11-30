<script lang="ts">
  import { checkboxVariantClasses, checkboxSizeClasses, defaultCheckboxConfig } from './Checkbox.config';
  import { handleChange } from './Checkbox.actions';
  import type { CheckboxVariant, CheckboxSize } from './Checkbox.config';

  interface Props {
    /**
     * ID du checkbox
     */
    id?: string;

    /**
     * État coché du checkbox
     */
    checked?: boolean;

    /**
     * Label affiché à côté du checkbox
     */
    label?: string;

    /**
     * Si true, le checkbox est désactivé
     * @default false
     */
    disabled?: boolean;

    /**
     * Variante visuelle du checkbox
     * @default 'default'
     */
    variant?: CheckboxVariant;

    /**
     * Taille du checkbox
     * @default 'md'
     */
    size?: CheckboxSize;

    /**
     * Callback appelé lors du changement d'état
     */
    onChange?: (checked: boolean) => void;

    /**
     * Classes CSS additionnelles
     */
    class?: string;
  }

  let {
    id,
    checked = $bindable(false),
    label,
    disabled = defaultCheckboxConfig.disabled,
    variant = defaultCheckboxConfig.variant,
    size = defaultCheckboxConfig.size,
    onChange,
    class: className = '',
  }: Props = $props();

  // Calculer les classes CSS
  const classes = $derived(
    [
      'checkbox',
      checkboxVariantClasses[variant],
      checkboxSizeClasses[size],
      disabled && 'checkbox--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  );

  // Gérer le changement d'état
  function onCheckboxChange() {
    handleChange(checked, onChange);
  }
</script>

<label class={classes}>
  <input
    {id}
    type="checkbox"
    class="checkbox__input"
    bind:checked
    {disabled}
    onchange={onCheckboxChange}
  />
  <span class="checkbox__checkmark"></span>
  {#if label}
    <span class="checkbox__label">{label}</span>
  {/if}
</label>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  // Base styles (mobile first)
  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    user-select: none;
    position: relative;
    padding: $spacing-sm;
    border-radius: $radius-md;
    transition: all $transition-base;

    &--disabled {
      cursor: not-allowed;
      opacity: $opacity-40;

      &:hover {
        background-color: transparent;
      }
    }
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkbox__checkmark {
      &::after {
        display: block;
      }
    }

    &:focus-visible ~ .checkbox__checkmark {
      outline: $outline-width solid $brand-primary;
      outline-offset: $outline-offset;
    }
  }

  .checkbox__checkmark {
    position: relative;
    background-color: $color-white;
    border-radius: $radius-sm;
    transition: all $transition-base;
    flex-shrink: 0;

    &::after {
      content: '';
      position: absolute;
      display: none;
      border: solid $color-white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .checkbox__label {
    line-height: $line-height-normal;
  }

  // Variants
  .checkbox--default {
    &:hover:not(.checkbox--disabled) {
      background-color: $color-primary-alpha-05;
    }

    .checkbox__checkmark {
      border: 2px solid $color-border-primary;
    }

    .checkbox__input:checked ~ .checkbox__checkmark {
      @include brand-gradient-primary;
      border-color: $brand-primary;
    }

    .checkbox__label {
      color: $color-text-primary;
    }
  }

  .checkbox--inverse {
    &:hover:not(.checkbox--disabled) {
      background-color: $color-white-alpha-10;
    }

    .checkbox__checkmark {
      border: 2px solid $color-white-alpha-30;
      background-color: transparent;
    }

    .checkbox__input:checked ~ .checkbox__checkmark {
      background-color: $color-white;
      border-color: $color-white;

      &::after {
        border-color: $brand-primary;
      }
    }

    .checkbox__label {
      color: $color-white;
    }
  }

  // Sizes
  .checkbox--sm {
    gap: $spacing-xs;
    padding: $spacing-xs;

    .checkbox__checkmark {
      height: 16px;
      width: 16px;
      min-width: 16px;

      &::after {
        left: 4px;
        top: 1px;
        width: 4px;
        height: 8px;
      }
    }

    .checkbox__label {
      font-size: $font-size-xs;
    }
  }

  .checkbox--md {
    gap: $spacing-sm;
    padding: $spacing-sm;

    .checkbox__checkmark {
      height: 20px;
      width: 20px;
      min-width: 20px;

      &::after {
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
      }
    }

    .checkbox__label {
      font-size: $font-size-sm;
    }
  }

  .checkbox--lg {
    gap: $spacing-sm;
    padding: $spacing-sm;

    .checkbox__checkmark {
      height: 24px;
      width: 24px;
      min-width: 24px;

      &::after {
        left: 8px;
        top: 3px;
        width: 6px;
        height: 12px;
      }
    }

    .checkbox__label {
      font-size: $font-size-base;
    }
  }

  // Responsive (desktop)
  @media (min-width: $breakpoint-md) {
    .checkbox {
      gap: $spacing-sm;
    }

    .checkbox--sm {
      gap: $spacing-xs;
    }
  }
</style>
