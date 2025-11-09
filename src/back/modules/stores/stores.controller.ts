import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { StoresService } from './stores.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getStoresPage(@Request() req, @Res() res: Response) {
    // Récupérer les enseignes pour l'utilisateur connecté
    const stores = await this.storesService.getStoresForUser(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Stores', {
      stores,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
