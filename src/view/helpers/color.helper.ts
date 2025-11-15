import type { BadgeVariant } from '../types/ingredient.types';

/**
 * Map des couleurs de badge vers leur valeur hexadécimale
 * Ces couleurs correspondent aux variables SCSS définies dans _variables.scss
 */
export const BADGE_COLORS: Record<BadgeVariant, string> = {
  // Semantic colors
  primary: '#244428',
  secondary: '#CA8F2F',
  success: '#48bb78',
  danger: '#f56565',
  warning: '#ed8936',
  info: '#4299e1',
  neutral: '#9CA3AF',

  // Extended palette
  red: '#dc2626',
  orange: '#ea580c',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
};

/**
 * Retourne la couleur hexadécimale pour un variant de badge donné
 */
export function getBadgeColor(variant: BadgeVariant): string {
  return BADGE_COLORS[variant] || BADGE_COLORS.neutral;
}
