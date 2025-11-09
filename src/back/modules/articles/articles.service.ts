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
}
