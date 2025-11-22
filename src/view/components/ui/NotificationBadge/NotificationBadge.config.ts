/**
 * NotificationBadge Configuration
 * Constants and default values for the NotificationBadge component
 */

import type { NotificationBadgeSize, NotificationBadgeVariant, NotificationBadgePosition } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const NOTIFICATION_BADGE_DEFAULTS = {
  size: 'medium' as NotificationBadgeSize,
  variant: 'danger' as NotificationBadgeVariant,
  position: 'top-right' as NotificationBadgePosition,
  animate: true,
  max: 99,
} as const;

// ============================================
// SIZES
// ============================================

export const NOTIFICATION_BADGE_SIZES = {
  small: {
    width: '16px',
    height: '16px',
    fontSize: '9px',
    minWidth: '16px',
  },
  medium: {
    width: '18px',
    height: '18px',
    fontSize: '10px',
    minWidth: '18px',
  },
  large: {
    width: '22px',
    height: '22px',
    fontSize: '11px',
    minWidth: '22px',
  },
} as const;

// ============================================
// POSITIONS
// ============================================

export const NOTIFICATION_BADGE_POSITIONS = {
  'top-left': {
    top: '-4px',
    left: '-4px',
  },
  'top-right': {
    top: '-4px',
    right: '-4px',
  },
  'bottom-left': {
    bottom: '-4px',
    left: '-4px',
  },
  'bottom-right': {
    bottom: '-4px',
    right: '-4px',
  },
} as const;
