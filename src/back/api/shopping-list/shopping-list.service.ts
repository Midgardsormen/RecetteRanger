import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateShoppingListDto, CreateShoppingListItemDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto, UpdateShoppingListItemDto } from './dto/update-shopping-list.dto';

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  // ShoppingList CRUD
  async create(createShoppingListDto: CreateShoppingListDto) {
    return this.prisma.shoppingList.create({
      data: {
        userId: createShoppingListDto.userId,
        title: createShoppingListDto.title,
        fromDate: createShoppingListDto.fromDate ? new Date(createShoppingListDto.fromDate) : null,
        toDate: createShoppingListDto.toDate ? new Date(createShoppingListDto.toDate) : null,
        status: createShoppingListDto.status || 'OPEN',
        items: createShoppingListDto.items
          ? {
              create: createShoppingListDto.items.map(item => ({
                ingredientId: item.ingredientId,
                label: item.label,
                aisle: item.aisle,
                quantity: item.quantity,
                unit: item.unit,
                checked: item.checked || false,
                note: item.note,
                fromPlan: item.fromPlan || false,
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
          title: updateShoppingListDto.title,
          fromDate: updateShoppingListDto.fromDate ? new Date(updateShoppingListDto.fromDate) : undefined,
          toDate: updateShoppingListDto.toDate ? new Date(updateShoppingListDto.toDate) : undefined,
          status: updateShoppingListDto.status,
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
          quantity: createShoppingListItemDto.quantity,
          unit: createShoppingListItemDto.unit,
          checked: createShoppingListItemDto.checked || false,
          note: createShoppingListItemDto.note,
          fromPlan: createShoppingListItemDto.fromPlan || false,
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
}
