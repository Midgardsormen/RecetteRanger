import { Controller, Get, Res, UseGuards, Request, Param, NotFoundException, Query } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { RecipeService } from '../../api/recipe/recipe.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('recettes')
export class RecettesController {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecettesPage(@Request() req, @Query('ownerId') ownerId: string, @Res() res: Response) {
    // Récupérer les recettes pour l'utilisateur connecté en utilisant le service de l'API
    // Si ownerId est fourni, filtrer par propriétaire, sinon afficher toutes les recettes accessibles
    const filter = ownerId ? (ownerId === req.user.id ? 'mine' : 'all') : 'all';
    const result = await this.recipeService.search({
      userId: req.user.id,
      filter,
      limit: 1000, // Pas de pagination pour le SSR
      page: 0
    });

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Recipes', {
      recipes: result.data,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRecetteDetailPage(@Request() req, @Param('id') id: string, @Res() res: Response) {
    // Récupérer la recette en utilisant le service de l'API
    const recipe = await this.recipeService.findOne(id);

    if (!recipe) {
      throw new NotFoundException('Recette non trouvée');
    }

    // Vérifier les droits d'accès (recette publique ou propriétaire)
    if (recipe.visibility !== 'PUBLIC' && recipe.ownerId !== req.user.id) {
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
