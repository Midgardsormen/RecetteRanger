import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SvelteRenderService } from './services/svelte-render.service';
import { NavigationModule } from './modules/navigation/navigation.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { RecipeModule } from './api/recipe/recipe.module';
import { IngredientModule } from './api/ingredient/ingredient.module';
import { MealPlanModule } from './api/meal-plan/meal-plan.module';
import { ShoppingListModule } from './api/shopping-list/shopping-list.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NavigationModule,
    UserModule,
    RecipeModule,
    IngredientModule,
    MealPlanModule,
    ShoppingListModule,
  ],
  controllers: [AppController],
  providers: [SvelteRenderService],
})
export class AppModule {}
