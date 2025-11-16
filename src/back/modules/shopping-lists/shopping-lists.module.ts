import { Module } from '@nestjs/common';
import { ShoppingListsController } from './shopping-lists.controller';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  controllers: [ShoppingListsController],
  providers: [SvelteRenderService],
})
export class ShoppingListsModule {}
