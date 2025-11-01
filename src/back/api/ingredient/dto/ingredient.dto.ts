import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle } from '@prisma/client';

export class IngredientDto {
  @ApiProperty({ description: 'ID unique de l\'ingrédient' })
  id: string;

  @ApiProperty({ description: 'Nom de l\'ingrédient', example: 'Tomate' })
  label: string;

  @ApiProperty({
    description: 'Rayon du magasin',
    enum: StoreAisle
  })
  aisle: StoreAisle;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}
