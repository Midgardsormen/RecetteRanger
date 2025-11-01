import { ApiProperty } from '@nestjs/swagger';

class CreateStepDto {
  @ApiProperty({ description: 'Numéro de l\'étape', example: 1 })
  stepNumber: number;

  @ApiProperty({ description: 'Description de l\'étape', example: 'Préchauffer le four à 180°C' })
  description: string;
}

class CreateRecipeIngredientDto {
  @ApiProperty({ description: 'ID de l\'ingrédient' })
  ingredientId: string;

  @ApiProperty({ description: 'Quantité', example: 250.5, required: false })
  quantity?: number;

  @ApiProperty({ description: 'Unité de mesure', example: 'g', required: false })
  unit?: string;

  @ApiProperty({ description: 'Note sur l\'ingrédient', example: 'Bio de préférence', required: false })
  note?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ description: 'Nom de la recette', example: 'Tarte aux pommes' })
  label: string;

  @ApiProperty({ description: 'URL de l\'image', example: 'https://example.com/tarte.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Description de la recette', example: 'Une délicieuse tarte...', required: false })
  description?: string;

  @ApiProperty({ description: 'Temps de préparation (minutes)', example: 30, default: 0 })
  prepMinutes?: number;

  @ApiProperty({ description: 'Temps de cuisson (minutes)', example: 45, default: 0 })
  cookMinutes?: number;

  @ApiProperty({ description: 'Temps de repos (minutes)', example: 20, default: 0 })
  restMinutes?: number;

  @ApiProperty({ description: 'ID du propriétaire (utilisateur)' })
  ownerId: string;

  @ApiProperty({
    description: 'Visibilité de la recette',
    enum: ['PRIVATE', 'SHARED', 'PUBLIC'],
    default: 'PRIVATE'
  })
  visibility?: 'PRIVATE' | 'SHARED' | 'PUBLIC';

  @ApiProperty({ description: 'Étapes de la recette', type: [CreateStepDto], required: false })
  steps?: CreateStepDto[];

  @ApiProperty({ description: 'Ingrédients de la recette', type: [CreateRecipeIngredientDto], required: false })
  ingredients?: CreateRecipeIngredientDto[];
}
