import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class RecettesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecettesForUser(userId: string) {
    // Récupérer les recettes de l'utilisateur (utilise ownerId)
    return this.prisma.recipe.findMany({
      where: {
        ownerId: userId
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        },
        steps: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
