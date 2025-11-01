import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email ou pseudo de l\'utilisateur',
    example: 'john.doe@example.com'
  })
  @IsString()
  identifier: string; // peut être email ou pseudo

  @ApiProperty({
    description: 'Mot de passe',
    example: 'MySecurePassword123!'
  })
  @IsString()
  @MinLength(1, { message: 'Le mot de passe ne peut pas être vide' })
  password: string;
}
