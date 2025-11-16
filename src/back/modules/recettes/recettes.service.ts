import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class RecettesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecettesForUser(userId: string, filterOwnerId?: string) {
    let whereClause: any;

    if (filterOwnerId) {
      // Si on filtre par un propriétaire spécifique
      if (filterOwnerId === userId) {
        // Si c'est mes propres recettes, afficher toutes mes recettes
        whereClause = { ownerId: filterOwnerId };
      } else {
        // Si c'est les recettes d'un autre utilisateur, afficher uniquement ses recettes publiques
        whereClause = {
          ownerId: filterOwnerId,
          visibility: 'PUBLIC'
        };
      }
    } else {
      // Pas de filtre : afficher mes recettes + les recettes publiques
      whereClause = {
        OR: [
          { ownerId: userId }, // Recettes de l'utilisateur
          { ownerId: null }, // Recettes publiques (disponibles pour tous)
          { visibility: 'PUBLIC' } // Recettes publiques explicites
        ]
      };
    }

    // Récupérer les recettes
    return this.prisma.recipe.findMany({
      where: whereClause,
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
        },
        owner: {
          select: {
            id: true,
            pseudo: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getRecetteForUser(recipeId: string, userId: string) {
    // Récupérer une recette spécifique si l'utilisateur y a accès
    return this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
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
        },
        owner: {
          select: {
            id: true,
            pseudo: true,
            avatarUrl: true,
          }
        }
      }
    });
  }
}
