import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StoreAisle } from '@prisma/client';

export class CreateShoppingListItemDto {
  @ApiProperty({ description: 'ID de l\'ingrédient', required: false })
  @IsOptional()
  @IsString()
  ingredientId?: string;

  @ApiProperty({ description: 'Libellé de l\'item', example: 'Tomates cerises' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Rayon du magasin', enum: StoreAisle, required: false })
  @IsOptional()
  @IsEnum(StoreAisle)
  aisle?: StoreAisle;

  @ApiProperty({ description: 'Quantité', required: false, example: 500 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Unité de mesure', required: false, example: 'g' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Item coché ou non', default: false })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @ApiProperty({ description: 'Note optionnelle', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Est un item manuel (non généré)', default: false })
  @IsOptional()
  @IsBoolean()
  isManual?: boolean;

  @ApiProperty({ description: 'IDs des MealPlanItems sources', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mealPlanItemIds?: string[];
}

export class CreateShoppingListDto {
  @ApiProperty({ description: 'Nom de la liste', example: 'Courses du 15 au 21 janvier' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Date de début (ISO 8601)', required: false, example: '2025-01-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({ description: 'Date de fin (ISO 8601)', required: false, example: '2025-01-21T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiProperty({
    description: 'Items de la liste',
    type: [CreateShoppingListItemDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingListItemDto)
  items?: CreateShoppingListItemDto[];
}

export class GenerateShoppingListDto {
  @ApiProperty({ description: 'Date de début', example: '2025-01-15T00:00:00.000Z' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ description: 'Date de fin', example: '2025-01-21T00:00:00.000Z' })
  @IsDateString()
  toDate: string;

  @ApiProperty({ description: 'Nom personnalisé de la liste', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
