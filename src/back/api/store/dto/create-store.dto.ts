import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Nom de l\'enseigne', example: 'Auchan' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'URL du logo de l\'enseigne', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logoUrl?: string;

  @ApiProperty({ description: 'Couleur pour l\'UI (hex)', required: false, example: '#FF6B35' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color (e.g., #FF6B35)' })
  color?: string;
}
