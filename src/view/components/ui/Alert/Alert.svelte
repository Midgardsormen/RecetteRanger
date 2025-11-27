<script lang="ts">
  import { Info, CheckCircle2, AlertTriangle, AlertCircle, MessageSquare, X } from 'lucide-svelte';
  import type { AlertProps } from '../../../types/ui.types';
  import { ALERT_DEFAULTS, ALERT_ARIA_LABELS } from './Alert.config';

  let {
    variant = ALERT_DEFAULTS.variant,
    title,
    closable = ALERT_DEFAULTS.closable,
    onClose,
    children
  }: AlertProps = $props();

  // Map variant to icon component
  const iconMap = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    neutral: MessageSquare,
  };

  const IconComponent = iconMap[variant];
</script>

<div class="alert alert--{variant}" role="alert">
  <div class="alert__icon">
    <IconComponent size={20} />
  </div>

  <div class="alert__content">
    {#if title}
      <div class="alert__title">{title}</div>
    {/if}
    {#if children}
      <div class="alert__body">
        {@render children()}
      </div>
    {/if}
  </div>

  {#if closable && onClose}
    <button
      class="alert__close"
      onclick={onClose}
      type="button"
      aria-label={ALERT_ARIA_LABELS.close}
    >
      <X size={16} />
    </button>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .alert {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-base;
    border-radius: $radius-md;
    border-left: 4px solid;
    position: relative;

    &__icon {
      flex-shrink: 0;
      display: flex;
      align-items: flex-start;
      padding-top: 2px;
    }

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }

    &__title {
      font-weight: $font-weight-semibold;
      font-size: $font-size-base;
      line-height: 1.4;
    }

    &__body {
      font-size: $font-size-sm;
      line-height: 1.5;
      color: inherit;
      opacity: 0.9;
    }

    &__close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: $spacing-xs;
      border-radius: $radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color $transition-fast ease;
      color: inherit;
      opacity: 0.7;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.1);
      }

      &:focus {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
    }

    // Variants
    &--info {
      background-color: rgba($color-info, 0.1);
      border-left-color: $color-info;
      color: darken($color-info, 20%);

      .alert__icon {
        color: $color-info;
      }
    }

    &--success {
      background-color: rgba($color-success, 0.1);
      border-left-color: $color-success;
      color: darken($color-success, 20%);

      .alert__icon {
        color: $color-success;
      }
    }

    &--warning {
      background-color: rgba($color-warning, 0.1);
      border-left-color: $color-warning;
      color: darken($color-warning, 30%);

      .alert__icon {
        color: $color-warning;
      }
    }

    &--error {
      background-color: rgba($color-danger, 0.1);
      border-left-color: $color-danger;
      color: darken($color-danger, 10%);

      .alert__icon {
        color: $color-danger;
      }
    }

    &--neutral {
      background-color: rgba($color-gray-500, 0.1);
      border-left-color: $color-gray-500;
      color: $color-gray-800;

      .alert__icon {
        color: $color-gray-600;
      }
    }
  }
</style>
