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
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $text-dark: #333;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: $spacing-base * 0.5;
    cursor: pointer;
    user-select: none;
    position: relative;
    padding: $spacing-base * 0.5;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(102, 126, 234, 0.05);
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
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      border-color: $primary-color;

      &::after {
        display: block;
      }
    }

    &:focus ~ .checkbox__checkmark {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
  }

  .checkbox__checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    min-width: 20px;
    background-color: $white;
    border: 2px solid $border-color;
    border-radius: 4px;
    transition: all 0.2s;

    &::after {
      content: '';
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .checkbox__label {
    font-size: 0.95rem;
    color: $text-dark;
    line-height: 1.4;
  }
</style>
