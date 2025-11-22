<script lang="ts">
  import type { SpinnerProps } from '../../../types/ui.types';
  import { SPINNER_DEFAULTS, SPINNER_ARIA } from './Spinner.config';

  let {
    size = SPINNER_DEFAULTS.size,
    variant = SPINNER_DEFAULTS.variant,
    class: className = ''
  }: SpinnerProps = $props();
</script>

<span
  class="spinner spinner--{size} spinner--{variant} {className}"
  role={SPINNER_ARIA.role}
  aria-label={SPINNER_ARIA.label}
></span>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .spinner {
    display: inline-block;
    border-radius: $radius-full;
    border-style: solid;
    animation: spin 0.6s linear infinite;

    // Sizes
    &--sm {
      width: 12px;
      height: 12px;
      border-width: 2px;
    }

    &--md {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }

    &--lg {
      width: 24px;
      height: 24px;
      border-width: 3px;
    }

    // Variants
    &--primary {
      border-color: $color-border-primary;
      border-top-color: $brand-primary;
    }

    &--secondary {
      border-color: $color-border-primary;
      border-top-color: $brand-secondary;
    }

    &--white {
      border-color: $color-white-alpha-30;
      border-top-color: $color-white;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
