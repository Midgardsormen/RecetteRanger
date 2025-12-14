import type { Recipe } from './recipe.types';
import type { Article } from './article.types';
import type { User } from './user.types';

export interface MenuItem {
  id: string;
  menuId: string;
  recipeId?: string;
  recipe?: Recipe;
  ingredientId?: string;
  ingredient?: Article;
  quantity?: number;
  unit?: string;
  servings: number;
}

export interface Menu {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  servings: number;
  userId: string;
  user?: Pick<User, 'id' | 'pseudo' | 'avatarUrl'>;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuDto {
  name: string;
  imageUrl?: string;
  description?: string;
  servings?: number;
  items?: Array<{
    recipeId?: string;
    ingredientId?: string;
    quantity?: number;
    unit?: string;
    servings?: number;
  }>;
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {}
