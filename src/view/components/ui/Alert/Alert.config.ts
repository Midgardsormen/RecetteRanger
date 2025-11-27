/**
 * Alert Configuration
 * Constants and default values for the Alert component
 */

import type { AlertVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const ALERT_DEFAULTS = {
  variant: 'info' as AlertVariant,
  closable: false,
} as const;

// ============================================
// ACCESSIBILITY
// ============================================

export const ALERT_ARIA_LABELS = {
  close: 'Fermer l\'alerte',
} as const;

// ============================================
// ICONS
// ============================================

export const ALERT_ICONS = {
  info: 'Info',
  success: 'CheckCircle2',
  warning: 'AlertTriangle',
  error: 'AlertCircle',
  neutral: 'MessageSquare',
} as const;
