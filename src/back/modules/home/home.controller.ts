import { Controller, Get, Res, Request, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { HomeService } from './home.service';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';

@Controller()
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard) // Redirige vers /login si non authentifié (UX améliorée)
  async getHomePage(@Request() req, @Res() res: Response) {
    // L'utilisateur est garanti d'être connecté grâce au guard
    const user = req.user;

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Home', {
      user
    });

    res.send(html);
  }
}
