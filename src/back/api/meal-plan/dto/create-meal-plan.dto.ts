import { ApiProperty } from '@nestjs/swagger';

export class CreateMealPlanItemDto {
  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER'],
    example: 'LUNCH'
  })
  slot: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER';

  @ApiProperty({ description: 'ID de la recette', required: false })
  recipeId?: string;

  @ApiProperty({ description: 'Nombre de portions', default: 1, example: 4 })
  servings?: number;

  @ApiProperty({ description: 'Note optionnelle', required: false, example: 'Pour 4 personnes' })
  note?: string;
}

export class CreateMealPlanDayDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Date du jour (ISO 8601)', example: '2025-01-15T00:00:00.000Z' })
  date: Date;

  @ApiProperty({
    description: 'Items du jour',
    type: [CreateMealPlanItemDto],
    required: false
  })
  items?: CreateMealPlanItemDto[];
}
