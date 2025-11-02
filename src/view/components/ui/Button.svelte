<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children
  }: Props = $props();
</script>

<button
  class="button button--{variant} button--{size}"
  class:button--full-width={fullWidth}
  {type}
  {disabled}
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $success-color: #48bb78;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-primary: rgba(102, 126, 234, 0.3);
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-base * 0.5;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-duration ease;
    line-height: 1;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:focus-visible {
      outline: 2px solid $primary-color;
      outline-offset: 2px;
    }

    // Sizes
    &--small {
      padding: $spacing-base * 0.5 $spacing-base;
      font-size: 0.875rem;
    }

    &--medium {
      padding: $spacing-base * 0.75 $spacing-base * 1.5;
      font-size: 1rem;
    }

    &--large {
      padding: $spacing-base $spacing-base * 2;
      font-size: 1.125rem;
    }

    // Variants
    &--primary {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $shadow-primary;
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--secondary {
      background: $white;
      color: $primary-color;
      border: 2px solid $primary-color;

      &:hover:not(:disabled) {
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--danger {
      background: $danger-color;
      color: $white;

      &:hover:not(:disabled) {
        background: darken($danger-color, 5%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--success {
      background: $success-color;
      color: $white;

      &:hover:not(:disabled) {
        background: darken($success-color, 5%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &--ghost {
      background: transparent;
      color: $text-gray;

      &:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.05);
      }

      &:active:not(:disabled) {
        background: rgba(0, 0, 0, 0.1);
      }
    }

    &--full-width {
      width: 100%;
    }
  }
</style>
