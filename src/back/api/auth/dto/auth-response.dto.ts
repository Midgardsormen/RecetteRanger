import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT d\'accès' })
  access_token: string;

  @ApiProperty({ description: 'Informations de l\'utilisateur' })
  user: {
    id: string;
    pseudo: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}
