import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDayDto, UpdateMealPlanItemDto } from './dto/update-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(private prisma: PrismaService) {}

  // MealPlanDay CRUD
  async createDay(createMealPlanDayDto: CreateMealPlanDayDto) {
    try {
      return await this.prisma.mealPlanDay.create({
        data: {
          userId: createMealPlanDayDto.userId,
          date: new Date(createMealPlanDayDto.date),
          items: createMealPlanDayDto.items
            ? {
                create: createMealPlanDayDto.items.map(item => ({
                  slot: item.slot,
                  recipeId: item.recipeId,
                  servings: item.servings || 1,
                  note: item.note,
                })),
              }
            : undefined,
        },
        include: { items: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un jour de planification existe déjà pour cette date et cet utilisateur');
      }
      throw error;
    }
  }

  async findAllDays(userId?: string, fromDate?: Date, toDate?: Date) {
    return this.prisma.mealPlanDay.findMany({
      where: {
        userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: { items: true },
      orderBy: { date: 'asc' },
    });
  }

  async findOneDay(id: string) {
    const day = await this.prisma.mealPlanDay.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!day) {
      throw new NotFoundException(`Jour de planification avec l'ID ${id} non trouvé`);
    }

    return day;
  }

  async updateDay(id: string, updateMealPlanDayDto: UpdateMealPlanDayDto) {
    try {
      return await this.prisma.mealPlanDay.update({
        where: { id },
        data: {
          date: updateMealPlanDayDto.date ? new Date(updateMealPlanDayDto.date) : undefined,
        },
        include: { items: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Jour de planification avec l'ID ${id} non trouvé`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Un jour de planification existe déjà pour cette date et cet utilisateur');
      }
      throw error;
    }
  }

  async removeDay(id: string) {
    try {
      return await this.prisma.mealPlanDay.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Jour de planification avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  // MealPlanItem CRUD
  async createItem(dayId: string, createMealPlanItemDto: CreateMealPlanItemDto) {
    try {
      return await this.prisma.mealPlanItem.create({
        data: {
          dayId,
          slot: createMealPlanItemDto.slot,
          recipeId: createMealPlanItemDto.recipeId,
          servings: createMealPlanItemDto.servings || 1,
          note: createMealPlanItemDto.note,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un item existe déjà pour ce créneau');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Jour de planification ou recette non trouvé');
      }
      throw error;
    }
  }

  async updateItem(id: string, updateMealPlanItemDto: UpdateMealPlanItemDto) {
    try {
      return await this.prisma.mealPlanItem.update({
        where: { id },
        data: updateMealPlanItemDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Item de planification avec l'ID ${id} non trouvé`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Un item existe déjà pour ce créneau');
      }
      throw error;
    }
  }

  async removeItem(id: string) {
    try {
      return await this.prisma.mealPlanItem.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Item de planification avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
