import { ApiProperty } from '@nestjs/swagger';
import { StoreAisle, Unit } from '@prisma/client';
import { IsString, MinLength, IsEnum, IsArray, IsOptional, IsUrl, ArrayMinSize, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({
    description: 'Nom de l\'ingrédient',
    example: 'Tomate',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  label: string;

  @ApiProperty({
    description: 'Rayon du magasin',
    enum: StoreAisle,
    example: 'FRUITS_ET_LEGUMES'
  })
  @IsEnum(StoreAisle, { message: 'Rayon invalide' })
  aisle: StoreAisle;

  @ApiProperty({
    description: 'Unités disponibles pour cet ingrédient',
    enum: Unit,
    isArray: true,
    example: ['GRAMME', 'KILOGRAMME', 'UNITE'],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Au moins une unité doit être sélectionnée' })
  @IsEnum(Unit, { each: true, message: 'Unité invalide' })
  units: Unit[];

  @ApiProperty({
    description: 'URL de l\'image ou icône de l\'ingrédient (URL complète ou chemin relatif)',
    required: false,
    example: '/uploads/ingredients/medium/xxx.webp',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Mois de disponibilité pour favoriser le local/saisonnier (1-12)',
    required: false,
    isArray: true,
    example: [5, 6, 7, 8, 9], // Mai à septembre
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Les mois doivent être des nombres entiers' })
  @Min(1, { each: true, message: 'Les mois doivent être entre 1 et 12' })
  @Max(12, { each: true, message: 'Les mois doivent être entre 1 et 12' })
  seasonMonths?: number[];

  @ApiProperty({
    description: 'Indique si l\'article est alimentaire (true) ou non-alimentaire (false)',
    required: false,
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isFood?: boolean;
}
