import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [PrismaModule],
  controllers: [IngredientsController],
  providers: [IngredientsService, SvelteRenderService],
})
export class IngredientsModule {}
