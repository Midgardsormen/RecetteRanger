import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

/**
 * Guard JWT avec redirection vers /login pour les pages SSR
 * Utilisé pour les pages qui nécessitent authentification
 * Au lieu de renvoyer 401, redirige vers /login avec meilleure UX
 */
@Injectable()
export class JwtAuthRedirectGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // Tenter l'authentification JWT standard
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // Si l'authentification échoue, rediriger vers /login
      // Sauvegarder l'URL demandée pour rediriger après login
      const originalUrl = request.originalUrl || request.url;
      const redirectUrl = originalUrl !== '/login' && originalUrl !== '/'
        ? `/login?redirect=${encodeURIComponent(originalUrl)}`
        : '/login';

      response.redirect(302, redirectUrl);
      return false;
    }
  }
}
