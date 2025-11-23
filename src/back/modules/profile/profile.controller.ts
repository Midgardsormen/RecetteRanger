import { Controller, Get, Res, UseGuards, Request, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthRedirectGuard } from '../../api/auth/guards/jwt-auth-redirect.guard';
import { ProfileService } from './profile.service';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Controller('profile')
@UseGuards(JwtAuthRedirectGuard) // Mode privé : profils accessibles uniquement si authentifié
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  // Route pour mon profil (/profile)
  @Get()
  async getMyProfilePage(@Request() req, @Res() res: Response) {
    // Récupérer les données de l'utilisateur connecté
    const user = await this.profileService.getUserProfile(req.user.id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Profile', {
      user,
      profileUserId: null,
      isOwnProfile: true
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  // Route pour le profil d'un utilisateur (/profile/:id)
  @Get(':id')
  async getUserProfilePage(@Request() req, @Param('id') userId: string, @Res() res: Response) {
    const currentUser = req.user; // Garanti d'exister grâce au guard au niveau controller
    const isOwnProfile = currentUser.id === userId;

    // Si c'est mon propre profil, rediriger vers /profile
    if (isOwnProfile) {
      return res.redirect('/profile');
    }

    // Sinon, charger le profil d'un autre utilisateur (mode privé : nécessite auth)
    const html = await this.svelteRenderService.render('Profile', {
      user: currentUser,
      profileUserId: userId,
      isOwnProfile: false
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
