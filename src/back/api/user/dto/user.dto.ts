import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {
  @ApiProperty({ description: 'ID unique de l\'utilisateur' })
  id: string;

  @ApiProperty({ description: 'Pseudo unique' })
  pseudo: string;

  @ApiProperty({ description: 'Prénom' })
  firstName: string;

  @ApiProperty({ description: 'Nom de famille' })
  lastName: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Rôle de l\'utilisateur', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'URL de l\'avatar', nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière mise à jour' })
  updatedAt: Date;
}
