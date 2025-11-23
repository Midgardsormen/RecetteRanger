import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('plannings')
export class PlanningsController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getPlanningsPage(@Request() req, @Res() res: Response) {
    // Rendre la nouvelle page de planning avec calendrier
    const html = await this.svelteRenderService.render('MealPlanning', {
      user: req.user
    });

    res.send(html);
  }

  @Get('settings')
  @UseGuards(JwtAuthRedirectGuard)
  async getSettingsPage(@Request() req, @Res() res: Response) {
    // Rendre la page de configuration des slots
    const html = await this.svelteRenderService.render('MealPlanningSettings', {
      user: req.user
    });

    res.send(html);
  }
}
