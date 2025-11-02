import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SvelteRenderService } from './services/svelte-render.service';

@Controller()
export class AppController {
  constructor(private readonly svelteRenderService: SvelteRenderService) {}

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
}
