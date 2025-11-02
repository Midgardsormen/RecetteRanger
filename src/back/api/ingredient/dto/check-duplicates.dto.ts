import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CheckDuplicatesDto {
  @ApiProperty({
    description: 'Nom de l\'ingrédient à vérifier',
    example: 'Tomate',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  label: string;
}

export class SimilarIngredientDto {
  @ApiProperty({ description: 'ID de l\'ingrédient similaire' })
  id: string;

  @ApiProperty({ description: 'Nom de l\'ingrédient similaire' })
  label: string;

  @ApiProperty({ description: 'Rayon de l\'ingrédient similaire' })
  aisle: string;

  @ApiProperty({ description: 'Pourcentage de similarité (0-100)', example: 95.5 })
  similarity: number;
}

export class CheckDuplicatesResponseDto {
  @ApiProperty({ description: 'Indique si des doublons potentiels ont été trouvés' })
  hasDuplicates: boolean;

  @ApiProperty({
    description: 'Liste des ingrédients similaires',
    type: [SimilarIngredientDto],
  })
  similarIngredients: SimilarIngredientDto[];
}
