import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDayDto, UpdateMealPlanItemDto } from './dto/update-meal-plan.dto';
import { CreateMealSlotConfigDto, UpdateMealSlotConfigDto } from './dto/meal-slot-config.dto';

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
      include: {
        items: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
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
          customSlotName: createMealPlanItemDto.customSlotName,
          isExceptional: createMealPlanItemDto.isExceptional || false,
          recipeId: createMealPlanItemDto.recipeId,
          servings: createMealPlanItemDto.servings || 1,
          note: createMealPlanItemDto.note,
          order: createMealPlanItemDto.order || 0,
        },
        include: {
          recipe: {
            include: {
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
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

  // MealSlotConfig CRUD
  async createSlotConfig(userId: string, createMealSlotConfigDto: CreateMealSlotConfigDto) {
    try {
      return await this.prisma.mealSlotConfig.create({
        data: {
          userId,
          slot: createMealSlotConfigDto.slot,
          label: createMealSlotConfigDto.label,
          order: createMealSlotConfigDto.order,
          isEnabled: createMealSlotConfigDto.isEnabled ?? true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Une configuration existe déjà pour ce créneau');
      }
      throw error;
    }
  }

  async findAllSlotConfigs(userId: string) {
    return this.prisma.mealSlotConfig.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  async findOneSlotConfig(id: string) {
    const config = await this.prisma.mealSlotConfig.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`Configuration de créneau avec l'ID ${id} non trouvée`);
    }

    return config;
  }

  async updateSlotConfig(id: string, updateMealSlotConfigDto: UpdateMealSlotConfigDto) {
    try {
      return await this.prisma.mealSlotConfig.update({
        where: { id },
        data: updateMealSlotConfigDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Configuration de créneau avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  async removeSlotConfig(id: string) {
    try {
      return await this.prisma.mealSlotConfig.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Configuration de créneau avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  // Méthode utilitaire pour initialiser les configurations par défaut
  async initializeDefaultSlotConfigs(userId: string) {
    const defaultConfigs = [
      { slot: 'BREAKFAST' as const, label: 'Petit-déjeuner', order: 0 },
      { slot: 'LUNCH' as const, label: 'Déjeuner', order: 1 },
      { slot: 'DINNER' as const, label: 'Dîner', order: 2 },
    ];

    const existingConfigs = await this.findAllSlotConfigs(userId);

    if (existingConfigs.length === 0) {
      for (const config of defaultConfigs) {
        await this.createSlotConfig(userId, config);
      }
    }
  }
}
