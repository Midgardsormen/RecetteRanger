import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { MealPlanModule } from '../../api/meal-plan/meal-plan.module';

@Module({
  imports: [PrismaModule, MealPlanModule],
  controllers: [AdminController],
  providers: [SvelteRenderService],
})
export class AdminModule {}
