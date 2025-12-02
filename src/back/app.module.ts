import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard, minutes } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
import { StoreModule } from './api/store/store.module';
import { CsrfMiddleware } from './shared/middleware/csrf.middleware';
import { RobotsHeaderMiddleware } from './shared/middleware/robots-header.middleware';

// Modules SSR pour les pages
import { HomeModule } from './modules/home/home.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { RecettesModule } from './modules/recettes/recettes.module';
import { PlanningsModule } from './modules/plannings/plannings.module';
import { ShoppingListsModule } from './modules/shopping-lists/shopping-lists.module';
import { ProfileModule } from './modules/profile/profile.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { DemoModule } from './modules/demo/demo.module';

@Module({
  imports: [
    // Rate limiting global
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: minutes(1), // 1 minute
        limit: 60, // 60 requêtes par minute par IP (global)
      },
    ]),
    PrismaModule,
    AuthModule,
    NavigationModule,
    UserModule,
    RecipeModule,
    IngredientModule,
    MealPlanModule,
    ShoppingListModule,
    UploadModule,
    StoreModule,
    // Modules SSR
    HomeModule,
    IngredientsModule,
    ArticlesModule,
    RecettesModule,
    PlanningsModule,
    ShoppingListsModule,
    ProfileModule,
    StoresModule,
    UsersModule,
    AdminModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [
    SvelteRenderService,
    // Activer le throttler globalement
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Appliquer le middleware CSRF sur toutes les routes API
    // sauf GET, HEAD, OPTIONS (gérés automatiquement par csrf-csrf)
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('*');

    // Appliquer le header X-Robots-Tag sur toutes les routes
    // pour empêcher l'indexation par les moteurs de recherche
    consumer
      .apply(RobotsHeaderMiddleware)
      .forRoutes('*');
  }
}
