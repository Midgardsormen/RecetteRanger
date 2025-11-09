import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle, ShoppingListStatus } from '@prisma/client';

export class StoreInfoDto {
  @ApiProperty({ description: 'ID de l\'enseigne' })
  id: string;

  @ApiProperty({ description: 'Nom de l\'enseigne' })
  name: string;

  @ApiProperty({ description: 'Logo URL', nullable: true })
  logoUrl: string | null;

  @ApiProperty({ description: 'Couleur', nullable: true })
  color: string | null;
}

export class ShoppingListItemDto {
  @ApiProperty({ description: 'ID de l\'item' })
  id: string;

  @ApiProperty({ description: 'ID de la liste' })
  listId: string;

  @ApiProperty({ description: 'ID de l\'ingrédient', nullable: true })
  ingredientId: string | null;

  @ApiProperty({ description: 'Label de l\'item (texte libre si pas d\'ingrédient)' })
  label: string;

  @ApiProperty({ description: 'ID de l\'enseigne', nullable: true })
  storeId: string | null;

  @ApiProperty({ description: 'Données de l\'enseigne', type: StoreInfoDto, nullable: true })
  store: StoreInfoDto | null;

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

  @ApiProperty({ description: 'Est un item manuel (non généré)', default: false })
  isManual: boolean;

  @ApiProperty({ description: 'IDs des MealPlanItems sources', type: [String] })
  mealPlanItemIds: string[];

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class ShoppingListDto {
  @ApiProperty({ description: 'ID de la liste' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Nom de la liste' })
  name: string;

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
