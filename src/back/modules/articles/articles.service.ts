import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async getArticlesForUser(userId: string) {
    // Les articles sont globaux (pas de userId dans le modèle)
    // On récupère tous les articles disponibles (alimentaires et non-alimentaires)
    return this.prisma.article.findMany({
      orderBy: {
        label: 'asc'
      }
    });
  }

  /**
   * Compte les articles incomplets (sans image, unités ou saisons)
   * Un article est incomplet si au moins un de ces critères est vrai :
   * - Pas d'image (imageUrl === null)
   * - Pas d'unités (units === [])
   * - Pas de saisons (seasonMonths === [])
   */
  async getIncompleteCount() {
    const count = await this.prisma.article.count({
      where: {
        OR: [
          { imageUrl: null },
          { units: { isEmpty: true } },
          { seasonMonths: { isEmpty: true } }
        ]
      }
    });

    return { count };
  }
}
