import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  controllers: [StoresController],
  providers: [StoresService, PrismaService, SvelteRenderService],
  exports: [StoresService],
})
export class StoresModule {}
