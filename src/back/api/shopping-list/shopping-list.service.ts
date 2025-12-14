import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateShoppingListDto, CreateShoppingListItemDto, GenerateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto, UpdateShoppingListItemDto } from './dto/update-shopping-list.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { ShoppingListStatus } from '@prisma/client';

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
        status: (createShoppingListDto.status as ShoppingListStatus) || ShoppingListStatus.IN_PROGRESS,
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
      include: {
        items: {
          include: {
            store: true, // Inclure les données de l'enseigne
          },
        },
      },
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
          storeId: createShoppingListItemDto.storeId,
          aisle: createShoppingListItemDto.aisle,
          quantity: createShoppingListItemDto.quantity ? new Decimal(createShoppingListItemDto.quantity) : null,
          unit: createShoppingListItemDto.unit,
          checked: createShoppingListItemDto.checked || false,
          note: createShoppingListItemDto.note,
          isManual: createShoppingListItemDto.isManual !== undefined ? createShoppingListItemDto.isManual : true,
          mealPlanItemIds: createShoppingListItemDto.mealPlanItemIds || [],
        },
        include: {
          store: true, // Inclure les données de l'enseigne
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException('Liste de courses, ingrédient ou enseigne non trouvé(e)');
      }
      throw error;
    }
  }

  async updateItem(id: string, updateShoppingListItemDto: UpdateShoppingListItemDto) {
    try {
      return await this.prisma.shoppingListItem.update({
        where: { id },
        data: updateShoppingListItemDto,
        include: {
          store: true, // Inclure les données de l'enseigne
        },
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

    console.log('🔍 [Shopping List] Génération pour:', { userId, fromDate, toDate });

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
            ingredient: true, // Ingrédients directs
            menu: {
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
                },
              },
            },
          },
        },
      },
    });

    console.log('🔍 [Shopping List] Jours trouvés:', mealPlanDays.length);
    console.log('🔍 [Shopping List] Items par jour:', mealPlanDays.map(d => ({
      date: d.date,
      itemsCount: d.items.length,
      items: d.items.map(i => ({
        id: i.id,
        slot: i.slot,
        recipeId: i.recipeId,
        hasRecipe: !!i.recipe,
        ingredientsCount: i.recipe?.ingredients?.length || 0
      }))
    })));

    // Filtrer pour ne garder que les repas futurs
    const futureMealPlanDays = mealPlanDays.filter(day => new Date(day.date) >= now);
    console.log('🔍 [Shopping List] Jours futurs:', futureMealPlanDays.length);

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
        // Traiter les ingrédients directs
        if (mealItem.ingredient) {
          const key = `${mealItem.ingredientId}`;
          const unit = mealItem.unit || 'unité';
          const quantity = mealItem.quantity ? parseFloat(mealItem.quantity.toString()) : 1;

          if (!ingredientMap.has(key)) {
            ingredientMap.set(key, {
              ingredientId: mealItem.ingredientId!,
              label: mealItem.ingredient.label,
              aisle: mealItem.ingredient.aisle,
              quantities: new Map(),
            });
          }

          const ingredient = ingredientMap.get(key)!;

          if (!ingredient.quantities.has(unit)) {
            ingredient.quantities.set(unit, { amount: 0, mealPlanItemIds: [] });
          }

          const quantityData = ingredient.quantities.get(unit)!;
          quantityData.amount += quantity;
          quantityData.mealPlanItemIds.push(mealItem.id);
          continue;
        }

        // Traiter les menus
        if (mealItem.menu) {
          const menuServings = mealItem.servings;
          const menuDefaultServings = mealItem.menu.servings;
          const menuRatio = menuServings / menuDefaultServings;

          for (const menuItem of mealItem.menu.items) {
            // Traiter les recettes du menu
            if (menuItem.recipe) {
              const recipeServings = menuItem.servings;
              const recipeDefaultServings = menuItem.recipe.servings;
              const recipeRatio = (recipeServings / recipeDefaultServings) * menuRatio;

              for (const recipeIngredient of menuItem.recipe.ingredients) {
                const key = `${recipeIngredient.ingredientId}`;

                // Traiter les ingrédients NON-scalables
                if (!recipeIngredient.scalable) {
                  if (!nonScalableIngredients.has(key)) {
                    nonScalableIngredients.set(key, {
                      ingredientId: recipeIngredient.ingredientId,
                      label: recipeIngredient.ingredient.label,
                      aisle: recipeIngredient.ingredient.aisle,
                      mealPlanItemIds: [mealItem.id],
                    });
                  } else {
                    nonScalableIngredients.get(key)!.mealPlanItemIds.push(mealItem.id);
                  }
                  continue;
                }

                if (!recipeIngredient.quantity || !recipeIngredient.unit) {
                  continue;
                }

                const unit = recipeIngredient.unit;
                const scaledQuantity = parseFloat(recipeIngredient.quantity.toString()) * recipeRatio;

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
            // Traiter les ingrédients directs du menu
            else if (menuItem.ingredient) {
              const key = `${menuItem.ingredientId}`;
              const unit = menuItem.unit || 'unité';
              const quantity = menuItem.quantity ? parseFloat(menuItem.quantity.toString()) * menuRatio : 1 * menuRatio;

              if (!ingredientMap.has(key)) {
                ingredientMap.set(key, {
                  ingredientId: menuItem.ingredientId!,
                  label: menuItem.ingredient.label,
                  aisle: menuItem.ingredient.aisle,
                  quantities: new Map(),
                });
              }

              const ingredient = ingredientMap.get(key)!;

              if (!ingredient.quantities.has(unit)) {
                ingredient.quantities.set(unit, { amount: 0, mealPlanItemIds: [] });
              }

              const quantityData = ingredient.quantities.get(unit)!;
              quantityData.amount += quantity;
              quantityData.mealPlanItemIds.push(mealItem.id);
            }
          }
          continue;
        }

        // Traiter les recettes directes
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

    console.log('🔍 [Shopping List] Ingrédients scalables:', ingredientMap.size);
    console.log('🔍 [Shopping List] Ingrédients non-scalables:', nonScalableIngredients.size);

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

    console.log('🔍 [Shopping List] Total items à créer:', shoppingListItems.length);

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
