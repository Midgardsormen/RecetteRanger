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
import { UploadModule } from './api/upload/upload.module';

// Modules SSR pour les pages
import { HomeModule } from './modules/home/home.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { RecettesModule } from './modules/recettes/recettes.module';
import { PlanningsModule } from './modules/plannings/plannings.module';
import { ShoppingListsModule } from './modules/shopping-lists/shopping-lists.module';
import { ProfileModule } from './modules/profile/profile.module';

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
    UploadModule,
    // Modules SSR
    HomeModule,
    IngredientsModule,
    ArticlesModule,
    RecettesModule,
    PlanningsModule,
    ShoppingListsModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [SvelteRenderService],
})
export class AppModule {}
