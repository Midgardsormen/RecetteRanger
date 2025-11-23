import { Controller, Get, Res, Request } from '@nestjs/common';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { SvelteRenderService } from './services/svelte-render.service';
import { HomeService } from './modules/home/home.service';

@Controller()
@SkipThrottle() // Pages SSR publiques : pas de rate limiting
export class AppController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService,
    private readonly homeService: HomeService
  ) {}

  // Routes pour les pages d'authentification (non protégées)
  @Get('login')
  async getLogin(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Login', {});
    res.send(html);
  }

  @Get('register')
  async getRegister(@Res() res: Response) {
    const html = await this.svelteRenderService.render('Register', {});
    res.send(html);
  }

  // Pages légales (publiques, mais navigation si authentifié)
  @Get('privacy-policy')
  async getPrivacyPolicy(@Request() req, @Res() res: Response) {
    // Vérifier si l'utilisateur est connecté via le cookie
    const user = await this.homeService.getUserFromRequest(req);

    const html = await this.svelteRenderService.render('PrivacyPolicy', {
      user
    });
    res.send(html);
  }

  @Get('legal-notice')
  async getLegalNotice(@Request() req, @Res() res: Response) {
    // Vérifier si l'utilisateur est connecté via le cookie
    const user = await this.homeService.getUserFromRequest(req);

    const html = await this.svelteRenderService.render('LegalNotice', {
      user
    });
    res.send(html);
  }
}
