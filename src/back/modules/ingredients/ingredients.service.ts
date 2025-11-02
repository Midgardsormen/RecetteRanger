import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getIngredientsForUser(userId: string) {
    // Les ingrédients sont globaux (pas de userId dans le modèle)
    // On récupère tous les ingrédients disponibles
    return this.prisma.ingredient.findMany({
      orderBy: {
        label: 'asc'
      }
    });
  }
}
