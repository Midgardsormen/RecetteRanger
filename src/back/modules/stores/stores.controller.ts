import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { StoreService } from '../../api/store/store.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storeService: StoreService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getStoresPage(@Request() req, @Res() res: Response) {
    // Récupérer les enseignes en utilisant le service de l'API
    const result = await this.storeService.findAll({ limit: 1000, page: 1 });

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Stores', {
      stores: result.stores,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
