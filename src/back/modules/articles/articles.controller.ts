import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getArticlesPage(@Request() req, @Res() res: Response) {
    // Récupérer les données de tous les articles pour l'utilisateur connecté
    const articles = await this.articlesService.getArticlesForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Articles', {
      articles,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
