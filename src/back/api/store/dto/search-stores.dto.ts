import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStoresDto {
  @ApiProperty({ description: 'Recherche par nom', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Nombre de résultats par page', required: false, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({ description: 'Numéro de la page', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
}
