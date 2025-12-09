import { Controller, Get, Post, Res, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { UserRole } from '../../types/user.types';
import { MealPlanService } from '../../api/meal-plan/meal-plan.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService,
    private readonly mealPlanService: MealPlanService,
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getAdminPage(@Request() req, @Res() res: Response) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Admin', {
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Post('reset-meal-slots')
  @UseGuards(JwtAuthRedirectGuard)
  async resetMealSlots(@Request() req) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    // Réinitialiser les créneaux pour l'utilisateur connecté
    await this.mealPlanService.initializeDefaultSlotConfigs(req.user.id);

    return {
      success: true,
      message: 'Créneaux de repas réinitialisés avec succès'
    };
  }
}
