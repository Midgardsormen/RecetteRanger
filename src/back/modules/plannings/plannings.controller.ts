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
    // Récupérer les plannings pour l'utilisateur connecté
    const plannings = await this.planningsService.getPlanningsForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Plannings', {
      plannings,
      user: req.user
    });

    res.send(html);
  }
}
