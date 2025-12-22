import { apiService } from '../../services/api.service';
import type { MealSlotConfig } from '../../types/meal-plan.types';

/**
 * Charge les configurations de créneaux de repas pour un utilisateur
 */
export async function loadMealSlotConfigs(userId: string): Promise<MealSlotConfig[]> {
  const configs = await apiService.getMealSlotConfigs(userId);

  // Si pas de configs, initialiser
  if (configs.length === 0) {
    await apiService.initializeDefaultMealSlotConfigs(userId);
    const newConfigs = await apiService.getMealSlotConfigs(userId);
    return newConfigs.sort((a, b) => a.order - b.order);
  }

  return configs.sort((a, b) => a.order - b.order);
}

/**
 * Sauvegarde les configurations de créneaux
 */
export async function saveMealSlotConfigs(configs: MealSlotConfig[]): Promise<void> {
  await Promise.all(
    configs.map(config =>
      apiService.updateMealSlotConfig(config.id, {
        label: config.label,
        order: config.order,
        isEnabled: config.isEnabled
      })
    )
  );
}

/**
 * Déplace un créneau vers le haut dans la liste
 */
export function moveConfigUp(configs: MealSlotConfig[], index: number): MealSlotConfig[] {
  if (index === 0) return configs;

  const newConfigs = [...configs];
  const temp = newConfigs[index];
  newConfigs[index] = newConfigs[index - 1];
  newConfigs[index - 1] = temp;

  // Mettre à jour les ordres
  return newConfigs.map((config, i) => ({ ...config, order: i }));
}

/**
 * Déplace un créneau vers le bas dans la liste
 */
export function moveConfigDown(configs: MealSlotConfig[], index: number): MealSlotConfig[] {
  if (index === configs.length - 1) return configs;

  const newConfigs = [...configs];
  const temp = newConfigs[index];
  newConfigs[index] = newConfigs[index + 1];
  newConfigs[index + 1] = temp;

  // Mettre à jour les ordres
  return newConfigs.map((config, i) => ({ ...config, order: i }));
}

/**
 * Met à jour un champ d'une configuration
 */
export function updateConfigField(
  configs: MealSlotConfig[],
  index: number,
  field: keyof MealSlotConfig,
  value: any
): MealSlotConfig[] {
  const newConfigs = [...configs];
  newConfigs[index] = { ...newConfigs[index], [field]: value };
  return newConfigs;
}
