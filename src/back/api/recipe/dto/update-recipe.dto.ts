import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateStepDto {
  @ApiProperty({ description: 'Numéro de l\'étape', example: 1 })
  @IsNumber()
  stepNumber: number;

  @ApiProperty({ description: 'Description de l\'étape', example: 'Préchauffer le four à 180°C' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Durée de l\'étape (minutes)', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  durationMinutes?: number;
}

class UpdateRecipeIngredientDto {
  @ApiProperty({ description: 'ID de l\'ingrédient' })
  @IsString()
  ingredientId: string;

  @ApiProperty({ description: 'Quantité', example: 250.5, required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Unité de mesure', example: 'g', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Note sur l\'ingrédient', example: 'Bio de préférence', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ description: 'Indique si la quantité est ajustable selon le nombre de personnes', default: true, required: false })
  @IsOptional()
  scalable?: boolean;
}

export class UpdateRecipeDto {
  @ApiProperty({ description: 'Nom de la recette', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ description: 'URL de l\'image', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Description de la recette', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Temps de préparation (minutes)', required: false })
  @IsOptional()
  @IsNumber()
  prepMinutes?: number;

  @ApiProperty({ description: 'Temps de cuisson (minutes)', required: false })
  @IsOptional()
  @IsNumber()
  cookMinutes?: number;

  @ApiProperty({ description: 'Temps de repos (minutes)', required: false })
  @IsOptional()
  @IsNumber()
  restMinutes?: number;

  @ApiProperty({ description: 'Nombre de personnes', required: false })
  @IsOptional()
  @IsNumber()
  servings?: number;

  @ApiProperty({
    description: 'Difficulté de la recette',
    enum: ['VERY_EASY', 'EASY', 'MEDIUM', 'HARD'],
    required: false
  })
  @IsOptional()
  @IsEnum(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD'])
  difficulty?: 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD';

  @ApiProperty({
    description: 'Visibilité de la recette',
    enum: ['PRIVATE', 'SHARED', 'PUBLIC'],
    required: false
  })
  @IsOptional()
  @IsEnum(['PRIVATE', 'SHARED', 'PUBLIC'])
  visibility?: 'PRIVATE' | 'SHARED' | 'PUBLIC';

  @ApiProperty({ description: 'Étapes de la recette', type: [UpdateStepDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateStepDto)
  steps?: UpdateStepDto[];

  @ApiProperty({ description: 'Ingrédients de la recette', type: [UpdateRecipeIngredientDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  ingredients?: UpdateRecipeIngredientDto[];
}
