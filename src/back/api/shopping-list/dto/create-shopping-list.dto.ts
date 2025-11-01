import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle, ShoppingListStatus } from '@prisma/client';

export class CreateShoppingListItemDto {
  @ApiProperty({ description: 'ID de l\'ingrédient', required: false })
  ingredientId?: string;

  @ApiProperty({ description: 'Label de l\'item', example: 'Tomates cerises' })
  label: string;

  @ApiProperty({ description: 'Rayon du magasin', enum: StoreAisle, required: false })
  aisle?: StoreAisle;

  @ApiProperty({ description: 'Quantité', required: false, example: 500 })
  quantity?: number;

  @ApiProperty({ description: 'Unité de mesure', required: false, example: 'g' })
  unit?: string;

  @ApiProperty({ description: 'Item coché ou non', default: false })
  checked?: boolean;

  @ApiProperty({ description: 'Note optionnelle', required: false })
  note?: string;

  @ApiProperty({ description: 'Provient de la planification', default: false })
  fromPlan?: boolean;
}

export class CreateShoppingListDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Titre de la liste', example: 'Courses de la semaine' })
  title: string;

  @ApiProperty({ description: 'Date de début (ISO 8601)', required: false })
  fromDate?: Date;

  @ApiProperty({ description: 'Date de fin (ISO 8601)', required: false })
  toDate?: Date;

  @ApiProperty({
    description: 'Statut de la liste',
    enum: ShoppingListStatus,
    default: 'OPEN'
  })
  status?: ShoppingListStatus;

  @ApiProperty({
    description: 'Items de la liste',
    type: [CreateShoppingListItemDto],
    required: false
  })
  items?: CreateShoppingListItemDto[];
}
