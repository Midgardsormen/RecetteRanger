import type { Recipe } from './recipe.types';

export enum MealSlot {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  OTHER = 'OTHER',
}

export type BadgeVariant =
  // Semantic colors
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  // Extended palette
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

export const MealSlotLabels: Record<MealSlot, string> = {
  [MealSlot.BREAKFAST]: 'Petit-déjeuner',
  [MealSlot.LUNCH]: 'Déjeuner',
  [MealSlot.DINNER]: 'Dîner',
  [MealSlot.SNACK]: 'Goûter',
  [MealSlot.OTHER]: 'Autre',
};

export const MealSlotColors: Record<MealSlot, BadgeVariant> = {
  [MealSlot.BREAKFAST]: 'amber',
  [MealSlot.LUNCH]: 'emerald',
  [MealSlot.DINNER]: 'indigo',
  [MealSlot.SNACK]: 'pink',
  [MealSlot.OTHER]: 'neutral',
};

export interface MealSlotConfig {
  id: string;
  userId: string;
  slot: MealSlot;
  label: string;
  order: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealSlotConfigDto {
  slot: MealSlot;
  label: string;
  order: number;
  isEnabled?: boolean;
}

export interface UpdateMealSlotConfigDto {
  label?: string;
  order?: number;
  isEnabled?: boolean;
}

export interface MealPlanItem {
  id: string;
  dayId: string;
  slot: MealSlot;
  customSlotName: string | null;
  isExceptional: boolean;
  recipe: Recipe | null;
  recipeId: string | null;
  servings: number;
  note: string | null;
  order: number;
}

export interface MealPlanDay {
  id: string;
  userId: string;
  date: string;
  items: MealPlanItem[];
}

export interface CreateMealPlanItemDto {
  slot: MealSlot;
  customSlotName?: string;
  isExceptional?: boolean;
  recipeId?: string;
  servings?: number;
  note?: string;
  order?: number;
}

export interface UpdateMealPlanItemDto {
  slot?: MealSlot;
  customSlotName?: string;
  isExceptional?: boolean;
  recipeId?: string;
  servings?: number;
  note?: string;
  order?: number;
}

export interface CreateMealPlanDayDto {
  userId: string;
  date: Date | string;
  items?: CreateMealPlanItemDto[];
}

export interface UpdateMealPlanDayDto {
  date?: Date | string;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarDate {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  mealPlanDay?: MealPlanDay;
}
