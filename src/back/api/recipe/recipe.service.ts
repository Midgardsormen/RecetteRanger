import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto) {
    const { steps, ingredients, ...recipeData } = createRecipeDto;

    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        steps: steps
          ? {
              create: steps,
            }
          : undefined,
        ingredients: ingredients
          ? {
              create: ingredients,
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

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
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
