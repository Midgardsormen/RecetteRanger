import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { logAndThrow } from '../../shared/utils/logger.util';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    console.log('Creating menu with data:', JSON.stringify(createMenuDto, null, 2));
    const { items, userId, ...menuData } = createMenuDto;

    try {
      const result = await this.prisma.menu.create({
        data: {
          ...menuData,
          user: userId ? { connect: { id: userId } } : undefined,
          items: items
            ? {
                create: items.map(item => ({
                  recipeId: item.recipeId || null,
                  ingredientId: item.ingredientId || null,
                  quantity: item.quantity ? Number(item.quantity) : null,
                  unit: item.unit || null,
                  servings: item.servings || 1,
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
            },
          },
        },
      });
      console.log('Menu created successfully:', result.id);
      return result;
    } catch (error) {
      logAndThrow('Error creating menu in service', error);
    }
  }

  async search(searchParams: any) {
    const { search, sortBy = 'alpha', limit = 20, page = 0, userId, filter = 'all' } = searchParams;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filtrage par propriétaire
    if (filter === 'mine' && userId) {
      where.userId = userId;
    } else if (filter === 'all' && userId) {
      // Pour l'instant, afficher tous les menus de l'utilisateur
      where.userId = userId;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'alpha') {
      orderBy = { name: 'asc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.menu.findMany({
        where,
        include: {
          items: {
            include: {
              recipe: true,
              ingredient: true,
            },
          },
          user: {
            select: {
              id: true,
              pseudo: true,
              avatarUrl: true,
            }
          }
        },
        orderBy,
        take: limit,
        skip: page * limit,
      }),
      this.prisma.menu.count({ where }),
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

  async findAll(userId?: string) {
    return this.prisma.menu.findMany({
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: {
            recipe: true,
            ingredient: true,
          },
        },
        user: {
          select: {
            id: true,
            pseudo: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
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
        },
        user: {
          select: {
            id: true,
            pseudo: true,
            avatarUrl: true,
          }
        }
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id);

    const { items, ...scalarFields } = updateMenuDto;

    const updateData: any = { ...scalarFields };

    // Gérer la mise à jour des items si fournis
    if (items !== undefined) {
      updateData.items = {
        deleteMany: {},
        create: items.map((item) => ({
          recipeId: item.recipeId || null,
          ingredientId: item.ingredientId || null,
          quantity: item.quantity ? Number(item.quantity) : null,
          unit: item.unit || null,
          servings: item.servings || 1,
        })),
      };
    }

    return this.prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            recipe: true,
            ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: `Menu with ID ${id} successfully deleted` };
  }
}
