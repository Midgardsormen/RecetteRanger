import { Controller, Get, Res, Request } from '@nestjs/common';
import { Response } from 'express';
import { HomeService } from './home.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller()
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  async getHomePage(@Request() req, @Res() res: Response) {
    // Vérifier si l'utilisateur est connecté via le cookie
    const user = await this.homeService.getUserFromRequest(req);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Home', {
      user
    });

    res.send(html);
  }
}
