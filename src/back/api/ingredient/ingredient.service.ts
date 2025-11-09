import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { SearchIngredientsDto } from './dto/search-ingredients.dto';
import { CheckDuplicatesDto, CheckDuplicatesResponseDto, SimilarIngredientDto } from './dto/check-duplicates.dto';
import { areSimilar, normalizeString, similarityPercentage } from '../../shared/utils/string.utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    try {
      const data: Prisma.ArticleCreateInput = {
        label: createIngredientDto.label,
        aisle: createIngredientDto.aisle,
        units: createIngredientDto.units,
        imageUrl: createIngredientDto.imageUrl,
        seasonMonths: createIngredientDto.seasonMonths || [],
        usageCount: 0,
        isFood: createIngredientDto.isFood !== undefined ? createIngredientDto.isFood : true,
      };

      return await this.prisma.article.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un article avec ce nom existe déjà dans ce rayon');
      }
      throw error;
    }
  }

  async findAll(aisle?: string, isFood?: boolean) {
    return this.prisma.article.findMany({
      where: {
        ...(aisle ? { aisle: aisle as any } : {}),
        ...(isFood !== undefined ? { isFood } : {}),
      },
      orderBy: [{ aisle: 'asc' }, { label: 'asc' }],
    });
  }

  async search(searchDto: SearchIngredientsDto) {
    const {
      search,
      aisle,
      unit,
      sortBy = 'alpha',
      limit = 20,
      page = 0,
      isFood,
    } = searchDto;

    const where: Prisma.ArticleWhereInput = {};

    // Filtre par recherche textuelle
    if (search) {
      where.label = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filtre par rayon
    if (aisle) {
      where.aisle = aisle;
    }

    // Filtre par unité disponible
    if (unit) {
      where.units = {
        has: unit,
      };
    }

    // Filtre par type (alimentaire / non-alimentaire)
    if (isFood !== undefined) {
      where.isFood = isFood;
    }

    // Configuration du tri
    let orderBy: Prisma.ArticleOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'alpha':
        orderBy = { label: 'asc' };
        break;
      case 'popularity':
        orderBy = { usageCount: 'desc' };
        break;
      case 'date':
      default:
        // Par défaut, trier par date de création décroissante (plus récent en premier)
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Récupération des résultats avec pagination
    const [total, ingredients] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        orderBy,
        skip: page * limit,
        take: limit,
      }),
    ]);

    return {
      data: ingredients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkDuplicates(checkDto: CheckDuplicatesDto): Promise<CheckDuplicatesResponseDto> {
    const { label } = checkDto;
    const normalizedLabel = normalizeString(label);

    // Récupération de tous les ingrédients pour comparaison
    const allIngredients = await this.prisma.article.findMany({
      select: {
        id: true,
        label: true,
        aisle: true,
      },
    });

    const similarIngredients: SimilarIngredientDto[] = [];

    for (const ingredient of allIngredients) {
      // Vérification de similarité avec seuil de 70%
      if (areSimilar(label, ingredient.label, 70)) {
        const similarity = similarityPercentage(
          normalizedLabel,
          normalizeString(ingredient.label)
        );

        similarIngredients.push({
          id: ingredient.id,
          label: ingredient.label,
          aisle: ingredient.aisle,
          similarity: Math.round(similarity * 10) / 10, // Arrondi à 1 décimale
        });
      }
    }

    // Tri par similarité décroissante
    similarIngredients.sort((a, b) => b.similarity - a.similarity);

    return {
      hasDuplicates: similarIngredients.length > 0,
      similarIngredients,
    };
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingrédient avec l'ID ${id} non trouvé`);
    }

    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      return await this.prisma.article.update({
        where: { id },
        data: updateIngredientDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Ingrédient avec l'ID ${id} non trouvé`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Un ingrédient avec ce nom existe déjà dans ce rayon');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.article.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Ingrédient avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async incrementUsageCount(id: string) {
    return await this.prisma.article.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}
