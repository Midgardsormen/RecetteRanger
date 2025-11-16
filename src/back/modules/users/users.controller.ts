import { Controller, Get, Res, UseGuards, Request, Param, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';
import { UserService } from '../../api/user/user.service';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { UserRole } from '../../types/user.types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly svelteRenderService: SvelteRenderService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsersPage(@Request() req, @Res() res: Response) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    // Récupérer tous les utilisateurs
    const users = await this.userService.findAll();

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Users', {
      users,
      user: req.user
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserProfilePage(@Request() req, @Param('id') id: string, @Res() res: Response) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    // Récupérer le profil de l'utilisateur
    const profileUser = await this.userService.findOne(id);

    // Rendre la page avec les données en SSR
    const html = await this.svelteRenderService.render('Profile', {
      user: req.user,
      profileUser,
      isOwnProfile: false,
      isAdminEditing: true
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
