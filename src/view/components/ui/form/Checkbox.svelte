<script lang="ts">
  interface Props {
    id?: string;
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onchange?: (e: Event) => void;
  }

  let {
    id,
    checked = $bindable(false),
    label,
    disabled = false,
    onchange
  }: Props = $props();
</script>

<label class="checkbox" class:checkbox--disabled={disabled}>
  <input
    {id}
    type="checkbox"
    class="checkbox__input"
    bind:checked
    {disabled}
    {onchange}
  />
  <span class="checkbox__checkmark"></span>
  {#if label}
    <span class="checkbox__label">{label}</span>
  {/if}
</label>

<style lang="scss">
  @import '../../../styles/variables';

  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    user-select: none;
    position: relative;
    padding: $spacing-sm;
    border-radius: $radius-md;
    transition: background-color $transition-base $transition-ease;

    &:hover {
      background-color: rgba($brand-primary, 0.05);
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.5;

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
      @include brand-gradient-primary;
      border-color: $brand-primary;

      &::after {
        display: block;
      }
    }

    &:focus ~ .checkbox__checkmark {
      box-shadow: 0 0 0 3px rgba($brand-primary, 0.2);
    }
  }

  .checkbox__checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    min-width: 20px;
    background-color: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-sm;
    transition: all $transition-base $transition-ease;

    &::after {
      content: '';
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid $color-white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .checkbox__label {
    font-size: $font-size-sm;
    color: $color-text-primary;
    line-height: $line-height-normal;
  }
</style>
