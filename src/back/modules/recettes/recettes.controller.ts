import { Controller, Get, Res, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
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
    const recipes = await this.recettesService.getRecettesForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Recipes', {
      recipes,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRecetteDetailPage(@Request() req, @Param('id') id: string, @Res() res: Response) {
    // Récupérer la recette pour l'utilisateur connecté
    const recipe = await this.recettesService.getRecetteForUser(id, req.user.id);

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('RecipeDetail', {
      recipe,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
