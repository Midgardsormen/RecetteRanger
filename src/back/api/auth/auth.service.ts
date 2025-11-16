import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Vérifier si l'email ou le pseudo existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { pseudo: registerDto.pseudo },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      if (existingUser.pseudo === registerDto.pseudo) {
        throw new ConflictException('Ce pseudo est déjà utilisé');
      }
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Créer l'utilisateur
    const { password, ...userDataWithoutPassword } = registerDto;
    const user = await this.prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        passwordHash,
      },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
      },
    });

    // Générer le token JWT
    const payload = { sub: user.id, email: user.email, pseudo: user.pseudo };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    // Trouver l'utilisateur par email ou pseudo
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginDto.identifier },
          { pseudo: loginDto.identifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Vérifier le statut du compte (sauf pour les admins)
    if (user.role !== 'ADMIN') {
      if (user.accountStatus === 'PENDING') {
        throw new UnauthorizedException('Votre compte est en attente de validation par un administrateur');
      }
      if (user.accountStatus === 'REJECTED') {
        throw new UnauthorizedException('Votre demande de compte a été refusée');
      }
    }

    // Générer le token JWT
    const payload = { sub: user.id, email: user.email, pseudo: user.pseudo };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Vérifier que les nouveaux mots de passe correspondent
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    // Récupérer l'utilisateur avec son hash de mot de passe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Vérifier que le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Mettre à jour le mot de passe
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }
}
