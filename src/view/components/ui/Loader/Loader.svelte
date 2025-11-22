<script lang="ts">
  /**
   * Loader Component
   *
   * A bouncing dots loader with optional message and fullscreen mode.
   * For a simple inline spinner, consider using the Spinner component instead.
   */

  import type { LoaderProps } from '../../../types/ui.types';
  import { LOADER_DEFAULTS } from './Loader.config';

  let {
    size = LOADER_DEFAULTS.size,
    variant = LOADER_DEFAULTS.variant,
    message = LOADER_DEFAULTS.message,
    fullScreen = LOADER_DEFAULTS.fullScreen
  }: LoaderProps = $props();
</script>

<div
  class="loader"
  class:loader--small={size === 'small'}
  class:loader--medium={size === 'medium'}
  class:loader--large={size === 'large'}
  class:loader--fullscreen={fullScreen}
>
  <div
    class="loader__spinner"
    class:loader__spinner--primary={variant === 'primary'}
    class:loader__spinner--secondary={variant === 'secondary'}
    class:loader__spinner--white={variant === 'white'}
  >
    <div class="loader__circle"></div>
    <div class="loader__circle"></div>
    <div class="loader__circle"></div>
  </div>
  {#if message}
    <p class="loader__message">{message}</p>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-lg;
    padding: $spacing-2xl;

    &--fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $color-white-alpha-90;
      z-index: $z-index-modal;
      backdrop-filter: blur(4px);
    }
  }

  .loader__spinner {
    display: flex;
    gap: $spacing-sm;
    align-items: center;

    &--primary .loader__circle {
      background: $brand-primary;
    }

    &--secondary .loader__circle {
      background: $brand-secondary;
    }

    &--white .loader__circle {
      background: $color-white;
    }
  }

  .loader__circle {
    width: $spacing-md;
    height: $spacing-md;
    border-radius: $radius-full;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  .loader--small .loader__circle {
    width: $spacing-sm;
    height: $spacing-sm;
  }

  .loader--large .loader__circle {
    width: $spacing-base;
    height: $spacing-base;
  }

  .loader__message {
    margin: 0;
    font-size: $font-size-base;
    color: $color-text-secondary;
    font-weight: $font-weight-medium;
    text-align: center;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: $opacity-50;
    }
    40% {
      transform: scale(1);
      opacity: $opacity-100;
    }
  }
</style>
