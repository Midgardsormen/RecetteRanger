import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class CreateStepDto {
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

class CreateRecipeIngredientDto {
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

export class CreateRecipeDto {
  @ApiProperty({ description: 'Nom de la recette', example: 'Tarte aux pommes' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'URL de l\'image', example: 'https://example.com/tarte.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Description de la recette', example: 'Une délicieuse tarte...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Temps de préparation (minutes)', example: 30, default: 0 })
  @IsOptional()
  @IsNumber()
  prepMinutes?: number;

  @ApiProperty({ description: 'Temps de cuisson (minutes)', example: 45, default: 0 })
  @IsOptional()
  @IsNumber()
  cookMinutes?: number;

  @ApiProperty({ description: 'Temps de repos (minutes)', example: 20, default: 0 })
  @IsOptional()
  @IsNumber()
  restMinutes?: number;

  @ApiProperty({ description: 'Nombre de personnes (recette pour 1 personne par défaut)', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  servings?: number;

  @ApiProperty({
    description: 'Difficulté de la recette',
    enum: ['VERY_EASY', 'EASY', 'MEDIUM', 'HARD'],
    default: 'MEDIUM'
  })
  @IsOptional()
  @IsEnum(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD'])
  difficulty?: 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD';

  @ApiProperty({ description: 'Liste du matériel nécessaire', type: [String], example: ['Fouet', 'Saladier'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  materiel?: string[];

  @ApiProperty({ description: 'Liste des appareils nécessaires', type: [String], example: ['Four', 'Mixeur'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  appareils?: string[];

  @ApiProperty({ description: 'ID du propriétaire (utilisateur)', required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({
    description: 'Visibilité de la recette',
    enum: ['PRIVATE', 'PUBLIC'],
    default: 'PRIVATE'
  })
  @IsOptional()
  @IsEnum(['PRIVATE', 'PUBLIC'])
  visibility?: 'PRIVATE' | 'PUBLIC';

  @ApiProperty({ description: 'Étapes de la recette', type: [CreateStepDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps?: CreateStepDto[];

  @ApiProperty({ description: 'Ingrédients de la recette', type: [CreateRecipeIngredientDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients?: CreateRecipeIngredientDto[];
}
