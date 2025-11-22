<script lang="ts">
  /**
   * NotificationBadge Component
   *
   * A notification counter badge that displays a count and can be positioned
   * relative to a parent element (e.g., icon, avatar).
   * Supports different sizes, variants, and optional pulse animation.
   */

  import type { NotificationBadgeProps } from '../../../types/ui.types';
  import { NOTIFICATION_BADGE_DEFAULTS } from './NotificationBadge.config';
  import { formatNotificationCount } from './NotificationBadge.actions';

  let {
    count,
    size = NOTIFICATION_BADGE_DEFAULTS.size,
    variant = NOTIFICATION_BADGE_DEFAULTS.variant,
    position = NOTIFICATION_BADGE_DEFAULTS.position,
    animate = NOTIFICATION_BADGE_DEFAULTS.animate,
    max = NOTIFICATION_BADGE_DEFAULTS.max
  }: NotificationBadgeProps = $props();

  const displayCount = $derived(formatNotificationCount(count, max));
</script>

{#if count > 0}
  <span
    class="notification-badge"
    class:notification-badge--small={size === 'small'}
    class:notification-badge--medium={size === 'medium'}
    class:notification-badge--large={size === 'large'}
    class:notification-badge--primary={variant === 'primary'}
    class:notification-badge--secondary={variant === 'secondary'}
    class:notification-badge--success={variant === 'success'}
    class:notification-badge--danger={variant === 'danger'}
    class:notification-badge--warning={variant === 'warning'}
    class:notification-badge--info={variant === 'info'}
    class:notification-badge--top-left={position === 'top-left'}
    class:notification-badge--top-right={position === 'top-right'}
    class:notification-badge--bottom-left={position === 'bottom-left'}
    class:notification-badge--bottom-right={position === 'bottom-right'}
    class:notification-badge--animate={animate}
  >
    {displayCount}
  </span>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .notification-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    font-weight: $font-weight-bold;
    box-shadow: 0 2px 4px $color-black-alpha-20;
    flex-shrink: 0;

    // Sizes
    &--small {
      width: 16px;
      height: 16px;
      font-size: 9px;
      min-width: 16px;
    }

    &--medium {
      width: 18px;
      height: 18px;
      font-size: 10px;
      min-width: 18px;
    }

    &--large {
      width: 22px;
      height: 22px;
      font-size: 11px;
      min-width: 22px;
    }

    // Positions
    &--top-left {
      top: -4px;
      left: -4px;
    }

    &--top-right {
      top: -4px;
      right: -4px;
    }

    &--bottom-left {
      bottom: -4px;
      left: -4px;
    }

    &--bottom-right {
      bottom: -4px;
      right: -4px;
    }

    // Variants
    &--primary {
      background: $brand-primary;
      color: $color-white;
    }

    &--secondary {
      background: $brand-secondary;
      color: $color-white;
    }

    &--success {
      background: $color-success;
      color: $color-white;
    }

    &--danger {
      background: $color-danger;
      color: $color-white;
    }

    &--warning {
      background: $color-warning;
      color: $color-white;
    }

    &--info {
      background: $color-info;
      color: $color-white;
    }

    // Animation
    &--animate {
      animation: pulse 2s infinite;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
