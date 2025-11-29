import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto, SearchStoresDto } from './dto';
import { normalizeString } from '../../shared/utils/string.utils';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    // Vérifier si l'enseigne existe déjà
    const existing = await this.prisma.store.findUnique({
      where: { name: createStoreDto.name },
    });

    if (existing) {
      throw new ConflictException(`L'enseigne "${createStoreDto.name}" existe déjà`);
    }

    return this.prisma.store.create({
      data: createStoreDto,
    });
  }

  async findAll(searchDto?: SearchStoresDto) {
    const { search, limit = 20, page = 1 } = searchDto || {};

    // Si recherche textuelle, filtrer côté application avec normalisation
    if (search) {
      const normalizedSearch = normalizeString(search);

      // Récupérer tous les magasins pour filtrer avec normalisation
      const allStores = await this.prisma.store.findMany({
        orderBy: { name: 'asc' },
      });

      // Filtrer avec normalisation des accents
      const filteredStores = allStores.filter(store => {
        const normalizedName = normalizeString(store.name);
        return normalizedName.includes(normalizedSearch);
      });

      // Appliquer la pagination manuellement
      const total = filteredStores.length;
      const paginatedStores = filteredStores.slice(
        (page - 1) * limit,
        page * limit
      );

      return {
        stores: paginatedStores,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Pas de recherche : utiliser la pagination normale
    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.store.count(),
    ]);

    return {
      stores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException(`Enseigne avec l'ID "${id}" introuvable`);
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    // Vérifier que l'enseigne existe
    await this.findOne(id);

    // Si on change le nom, vérifier qu'il n'existe pas déjà
    if (updateStoreDto.name) {
      const existing = await this.prisma.store.findUnique({
        where: { name: updateStoreDto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(`L'enseigne "${updateStoreDto.name}" existe déjà`);
      }
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: string) {
    // Vérifier que l'enseigne existe
    await this.findOne(id);

    return this.prisma.store.delete({
      where: { id },
    });
  }

  async checkDuplicates(name: string) {
    const similarStores = await this.prisma.store.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        color: true,
      },
      take: 5,
    });

    return {
      similarStores,
    };
  }
}
