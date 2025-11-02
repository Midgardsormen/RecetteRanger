import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { RecettesService } from './recettes.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('recettes')
export class RecettesController {
  constructor(
    private readonly recettesService: RecettesService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecettesPage(@Request() req, @Res() res: Response) {
    // Récupérer les recettes pour l'utilisateur connecté
    const recettes = await this.recettesService.getRecettesForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Recettes', {
      recettes,
      user: req.user
    });

    res.send(html);
  }
}
