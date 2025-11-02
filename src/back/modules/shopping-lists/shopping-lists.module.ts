import { Module } from '@nestjs/common';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService, SvelteRenderService],
})
export class ShoppingListsModule {}
