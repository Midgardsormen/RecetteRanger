import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class RecettesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecettesForUser(userId: string) {
    // Récupérer les recettes de l'utilisateur + les recettes publiques
    return this.prisma.recipe.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Recettes de l'utilisateur
          { ownerId: null }, // Recettes publiques (disponibles pour tous)
          { visibility: 'PUBLIC' } // Recettes publiques explicites
        ]
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        },
        steps: {
          orderBy: {
            stepNumber: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
