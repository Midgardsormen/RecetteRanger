import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class ShoppingListsService {
  constructor(private readonly prisma: PrismaService) {}

  async getShoppingListsForUser(userId: string) {
    // Récupérer les listes de courses de l'utilisateur
    return this.prisma.shoppingList.findMany({
      where: {
        userId: userId
      },
      include: {
        items: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
