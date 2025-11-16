import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { IngredientService } from '../../api/ingredient/ingredient.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getIngredientsPage(@Request() req, @Res() res: Response) {
    // Récupérer les données des ingrédients en utilisant le service de l'API
    const ingredients = await this.ingredientService.findAll(undefined, true);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Ingredients', {
      ingredients,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
