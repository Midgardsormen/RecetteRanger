import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class MealSlotConfigDto {
  @ApiProperty({ description: 'ID de la configuration' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER']
  })
  slot: string;

  @ApiProperty({ description: 'Label personnalisé' })
  label: string;

  @ApiProperty({ description: 'Ordre d\'affichage' })
  order: number;

  @ApiProperty({ description: 'Actif ou non' })
  isEnabled: boolean;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}

export class CreateMealSlotConfigDto {
  @ApiProperty({
    description: 'Créneau du repas',
    enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER'],
    example: 'BREAKFAST'
  })
  @IsEnum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER'])
  slot: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER';

  @ApiProperty({ description: 'Label personnalisé', example: 'Petit-déjeuner' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Ordre d\'affichage', example: 0 })
  @IsNumber()
  order: number;

  @ApiProperty({ description: 'Actif ou non', default: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class UpdateMealSlotConfigDto {
  @ApiProperty({ description: 'Label personnalisé', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ description: 'Ordre d\'affichage', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ description: 'Actif ou non', required: false })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
