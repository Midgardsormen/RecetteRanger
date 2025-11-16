import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async getUserFromRequest(req: Request) {
    try {
      // Extraire le token du cookie
      const token = req.cookies?.['access_token'];
      if (!token) {
        return null;
      }

      // Vérifier et décoder le token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise-changez-moi'
      });

      // Récupérer l'utilisateur depuis la base de données
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          pseudo: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
          createdAt: true
        }
      });

      return user;
    } catch (error) {
      // Token invalide ou expiré
      return null;
    }
  }
}
