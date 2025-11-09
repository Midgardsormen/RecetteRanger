import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoresForUser(userId: string) {
    // Tous les utilisateurs peuvent voir toutes les enseignes
    return this.prisma.store.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
