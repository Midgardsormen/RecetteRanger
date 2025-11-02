import { Module } from '@nestjs/common';
import { RecettesController } from './recettes.controller';
import { RecettesService } from './recettes.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecettesController],
  providers: [RecettesService, SvelteRenderService],
})
export class RecettesModule {}
