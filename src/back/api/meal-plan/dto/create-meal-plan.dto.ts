import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMealPlanItemDto {
  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'AFTERNOON_SNACK', 'OTHER'],
    example: 'LUNCH'
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

export class CreateMealPlanDayDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Date du jour (ISO 8601)', example: '2025-01-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Items du jour',
    type: [CreateMealPlanItemDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealPlanItemDto)
  items?: CreateMealPlanItemDto[];
}
