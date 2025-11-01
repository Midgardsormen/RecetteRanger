import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Pseudo unique de l\'utilisateur', example: 'john_doe' })
  pseudo: string;

  @ApiProperty({ description: 'Prénom', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Nom de famille', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Email unique', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'Mot de passe', example: 'MySecurePassword123!' })
  password: string;

  @ApiProperty({
    description: 'URL de l\'avatar (optionnel)',
    example: 'https://example.com/avatar.jpg',
    required: false
  })
  avatarUrl?: string;
}
