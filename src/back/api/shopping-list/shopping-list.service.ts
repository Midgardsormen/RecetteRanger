import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateShoppingListDto, CreateShoppingListItemDto, GenerateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto, UpdateShoppingListItemDto } from './dto/update-shopping-list.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  // ShoppingList CRUD
  async create(userId: string, createShoppingListDto: CreateShoppingListDto) {
    return this.prisma.shoppingList.create({
      data: {
        userId,
        name: createShoppingListDto.name,
        fromDate: createShoppingListDto.fromDate ? new Date(createShoppingListDto.fromDate) : null,
        toDate: createShoppingListDto.toDate ? new Date(createShoppingListDto.toDate) : null,
        status: 'DRAFT',
        items: createShoppingListDto.items
          ? {
              create: createShoppingListDto.items.map(item => ({
                ingredientId: item.ingredientId,
                label: item.label,
                aisle: item.aisle,
                quantity: item.quantity ? new Decimal(item.quantity) : null,
                unit: item.unit,
                checked: item.checked || false,
                note: item.note,
                isManual: item.isManual || false,
                mealPlanItemIds: item.mealPlanItemIds || [],
              })),
            }
          : undefined,
      },
      include: { items: true },
    });
  }

  async findAll(userId?: string, status?: string) {
    return this.prisma.shoppingList.findMany({
      where: {
        userId,
        status: status as any,
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!list) {
      throw new NotFoundException(`Liste de courses avec l'ID ${id} non trouvée`);
    }

    return list;
  }

  async update(id: string, updateShoppingListDto: UpdateShoppingListDto) {
    try {
      return await this.prisma.shoppingList.update({
        where: { id },
        data: {
          name: updateShoppingListDto.name,
          fromDate: updateShoppingListDto.fromDate ? new Date(updateShoppingListDto.fromDate) : undefined,
          toDate: updateShoppingListDto.toDate ? new Date(updateShoppingListDto.toDate) : undefined,
        },
        include: { items: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Liste de courses avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.shoppingList.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Liste de courses avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  // ShoppingListItem CRUD
  async createItem(listId: string, createShoppingListItemDto: CreateShoppingListItemDto) {
    try {
      return await this.prisma.shoppingListItem.create({
        data: {
          listId,
          ingredientId: createShoppingListItemDto.ingredientId,
          label: createShoppingListItemDto.label,
          aisle: createShoppingListItemDto.aisle,
          quantity: createShoppingListItemDto.quantity ? new Decimal(createShoppingListItemDto.quantity) : null,
          unit: createShoppingListItemDto.unit,
          checked: createShoppingListItemDto.checked || false,
          note: createShoppingListItemDto.note,
          isManual: createShoppingListItemDto.isManual !== undefined ? createShoppingListItemDto.isManual : true,
          mealPlanItemIds: createShoppingListItemDto.mealPlanItemIds || [],
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException('Liste de courses ou ingrédient non trouvé');
      }
      throw error;
    }
  }

  async updateItem(id: string, updateShoppingListItemDto: UpdateShoppingListItemDto) {
    try {
      return await this.prisma.shoppingListItem.update({
        where: { id },
        data: updateShoppingListItemDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Item avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async removeItem(id: string) {
    try {
      return await this.prisma.shoppingListItem.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Item avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  // Génération depuis le planning
  async generateFromMealPlan(userId: string, generateDto: GenerateShoppingListDto) {
    const fromDate = new Date(generateDto.fromDate);
    const toDate = new Date(generateDto.toDate);
    const now = new Date();

    // Récupérer tous les jours de planning dans la plage de dates (uniquement futures)
    const mealPlanDays = await this.prisma.mealPlanDay.findMany({
      where: {
        userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        items: {
          where: {
            recipeId: { not: null }, // Uniquement les items avec recette
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
        },
      },
    });

    // Filtrer pour ne garder que les repas futurs
    const futureMealPlanDays = mealPlanDays.filter(day => new Date(day.date) >= now);

    // Map pour regrouper les ingrédients scalables par unité
    const ingredientMap = new Map<string, {
      ingredientId: string;
      label: string;
      aisle: any;
      quantities: Map<string, { amount: number; mealPlanItemIds: string[] }>;
    }>();

    // Set pour les ingrédients non-scalables (sans doublon)
    const nonScalableIngredients = new Map<string, {
      ingredientId: string;
      label: string;
      aisle: any;
      mealPlanItemIds: string[];
    }>();

    // Parcourir tous les repas
    for (const day of futureMealPlanDays) {
      for (const mealItem of day.items) {
        if (!mealItem.recipe) continue;

        const servings = mealItem.servings;
        const recipeServings = mealItem.recipe.servings;
        const ratio = servings / recipeServings;

        // Parcourir les ingrédients de la recette
        for (const recipeIngredient of mealItem.recipe.ingredients) {
          const key = `${recipeIngredient.ingredientId}`;

          // Traiter les ingrédients NON-scalables (sel, poivre, etc.)
          if (!recipeIngredient.scalable) {
            if (!nonScalableIngredients.has(key)) {
              nonScalableIngredients.set(key, {
                ingredientId: recipeIngredient.ingredientId,
                label: recipeIngredient.ingredient.label,
                aisle: recipeIngredient.ingredient.aisle,
                mealPlanItemIds: [mealItem.id],
              });
            } else {
              // Ajouter juste la traçabilité si l'ingrédient existe déjà
              nonScalableIngredients.get(key)!.mealPlanItemIds.push(mealItem.id);
            }
            continue;
          }

          // Ignorer les ingrédients scalables sans quantité/unité
          if (!recipeIngredient.quantity || !recipeIngredient.unit) {
            continue;
          }

          // Traiter les ingrédients scalables
          const unit = recipeIngredient.unit;
          const scaledQuantity = parseFloat(recipeIngredient.quantity.toString()) * ratio;

          if (!ingredientMap.has(key)) {
            ingredientMap.set(key, {
              ingredientId: recipeIngredient.ingredientId,
              label: recipeIngredient.ingredient.label,
              aisle: recipeIngredient.ingredient.aisle,
              quantities: new Map(),
            });
          }

          const ingredient = ingredientMap.get(key)!;

          if (!ingredient.quantities.has(unit)) {
            ingredient.quantities.set(unit, { amount: 0, mealPlanItemIds: [] });
          }

          const quantityData = ingredient.quantities.get(unit)!;
          quantityData.amount += scaledQuantity;
          quantityData.mealPlanItemIds.push(mealItem.id);
        }
      }
    }

    // Créer les items de la liste de courses
    const shoppingListItems: CreateShoppingListItemDto[] = [];

    // Ajouter les ingrédients scalables avec quantités
    for (const [_, ingredient] of ingredientMap) {
      for (const [unit, quantityData] of ingredient.quantities) {
        shoppingListItems.push({
          ingredientId: ingredient.ingredientId,
          label: ingredient.label,
          aisle: ingredient.aisle,
          quantity: Math.ceil(quantityData.amount * 100) / 100, // Arrondir à 2 décimales
          unit,
          checked: false,
          isManual: false,
          mealPlanItemIds: quantityData.mealPlanItemIds,
        });
      }
    }

    // Ajouter les ingrédients non-scalables (sans quantité)
    for (const [_, ingredient] of nonScalableIngredients) {
      shoppingListItems.push({
        ingredientId: ingredient.ingredientId,
        label: ingredient.label,
        aisle: ingredient.aisle,
        quantity: undefined, // Pas de quantité pour les non-scalables
        unit: undefined,
        checked: false,
        isManual: false,
        mealPlanItemIds: ingredient.mealPlanItemIds,
      });
    }

    // Trier par rayon
    shoppingListItems.sort((a, b) => {
      if (!a.aisle) return 1;
      if (!b.aisle) return -1;
      return a.aisle.localeCompare(b.aisle);
    });

    // Générer le nom de la liste
    const name = generateDto.name ||
      `Courses du ${fromDate.toLocaleDateString('fr-FR')} au ${toDate.toLocaleDateString('fr-FR')}`;

    // Créer la liste de courses
    return this.create(userId, {
      name,
      fromDate: generateDto.fromDate,
      toDate: generateDto.toDate,
      items: shoppingListItems,
    });
  }
}
