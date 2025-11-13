<script lang="ts">
  interface Props {
    value: number; // Valeur actuelle (0-max)
    max?: number; // Valeur maximale (défaut: 100)
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    showLabel?: boolean; // Afficher le label en pourcentage
    label?: string; // Label personnalisé à afficher
    animated?: boolean; // Animation de progression
  }

  let {
    value,
    max = 100,
    size = 'medium',
    variant = 'primary',
    showLabel = false,
    label,
    animated = true
  }: Props = $props();

  // Calculer le pourcentage
  let percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));

  // Label à afficher
  let displayLabel = $derived(label || `${Math.round(percentage)}%`);
</script>

<div
  class="progress-bar"
  class:progress-bar--small={size === 'small'}
  class:progress-bar--medium={size === 'medium'}
  class:progress-bar--large={size === 'large'}
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={displayLabel}
>
  <div
    class="progress-bar__fill"
    class:progress-bar__fill--primary={variant === 'primary'}
    class:progress-bar__fill--secondary={variant === 'secondary'}
    class:progress-bar__fill--success={variant === 'success'}
    class:progress-bar__fill--danger={variant === 'danger'}
    class:progress-bar__fill--warning={variant === 'warning'}
    class:progress-bar__fill--info={variant === 'info'}
    class:progress-bar__fill--animated={animated}
    style="width: {percentage}%"
  ></div>
  {#if showLabel}
    <span class="progress-bar__label">{displayLabel}</span>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .progress-bar {
    position: relative;
    width: 100%;
    background: $color-gray-200;
    border-radius: $radius-full;
    overflow: hidden;
    display: flex;
    align-items: center;

    // Sizes
    &--small {
      height: 6px;

      .progress-bar__label {
        font-size: $font-size-xs;
      }
    }

    &--medium {
      height: 8px;

      .progress-bar__label {
        font-size: $font-size-sm;
      }
    }

    &--large {
      height: 12px;

      .progress-bar__label {
        font-size: $font-size-base;
      }
    }
  }

  .progress-bar__fill {
    height: 100%;
    border-radius: $radius-full;
    transition: width $transition-base $transition-ease;

    // Variants
    &--primary {
      background: $brand-primary;
    }

    &--secondary {
      background: $brand-secondary;
    }

    &--success {
      background: $color-success;
    }

    &--danger {
      background: $color-danger;
    }

    &--warning {
      background: $color-warning;
    }

    &--info {
      background: $color-info;
    }

    // Animation
    &--animated {
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba($color-white, $opacity-30),
          transparent
        );
        animation: shimmer 2s infinite;
      }
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .progress-bar__label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    pointer-events: none;
    white-space: nowrap;
    z-index: 1;
  }
</style>
