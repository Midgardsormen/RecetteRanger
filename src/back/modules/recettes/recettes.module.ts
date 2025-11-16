import { Module } from '@nestjs/common';
import { RecettesController } from './recettes.controller';
import { RecipeModule } from '../../api/recipe/recipe.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [RecipeModule],
  controllers: [RecettesController],
  providers: [SvelteRenderService],
})
export class RecettesModule {}
