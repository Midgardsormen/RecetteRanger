import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Pseudo unique de l\'utilisateur', example: 'john_doe', required: false })
  pseudo?: string;

  @ApiProperty({ description: 'Prénom', example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Nom de famille', example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Email unique', example: 'john.doe@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'URL de l\'avatar', example: 'https://example.com/avatar.jpg', required: false })
  avatarUrl?: string;
}
