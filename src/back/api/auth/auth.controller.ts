import { Controller, Post, Body, Get, UseGuards, Request, Response } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Compte créé avec succès, token défini dans un cookie HTTP-only',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email ou pseudo déjà utilisé' })
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const result = await this.authService.register(registerDto);

    // Définir le token dans un cookie HTTP-only
    res.cookie('access_token', result.access_token, {
      httpOnly: true, // Inaccessible depuis JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
      sameSite: 'lax', // Protection CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    // Retourner uniquement les infos utilisateur (pas le token)
    return { user: result.user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter avec email/pseudo et mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, token défini dans un cookie HTTP-only',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ) {
    const result = await this.authService.login(loginDto);

    // Définir le token dans un cookie HTTP-only
    res.cookie('access_token', result.access_token, {
      httpOnly: true, // Inaccessible depuis JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
      sameSite: 'lax', // Protection CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    // Retourner uniquement les infos utilisateur (pas le token)
    return { user: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Récupérer les informations de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Informations utilisateur',
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Se déconnecter (supprimer le cookie)' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
  })
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // Supprimer le cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Déconnexion réussie' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Changer le mot de passe de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe modifié avec succès',
  })
  @ApiResponse({ status: 400, description: 'Données invalides ou mots de passe ne correspondent pas' })
  @ApiResponse({ status: 401, description: 'Mot de passe actuel incorrect ou non authentifié' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
}
