import { Controller, Get, Res, UseGuards, Request, Param, NotFoundException, Query } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { MenuService } from '../../api/menu/menu.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('menus')
export class MenusController {
  constructor(
    private readonly menuService: MenuService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getMenusPage(@Request() req, @Query('userId') userId: string, @Res() res: Response) {
    // Récupérer les menus pour l'utilisateur connecté
    const filter = userId ? (userId === req.user.id ? 'mine' : 'all') : 'all';
    const result = await this.menuService.search({
      userId: req.user.id,
      filter,
      limit: 1000,
      page: 0
    });

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Menus', {
      menus: result.data,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthRedirectGuard)
  async getMenuDetailPage(@Request() req, @Param('id') id: string, @Res() res: Response) {
    // Récupérer le menu
    const menu = await this.menuService.findOne(id);

    if (!menu) {
      throw new NotFoundException('Menu non trouvé');
    }

    // Vérifier les droits d'accès
    if (menu.userId !== req.user.id) {
      throw new NotFoundException('Menu non trouvé');
    }

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('MenuDetail', {
      menu,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
