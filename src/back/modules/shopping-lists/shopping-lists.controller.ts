import { Controller, Get, Res, UseGuards, Request, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getShoppingListsPage(@Request() req, @Res() res: Response) {
    // Rendre la page liste des listes de courses
    const html = await this.svelteRenderService.render('ShoppingLists', {
      user: req.user
    });

    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthRedirectGuard)
  async getShoppingListDetailPage(@Param('id') id: string, @Request() req, @Res() res: Response) {
    // Rendre la page de détail d'une liste
    const html = await this.svelteRenderService.render('ShoppingListDetail', {
      listId: id,
      user: req.user
    });

    res.send(html);
  }
}
