import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { ShoppingListsService } from './shopping-lists.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly shoppingListsService: ShoppingListsService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getShoppingListsPage(@Request() req, @Res() res: Response) {
    // Récupérer les listes de courses pour l'utilisateur connecté
    const listes = await this.shoppingListsService.getShoppingListsForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('ShoppingLists', {
      listes,
      user: req.user
    });

    res.send(html);
  }
}
