import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle } from '@prisma/client';

export class CreateIngredientDto {
  @ApiProperty({
    description: 'Nom de l\'ingrédient',
    example: 'Tomate'
  })
  label: string;

  @ApiProperty({
    description: 'Rayon du magasin',
    enum: StoreAisle,
    example: 'FRUITS_ET_LEGUMES'
  })
  aisle: StoreAisle;
}
