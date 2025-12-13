import { ApiProperty } from '@nestjs/swagger';

export class MealPlanItemDto {
  @ApiProperty({ description: 'ID de l\'item' })
  id: string;

  @ApiProperty({ description: 'ID du jour de planification' })
  dayId: string;

  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'AFTERNOON_SNACK', 'OTHER']
  })
  slot: string;

  @ApiProperty({ description: 'Nom personnalisé pour le repas exceptionnel', nullable: true })
  customSlotName: string | null;

  @ApiProperty({ description: 'Indique si c\'est un repas exceptionnel', default: false })
  isExceptional: boolean;

  @ApiProperty({ description: 'ID de la recette', nullable: true })
  recipeId: string | null;

  @ApiProperty({ description: 'ID de l\'ingrédient (pour un ingrédient direct)', nullable: true })
  ingredientId: string | null;

  @ApiProperty({ description: 'Quantité de l\'ingrédient', nullable: true })
  quantity: number | null;

  @ApiProperty({ description: 'Unité de l\'ingrédient', nullable: true })
  unit: string | null;

  @ApiProperty({ description: 'Nombre de portions', default: 1 })
  servings: number;

  @ApiProperty({ description: 'Note optionnelle', nullable: true })
  note: string | null;

  @ApiProperty({ description: 'Ordre d\'affichage', default: 0 })
  order: number;
}

export class MealPlanDayDto {
  @ApiProperty({ description: 'ID du jour de planification' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Date du jour (UTC)' })
  date: Date;

  @ApiProperty({ description: 'Items du jour', type: [MealPlanItemDto] })
  items: MealPlanItemDto[];
}
