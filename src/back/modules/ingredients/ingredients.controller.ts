import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getIngredientsPage(@Request() req, @Res() res: Response) {
    // Récupérer les données des ingrédients pour l'utilisateur connecté
    const ingredients = await this.ingredientsService.getIngredientsForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Ingredients', {
      ingredients,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
