import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecipeDto {
  @ApiProperty({ description: 'Nom de la recette', required: false })
  label?: string;

  @ApiProperty({ description: 'URL de l\'image', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Description de la recette', required: false })
  description?: string;

  @ApiProperty({ description: 'Temps de préparation (minutes)', required: false })
  prepMinutes?: number;

  @ApiProperty({ description: 'Temps de cuisson (minutes)', required: false })
  cookMinutes?: number;

  @ApiProperty({ description: 'Temps de repos (minutes)', required: false })
  restMinutes?: number;

  @ApiProperty({
    description: 'Visibilité de la recette',
    enum: ['PRIVATE', 'SHARED', 'PUBLIC'],
    required: false
  })
  visibility?: 'PRIVATE' | 'SHARED' | 'PUBLIC';
}
