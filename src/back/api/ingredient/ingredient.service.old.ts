import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    try {
      return await this.prisma.ingredient.create({
        data: createIngredientDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un ingrédient avec ce nom existe déjà dans ce rayon');
      }
      throw error;
    }
  }

  async findAll(aisle?: string) {
    return this.prisma.ingredient.findMany({
      where: aisle ? { aisle: aisle as any } : undefined,
      orderBy: [{ aisle: 'asc' }, { label: 'asc' }],
    });
  }

  async findOne(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingrédient avec l'ID ${id} non trouvé`);
    }

    return ingredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      return await this.prisma.ingredient.update({
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
      return await this.prisma.ingredient.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Ingrédient avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
