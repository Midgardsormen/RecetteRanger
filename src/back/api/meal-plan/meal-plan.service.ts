import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDayDto, UpdateMealPlanItemDto } from './dto/update-meal-plan.dto';
import { CreateMealSlotConfigDto, UpdateMealSlotConfigDto } from './dto/meal-slot-config.dto';

@Injectable()
export class MealPlanService {
  constructor(private prisma: PrismaService) {}

  // Normaliser une date à minuit UTC
  private normalizeToMidnightUTC(date: Date | string): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  // MealPlanDay CRUD
  async createDay(createMealPlanDayDto: CreateMealPlanDayDto) {
    try {
      const normalizedDate = this.normalizeToMidnightUTC(createMealPlanDayDto.date);
      console.log('🔍 createDay - Original date:', createMealPlanDayDto.date);
      console.log('🔍 createDay - Normalized date:', normalizedDate, normalizedDate.toISOString());

      return await this.prisma.mealPlanDay.create({
        data: {
          userId: createMealPlanDayDto.userId,
          date: normalizedDate,
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
    // Normaliser la date de début à 00:00:00 UTC
    const normalizedFromDate = fromDate ? this.normalizeToMidnightUTC(fromDate) : undefined;

    // Normaliser la date de fin à 23:59:59.999 UTC pour inclure toute la journée
    let normalizedToDate: Date | undefined = undefined;
    if (toDate) {
      normalizedToDate = this.normalizeToMidnightUTC(toDate);
      normalizedToDate.setUTCHours(23, 59, 59, 999);
    }

    const results = await this.prisma.mealPlanDay.findMany({
      where: {
        userId,
        date: {
          gte: normalizedFromDate,
          lte: normalizedToDate,
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


    return results;
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
          date: updateMealPlanDayDto.date ? this.normalizeToMidnightUTC(updateMealPlanDayDto.date) : undefined,
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
  async initializeDefaultSlotConfigs(userId: string, forceReset = false) {
    const defaultConfigs = [
      { slot: 'BREAKFAST' as const, label: 'Petit-déjeuner', order: 0, isEnabled: true },
      { slot: 'SNACK' as const, label: 'Collation', order: 1, isEnabled: true },
      { slot: 'LUNCH' as const, label: 'Déjeuner', order: 2, isEnabled: true },
      { slot: 'AFTERNOON_SNACK' as const, label: 'Goûter', order: 3, isEnabled: true },
      { slot: 'DINNER' as const, label: 'Dîner', order: 4, isEnabled: true },
      { slot: 'OTHER' as const, label: 'Autre', order: 5, isEnabled: true },
    ];

    const existingConfigs = await this.findAllSlotConfigs(userId);

    // Si forceReset = true, supprimer les anciens créneaux
    if (forceReset && existingConfigs.length > 0) {
      await this.prisma.mealSlotConfig.deleteMany({
        where: { userId },
      });
    }

    // Créer les nouveaux créneaux seulement s'il n'y en a pas ou si on a fait un reset
    if (existingConfigs.length === 0 || forceReset) {
      for (const config of defaultConfigs) {
        await this.createSlotConfig(userId, config);
      }
    }
  }
}
