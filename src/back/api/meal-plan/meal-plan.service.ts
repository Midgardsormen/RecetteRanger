import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDayDto, UpdateMealPlanItemDto } from './dto/update-meal-plan.dto';
import { CreateMealSlotConfigDto, UpdateMealSlotConfigDto } from './dto/meal-slot-config.dto';
import { CreateMealTemplateDto } from './dto/create-meal-template.dto';
import { UpdateMealTemplateDto } from './dto/update-meal-template.dto';
import { DuplicateMealsDto, ApplyTemplateDto } from './dto/duplicate-meals.dto';

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
                  ingredientId: item.ingredientId,
                  menuId: item.menuId,
                  quantity: item.quantity,
                  unit: item.unit,
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
            ingredient: true, // Inclure l'ingrédient direct si présent
            menu: {
              include: {
                items: {
                  include: {
                    recipe: true,
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
          ingredientId: createMealPlanItemDto.ingredientId,
          menuId: createMealPlanItemDto.menuId,
          quantity: createMealPlanItemDto.quantity,
          unit: createMealPlanItemDto.unit,
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
          ingredient: true, // Inclure l'ingrédient direct si présent
          menu: {
            include: {
              items: {
                include: {
                  recipe: true,
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

  // ====== MealTemplate CRUD ======

  async createTemplate(createMealTemplateDto: CreateMealTemplateDto) {
    try {
      return await this.prisma.mealTemplate.create({
        data: {
          userId: createMealTemplateDto.userId,
          name: createMealTemplateDto.name,
          description: createMealTemplateDto.description,
          isFavorite: createMealTemplateDto.isFavorite || false,
          items: createMealTemplateDto.items
            ? {
                create: createMealTemplateDto.items.map(item => ({
                  slot: item.slot,
                  customSlotName: item.customSlotName,
                  isExceptional: item.isExceptional || false,
                  recipeId: item.recipeId,
                  ingredientId: item.ingredientId,
                  menuId: item.menuId,
                  quantity: item.quantity,
                  unit: item.unit,
                  servings: item.servings || 1,
                  note: item.note,
                  order: item.order || 0,
                })),
              }
            : undefined,
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
              ingredient: true,
              menu: {
                include: {
                  items: {
                    include: {
                      recipe: true,
                      ingredient: true,
                    },
                  },
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un template avec ce nom existe déjà pour cet utilisateur');
      }
      throw error;
    }
  }

  async findAllTemplates(userId: string) {
    return this.prisma.mealTemplate.findMany({
      where: { userId },
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
            ingredient: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [
        { isFavorite: 'desc' }, // Favoris en premier
        { createdAt: 'desc' },  // Plus récents ensuite
      ],
    });
  }

  async findOneTemplate(id: string) {
    const template = await this.prisma.mealTemplate.findUnique({
      where: { id },
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
            ingredient: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Template avec l'ID ${id} non trouvé`);
    }

    return template;
  }

  async updateTemplate(id: string, updateMealTemplateDto: UpdateMealTemplateDto) {
    try {
      // Ne pas permettre de mettre à jour les items via cette méthode
      // Les items seront gérés séparément si besoin
      const { items, ...updateData } = updateMealTemplateDto;

      return await this.prisma.mealTemplate.update({
        where: { id },
        data: updateData,
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
              ingredient: true,
              menu: {
                include: {
                  items: {
                    include: {
                      recipe: true,
                      ingredient: true,
                    },
                  },
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Template avec l'ID ${id} non trouvé`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Un template avec ce nom existe déjà pour cet utilisateur');
      }
      throw error;
    }
  }

  async removeTemplate(id: string) {
    try {
      return await this.prisma.mealTemplate.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Template avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  // ====== Duplication et application de templates ======

  async duplicateMealsToMultipleDates(userId: string, duplicateMealsDto: DuplicateMealsDto) {
    const { sourceDate, targetDates, conflictMode } = duplicateMealsDto;

    // Normaliser la date source
    const normalizedSourceDate = this.normalizeToMidnightUTC(sourceDate);

    // Récupérer le jour source
    const sourceDay = await this.prisma.mealPlanDay.findFirst({
      where: {
        userId,
        date: normalizedSourceDate,
      },
      include: {
        items: true,
      },
    });

    if (!sourceDay) {
      throw new NotFoundException('Aucun repas trouvé pour la date source');
    }

    const results = [];

    for (const targetDate of targetDates) {
      const normalizedTargetDate = this.normalizeToMidnightUTC(targetDate);

      // Vérifier s'il existe déjà un jour pour cette date
      const existingDay = await this.prisma.mealPlanDay.findFirst({
        where: {
          userId,
          date: normalizedTargetDate,
        },
      });

      if (existingDay) {
        if (conflictMode === 'skip') {
          results.push({ date: targetDate, status: 'skipped', reason: 'Date already has meals' });
          continue;
        } else if (conflictMode === 'replace') {
          // Supprimer le jour existant (cascade sur les items)
          await this.prisma.mealPlanDay.delete({
            where: { id: existingDay.id },
          });
        }
      }

      // Créer le nouveau jour avec les items dupliqués
      const newDay = await this.prisma.mealPlanDay.create({
        data: {
          userId,
          date: normalizedTargetDate,
          items: {
            create: sourceDay.items.map(item => ({
              slot: item.slot,
              customSlotName: item.customSlotName,
              isExceptional: item.isExceptional,
              recipeId: item.recipeId,
              ingredientId: item.ingredientId,
              menuId: item.menuId,
              quantity: item.quantity,
              unit: item.unit,
              servings: item.servings,
              note: item.note,
              order: item.order,
            })),
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
              ingredient: true,
              menu: {
                include: {
                  items: {
                    include: {
                      recipe: true,
                      ingredient: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      results.push({ date: targetDate, status: 'success', day: newDay });
    }

    return results;
  }

  async applyTemplateToMultipleDates(userId: string, applyTemplateDto: ApplyTemplateDto) {
    const { templateId, targetDates, conflictMode } = applyTemplateDto;

    // Récupérer le template
    const template = await this.findOneTemplate(templateId);

    if (template.userId !== userId) {
      throw new NotFoundException('Template non trouvé ou non autorisé');
    }

    const results = [];

    for (const targetDate of targetDates) {
      const normalizedTargetDate = this.normalizeToMidnightUTC(targetDate);

      // Vérifier s'il existe déjà un jour pour cette date
      const existingDay = await this.prisma.mealPlanDay.findFirst({
        where: {
          userId,
          date: normalizedTargetDate,
        },
      });

      if (existingDay) {
        if (conflictMode === 'skip') {
          results.push({ date: targetDate, status: 'skipped', reason: 'Date already has meals' });
          continue;
        } else if (conflictMode === 'replace') {
          // Supprimer le jour existant (cascade sur les items)
          await this.prisma.mealPlanDay.delete({
            where: { id: existingDay.id },
          });
        }
      }

      // Créer le nouveau jour avec les items du template
      const newDay = await this.prisma.mealPlanDay.create({
        data: {
          userId,
          date: normalizedTargetDate,
          items: {
            create: template.items.map(item => ({
              slot: item.slot,
              customSlotName: item.customSlotName,
              isExceptional: item.isExceptional,
              recipeId: item.recipeId,
              ingredientId: item.ingredientId,
              menuId: item.menuId,
              quantity: item.quantity,
              unit: item.unit,
              servings: item.servings,
              note: item.note,
              order: item.order,
            })),
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
              ingredient: true,
              menu: {
                include: {
                  items: {
                    include: {
                      recipe: true,
                      ingredient: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      results.push({ date: targetDate, status: 'success', day: newDay });
    }

    return results;
  }

  async duplicateSingleMeal(userId: string, duplicateSingleMealDto: { sourceMealItemId: string; targetDates: string[] }) {
    const { sourceMealItemId, targetDates } = duplicateSingleMealDto;

    // Récupérer le repas source
    const sourceMealItem = await this.prisma.mealPlanItem.findUnique({
      where: { id: sourceMealItemId },
      include: {
        day: true,
      },
    });

    if (!sourceMealItem) {
      throw new NotFoundException('Repas source non trouvé');
    }

    // Vérifier que le repas appartient bien à l'utilisateur
    if (sourceMealItem.day.userId !== userId) {
      throw new NotFoundException('Repas non trouvé ou non autorisé');
    }

    const results = [];

    for (const targetDate of targetDates) {
      const normalizedTargetDate = this.normalizeToMidnightUTC(targetDate);

      // Récupérer ou créer le jour cible
      let targetDay = await this.prisma.mealPlanDay.findFirst({
        where: {
          userId,
          date: normalizedTargetDate,
        },
      });

      if (!targetDay) {
        targetDay = await this.prisma.mealPlanDay.create({
          data: {
            userId,
            date: normalizedTargetDate,
          },
        });
      }

      // Créer le repas dupliqué
      const newMealItem = await this.prisma.mealPlanItem.create({
        data: {
          dayId: targetDay.id,
          slot: sourceMealItem.slot,
          customSlotName: sourceMealItem.customSlotName,
          isExceptional: sourceMealItem.isExceptional,
          recipeId: sourceMealItem.recipeId,
          ingredientId: sourceMealItem.ingredientId,
          menuId: sourceMealItem.menuId,
          quantity: sourceMealItem.quantity,
          unit: sourceMealItem.unit,
          servings: sourceMealItem.servings,
          note: sourceMealItem.note,
          order: sourceMealItem.order,
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
          ingredient: true,
          menu: {
            include: {
              items: {
                include: {
                  recipe: true,
                  ingredient: true,
                },
              },
            },
          },
        },
      });

      results.push({ date: targetDate, status: 'success', mealItem: newMealItem });
    }

    return results;
  }
}
