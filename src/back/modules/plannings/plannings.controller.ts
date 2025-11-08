import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { PlanningsService } from './plannings.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('plannings')
export class PlanningsController {
  constructor(
    private readonly planningsService: PlanningsService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPlanningsPage(@Request() req, @Res() res: Response) {
    // Rendre la nouvelle page de planning avec calendrier
    const html = await this.svelteRenderService.render('MealPlanning', {
      user: req.user
    });

    res.send(html);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getSettingsPage(@Request() req, @Res() res: Response) {
    // Rendre la page de configuration des slots
    const html = await this.svelteRenderService.render('MealPlanningSettings', {
      user: req.user
    });

    res.send(html);
  }
}
