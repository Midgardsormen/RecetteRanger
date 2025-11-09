import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfilePage(@Request() req, @Res() res: Response) {
    // Récupérer les données de l'utilisateur connecté
    const user = await this.profileService.getUserProfile(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Profile', {
      user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
