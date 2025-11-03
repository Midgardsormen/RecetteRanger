import type { Ingredient } from './ingredient.types';

export interface Recipe {
  id: string;
  label: string;
  imageUrl: string | null;
  description: string | null;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  ownerId: string | null;
  visibility: RecipeVisibility;
  steps: Step[];
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  description: string;
  durationMinutes: number;
  recipeId: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number | null;
  unit: string | null;
  note: string | null;
}

export enum RecipeVisibility {
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED',
  PUBLIC = 'PUBLIC',
}

export enum RecipeCategory {
  ENTREE = 'ENTREE',
  PLAT = 'PLAT',
  DESSERT = 'DESSERT',
  ACCOMPAGNEMENT = 'ACCOMPAGNEMENT',
  APERITIF = 'APERITIF',
  BOISSON = 'BOISSON',
  SAUCE = 'SAUCE',
  PETIT_DEJEUNER = 'PETIT_DEJEUNER',
}

export const RecipeCategoryLabels: Record<RecipeCategory, string> = {
  [RecipeCategory.ENTREE]: 'Entrée',
  [RecipeCategory.PLAT]: 'Plat',
  [RecipeCategory.DESSERT]: 'Dessert',
  [RecipeCategory.ACCOMPAGNEMENT]: 'Accompagnement',
  [RecipeCategory.APERITIF]: 'Apéritif',
  [RecipeCategory.BOISSON]: 'Boisson',
  [RecipeCategory.SAUCE]: 'Sauce',
  [RecipeCategory.PETIT_DEJEUNER]: 'Petit-déjeuner',
};

export const RecipeVisibilityLabels: Record<RecipeVisibility, string> = {
  [RecipeVisibility.PRIVATE]: 'Privée',
  [RecipeVisibility.SHARED]: 'Partagée',
  [RecipeVisibility.PUBLIC]: 'Publique',
};

export interface CreateRecipeDto {
  label: string;
  imageUrl?: string;
  description?: string;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number;
  servings: number;
  category?: RecipeCategory;
  visibility?: RecipeVisibility;
  ingredients: CreateRecipeIngredientDto[];
  steps: CreateStepDto[];
}

export interface CreateRecipeIngredientDto {
  ingredientId: string;
  quantity?: number;
  unit?: string;
  note?: string;
}

export interface CreateStepDto {
  stepNumber: number;
  description: string;
  durationMinutes?: number;
}

export interface RecipeFormData {
  // Étape 1
  label: string;
  category: RecipeCategory;
  cookMinutes: number;
  prepMinutes: number;
  servings: number;
  imageUrl: string;

  // Étape 2
  ingredients: RecipeIngredientInput[];

  // Étape 3
  steps: StepInput[];
}

export interface RecipeIngredientInput {
  ingredientId: string;
  ingredientLabel?: string; // Pour l'affichage
  quantity: string; // String pour gérer les décimales dans l'input
  unit: string;
  note: string;
  availableUnits?: string[]; // Unités disponibles pour cet ingrédient
}

export interface StepInput {
  description: string;
  durationMinutes: string; // String pour gérer les nombres dans l'input
}
