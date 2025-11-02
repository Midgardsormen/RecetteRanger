import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { StoreAisle, Unit } from '@prisma/client';
import { Type } from 'class-transformer';

export class SearchIngredientsDto {
  @ApiProperty({
    description: 'Recherche par nom',
    required: false,
    example: 'tomate',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtre par catégorie/rayon',
    enum: StoreAisle,
    required: false,
  })
  @IsOptional()
  @IsEnum(StoreAisle)
  aisle?: StoreAisle;

  @ApiProperty({
    description: 'Filtre par unité disponible',
    enum: Unit,
    required: false,
  })
  @IsOptional()
  @IsEnum(Unit)
  unit?: Unit;

  @ApiProperty({
    description: 'Tri (alpha, date, popularity)',
    enum: ['alpha', 'date', 'popularity'],
    required: false,
    default: 'alpha',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'alpha' | 'date' | 'popularity';

  @ApiProperty({
    description: 'Nombre d\'éléments par page',
    required: false,
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Numéro de page (commence à 0)',
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;
}
