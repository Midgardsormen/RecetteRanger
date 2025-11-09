import { ApiProperty } from '@nestjs/swagger';

export class StoreDto {
  @ApiProperty({ description: 'ID de l\'enseigne' })
  id: string;

  @ApiProperty({ description: 'Nom de l\'enseigne' })
  name: string;

  @ApiProperty({ description: 'URL du logo de l\'enseigne', required: false })
  logoUrl?: string | null;

  @ApiProperty({ description: 'Couleur pour l\'UI' })
  color: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
