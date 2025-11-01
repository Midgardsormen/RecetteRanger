import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Pseudo unique de l\'utilisateur', example: 'john_doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Le pseudo doit contenir au moins 3 caractères' })
  pseudo?: string;

  @ApiProperty({ description: 'Prénom', example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  firstName?: string;

  @ApiProperty({ description: 'Nom de famille', example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Le nom de famille doit contenir au moins 2 caractères' })
  lastName?: string;

  @ApiProperty({ description: 'Email unique', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'L\'email doit être valide' })
  email?: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (min 8 caractères, doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial)',
    example: 'NewSecurePassword123!',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    }
  )
  password?: string;

  @ApiProperty({ description: 'URL de l\'avatar', example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
