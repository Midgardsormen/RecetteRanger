import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle, ShoppingListStatus } from '@prisma/client';

export class ShoppingListItemDto {
  @ApiProperty({ description: 'ID de l\'item' })
  id: string;

  @ApiProperty({ description: 'ID de la liste' })
  listId: string;

  @ApiProperty({ description: 'ID de l\'ingrédient', nullable: true })
  ingredientId: string | null;

  @ApiProperty({ description: 'Label de l\'item (texte libre si pas d\'ingrédient)' })
  label: string;

  @ApiProperty({ description: 'Rayon du magasin', enum: StoreAisle, nullable: true })
  aisle: StoreAisle | null;

  @ApiProperty({ description: 'Quantité', nullable: true })
  quantity: number | null;

  @ApiProperty({ description: 'Unité de mesure', nullable: true })
  unit: string | null;

  @ApiProperty({ description: 'Item coché ou non', default: false })
  checked: boolean;

  @ApiProperty({ description: 'Note optionnelle', nullable: true })
  note: string | null;

  @ApiProperty({ description: 'Provient de la planification', default: false })
  fromPlan: boolean;
}

export class ShoppingListDto {
  @ApiProperty({ description: 'ID de la liste' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Titre de la liste' })
  title: string;

  @ApiProperty({ description: 'Date de début (optionnel)', nullable: true })
  fromDate: Date | null;

  @ApiProperty({ description: 'Date de fin (optionnel)', nullable: true })
  toDate: Date | null;

  @ApiProperty({
    description: 'Statut de la liste',
    enum: ShoppingListStatus
  })
  status: ShoppingListStatus;

  @ApiProperty({ description: 'Items de la liste', type: [ShoppingListItemDto] })
  items: ShoppingListItemDto[];

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
