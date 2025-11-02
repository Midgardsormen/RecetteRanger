import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class PlanningsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlanningsForUser(userId: string) {
    // Récupérer les plannings de l'utilisateur (MealPlanDay)
    return this.prisma.mealPlanDay.findMany({
      where: {
        userId: userId
      },
      include: {
        items: {
          include: {
            recipe: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
}
