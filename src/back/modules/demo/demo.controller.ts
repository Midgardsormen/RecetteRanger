import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('demo-buttons')
export class DemoController {
  constructor(
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthRedirectGuard)
  async getButtonsDemoPage(@Request() req, @Res() res: Response) {
    // Rendre la page de démo avec l'utilisateur connecté
    const html = await this.svelteRenderService.render('ButtonsDemo', {
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
