import { ApiProperty } from '@nestjs/swagger';

export class MealPlanItemDto {
  @ApiProperty({ description: 'ID de l\'item' })
  id: string;

  @ApiProperty({ description: 'ID du jour de planification' })
  dayId: string;

  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER']
  })
  slot: string;

  @ApiProperty({ description: 'ID de la recette', nullable: true })
  recipeId: string | null;

  @ApiProperty({ description: 'Nombre de portions', default: 1 })
  servings: number;

  @ApiProperty({ description: 'Note optionnelle', nullable: true })
  note: string | null;
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
