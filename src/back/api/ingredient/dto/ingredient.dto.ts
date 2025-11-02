import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle, Unit } from '@prisma/client';

export class IngredientDto {
  @ApiProperty({ description: 'ID unique de l\'ingrédient' })
  id: string;

  @ApiProperty({ description: 'Nom de l\'ingrédient', example: 'Tomate' })
  label: string;

  @ApiProperty({
    description: 'Rayon du magasin',
    enum: StoreAisle,
    example: 'FRUITS_ET_LEGUMES'
  })
  aisle: StoreAisle;

  @ApiProperty({
    description: 'Unités disponibles pour cet ingrédient',
    enum: Unit,
    isArray: true,
    example: ['GRAMME', 'KILOGRAMME', 'UNITE'],
  })
  units: Unit[];

  @ApiProperty({
    description: 'URL de l\'image ou icône de l\'ingrédient',
    required: false,
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Mois de disponibilité (1-12)',
    isArray: true,
    type: [Number],
    example: [5, 6, 7, 8, 9],
  })
  seasonMonths: number[];

  @ApiProperty({
    description: 'Nombre d\'utilisations dans les recettes',
    example: 42,
  })
  usageCount: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière modification' })
  updatedAt: Date;
}
