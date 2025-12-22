import type { DropdownMenuItem } from '../../types/ui.types';

/**
 * Fonction pour ouvrir les paramètres de planning
 */
function openSettings() {
  window.location.href = '/plannings/settings';
}

/**
 * Configuration du menu des paramètres de planning
 */
export const configMenuItems: DropdownMenuItem[] = [
  {
    label: 'Personnaliser les créneaux',
    onClick: openSettings
  }
];
