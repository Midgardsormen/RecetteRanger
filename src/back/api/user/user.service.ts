import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const { password, ...userDataWithoutPassword } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userDataWithoutPassword,
        passwordHash,
      },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        pseudo: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findUserRecentRecipes(userId: string, limit: number = 8) {
    // Vérifier que l'utilisateur existe
    await this.findPublicProfile(userId);

    // Récupérer les recettes publiques récentes de l'utilisateur
    return this.prisma.recipe.findMany({
      where: {
        ownerId: userId,
        visibility: 'PUBLIC'
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        },
        steps: {
          orderBy: {
            stepNumber: 'asc'
          }
        },
        owner: {
          select: {
            id: true,
            pseudo: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Vérifie que l'utilisateur existe

    console.log('[UserService.update] Received update for user:', id);
    console.log('[UserService.update] UpdateUserDto:', updateUserDto);
    console.log('[UserService.update] avatarUrl in DTO:', updateUserDto.avatarUrl);

    // Préparer les données de mise à jour
    const { password, ...otherData } = updateUserDto;
    const updateData: any = { ...otherData };

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    console.log('[UserService.update] Data being sent to Prisma:', updateData);
    console.log('[UserService.update] avatarUrl in updateData:', updateData.avatarUrl);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('[UserService.update] User after update from DB:', updatedUser);
    console.log('[UserService.update] avatarUrl after update:', updatedUser.avatarUrl);

    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id); // Vérifie que l'utilisateur existe

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} successfully deleted` };
  }

  async getPendingCount() {
    const count = await this.prisma.user.count({
      where: {
        accountStatus: 'PENDING',
      },
    });

    return { count };
  }

  async approveUser(id: string) {
    await this.findOne(id); // Vérifie que l'utilisateur existe

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'APPROVED',
      },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async rejectUser(id: string) {
    await this.findOne(id); // Vérifie que l'utilisateur existe

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'REJECTED',
      },
      select: {
        id: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountStatus: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
