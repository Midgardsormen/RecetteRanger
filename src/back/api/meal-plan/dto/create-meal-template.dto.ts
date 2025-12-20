import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMealTemplateItemDto {
  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'AFTERNOON_SNACK', 'OTHER'],
    example: 'BREAKFAST'
  })
  @IsEnum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'AFTERNOON_SNACK', 'OTHER'])
  slot: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'AFTERNOON_SNACK' | 'OTHER';

  @ApiProperty({ description: 'Nom personnalisé pour le repas exceptionnel', required: false, example: 'Goûter d\'anniversaire' })
  @IsOptional()
  @IsString()
  customSlotName?: string;

  @ApiProperty({ description: 'Indique si c\'est un repas exceptionnel', default: false })
  @IsOptional()
  @IsBoolean()
  isExceptional?: boolean;

  @ApiProperty({ description: 'ID de la recette', required: false })
  @IsOptional()
  @IsString()
  recipeId?: string;

  @ApiProperty({ description: 'ID de l\'ingrédient (pour un ingrédient direct)', required: false })
  @IsOptional()
  @IsString()
  ingredientId?: string;

  @ApiProperty({ description: 'ID du menu', required: false })
  @IsOptional()
  @IsString()
  menuId?: string;

  @ApiProperty({ description: 'Quantité de l\'ingrédient', required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Unité de l\'ingrédient', required: false, example: 'unité' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Nombre de portions', default: 1, example: 4 })
  @IsOptional()
  @IsNumber()
  servings?: number;

  @ApiProperty({ description: 'Note optionnelle', required: false, example: 'Pour 4 personnes' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Ordre d\'affichage', default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateMealTemplateDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Nom du template', example: 'Mon petit-déj habituel' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description optionnelle du template', required: false, example: 'Petit-déjeuner équilibré pour tous les jours' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Marquer comme favori', default: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({
    description: 'Items du template',
    type: [CreateMealTemplateItemDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealTemplateItemDto)
  items?: CreateMealTemplateItemDto[];
}
