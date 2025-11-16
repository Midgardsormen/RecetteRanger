import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { IngredientModule } from '../../api/ingredient/ingredient.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [IngredientModule],
  controllers: [IngredientsController],
  providers: [SvelteRenderService],
})
export class IngredientsModule {}
