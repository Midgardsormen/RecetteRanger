import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class CreateMenuItemDto {
  @ApiProperty({ description: 'ID de la recette (si item est une recette)', required: false })
  @IsOptional()
  @IsString()
  recipeId?: string;

  @ApiProperty({ description: 'ID de l\'ingrédient (si item est un ingrédient)', required: false })
  @IsOptional()
  @IsString()
  ingredientId?: string;

  @ApiProperty({ description: 'Quantité (pour les ingrédients)', example: 250.5, required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Unité de mesure (pour les ingrédients)', example: 'g', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Nombre de portions (pour les recettes)', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  servings?: number;
}

export class CreateMenuDto {
  @ApiProperty({ description: 'Nom du repas composé', example: 'Goûter d\'anniversaire' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL de l\'image', example: 'https://example.com/gouter.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Description du repas', example: 'Un délicieux goûter pour l\'anniversaire...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nombre de personnes', example: 4, default: 1 })
  @IsOptional()
  @IsNumber()
  servings?: number;

  @ApiProperty({ description: 'ID de l\'utilisateur', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Items du menu', type: [CreateMenuItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  items?: CreateMenuItemDto[];
}
