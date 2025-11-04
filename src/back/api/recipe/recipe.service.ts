import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    console.log('Creating recipe with data:', JSON.stringify(createRecipeDto, null, 2));
    const { steps, ingredients, ...recipeData } = createRecipeDto;

    try {
      const result = await this.prisma.recipe.create({
        data: {
          ...recipeData,
          steps: steps
            ? {
                create: steps,
              }
            : undefined,
          ingredients: ingredients
            ? {
                create: ingredients.map(ing => ({
                  quantity: ing.quantity ? Number(ing.quantity) : null,
                  unit: ing.unit || null,
                  note: ing.note || null,
                  scalable: ing.scalable !== undefined ? ing.scalable : true,
                  ingredient: {
                    connect: { id: ing.ingredientId }
                  }
                })),
              }
            : undefined,
        },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' },
          },
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      console.log('Recipe created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Error creating recipe in service:', error);
      throw error;
    }
  }

  async search(searchParams: any) {
    const { search, category, sortBy = 'alpha', limit = 20, page = 0, userId, filter = 'all' } = searchParams;

    const where: any = {};

    if (search) {
      where.label = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      // Note: category n'est pas dans le schéma actuel, on ignore pour l'instant
    }

    // Filtrage par visibilité et propriétaire
    if (filter === 'mine' && userId) {
      // Afficher uniquement les recettes de l'utilisateur connecté
      where.ownerId = userId;
    } else if (filter === 'all' && userId) {
      // Afficher les recettes publiques + les recettes de l'utilisateur
      where.OR = [
        { visibility: 'PUBLIC' },
        { ownerId: userId }
      ];
    } else {
      // Si pas d'userId (utilisateur non connecté), afficher uniquement les recettes publiques
      where.visibility = 'PUBLIC';
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'alpha') {
      orderBy = { label: 'asc' };
    } else if (sortBy === 'popularity') {
      // Pour l'instant, on utilise createdAt comme fallback
      orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' },
          },
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          owner: {
            select: {
              id: true,
              pseudo: true,
            }
          }
        },
        orderBy,
        take: limit,
        skip: page * limit,
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      data: items,
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(ownerId?: string) {
    return this.prisma.recipe.findMany({
      where: ownerId ? { ownerId } : undefined,
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    await this.findOne(id);

    // Extraire les champs scalaires et les relations
    const { steps, ingredients, ...scalarFields } = updateRecipeDto;

    // Préparer les données pour Prisma
    const updateData: any = { ...scalarFields };

    // Gérer la mise à jour des étapes si fournies
    if (steps !== undefined) {
      updateData.steps = {
        deleteMany: {}, // Supprimer toutes les étapes existantes
        create: steps.map((step) => ({
          stepNumber: step.stepNumber,
          description: step.description,
          durationMinutes: step.durationMinutes || 0,
        })),
      };
    }

    // Gérer la mise à jour des ingrédients si fournis
    if (ingredients !== undefined) {
      updateData.ingredients = {
        deleteMany: {}, // Supprimer tous les ingrédients existants
        create: ingredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
          note: ing.note,
          scalable: ing.scalable !== undefined ? ing.scalable : true,
        })),
      };
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateData,
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: `Recipe with ID ${id} successfully deleted` };
  }
}
