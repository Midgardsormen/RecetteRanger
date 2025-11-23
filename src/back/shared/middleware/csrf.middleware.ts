import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const isProd = process.env.NODE_ENV === 'production';

// Configuration du Double Submit Cookie CSRF
const {
  generateCsrfToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  // Secret dédié CSRF (obligatoire, pas de fallback)
  getSecret: () => {
    if (!process.env.CSRF_SECRET) {
      throw new Error('CSRF_SECRET must be set in environment variables');
    }
    return process.env.CSRF_SECRET;
  },

  // Lier le token à la session utilisateur (JWT cookie)
  // Si pas de JWT, utiliser req.ip en fallback (utilisateurs anonymes)
  getSessionIdentifier: (req: Request) =>
    req.cookies?.access_token ?? req.cookies?.refresh_token ?? req.ip ?? 'anon',

  // __Host- seulement en production (exige HTTPS + Secure + Path=/ + pas de Domain)
  // En dev HTTP, utiliser un nom simple pour que le cookie soit accepté par le navigateur
  cookieName: isProd ? '__Host-psifi.x-csrf-token' : 'psifi.x-csrf-token',

  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd, // HTTPS obligatoire en production
    path: '/',      // Requis pour __Host- en production
  },

  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

  getCsrfTokenFromRequest: (req: Request) =>
    req.headers['x-csrf-token'] as string,
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Appliquer la protection CSRF
    doubleCsrfProtection(req, res, next);
  }
}

// Export pour utilisation dans les contrôleurs
export { generateCsrfToken, validateRequest };
