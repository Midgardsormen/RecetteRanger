import { Controller, Get, Res, UseGuards, Request, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getShoppingListsPage(@Request() req, @Res() res: Response) {
    // Rendre la page liste des listes de courses
    const html = await this.svelteRenderService.render('ShoppingLists', {
      user: req.user
    });

    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getShoppingListDetailPage(@Param('id') id: string, @Request() req, @Res() res: Response) {
    // Rendre la page de détail d'une liste
    const html = await this.svelteRenderService.render('ShoppingListDetail', {
      listId: id,
      user: req.user
    });

    res.send(html);
  }
}
