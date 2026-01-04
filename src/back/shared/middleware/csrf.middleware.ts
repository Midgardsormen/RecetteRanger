import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const isProd = process.env.NODE_ENV === 'production';

// Routes qui ne doivent PAS être protégées par CSRF
const CSRF_IGNORED_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/logout', // Déconnexion ne nécessite pas de protection CSRF
  '/auth/csrf-token', // Permet d'obtenir le token CSRF
  // si tu exposes aussi ces routes sous /api :
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/csrf-token',
]);

const normalizePath = (p: string) => {
  if (!p) return '/';
  const n = p.replace(/\/+$/, ''); // enlève trailing slashes
  return n.length ? n : '/';
};

// Configuration Double Submit Cookie CSRF
const {
  generateCsrfToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => {
    if (!process.env.CSRF_SECRET) {
      throw new Error('CSRF_SECRET must be set in environment variables');
    }
    return process.env.CSRF_SECRET;
  },

  getSessionIdentifier: (req: Request) => {
    // Utiliser le cookie d'authentification s'il existe, sinon une valeur par défaut
    // Note: Ne pas utiliser req.ip car il peut changer avec les load balancers
    const sessionId = req.cookies?.access_token || 'anonymous-session';
    return sessionId;
  },

  cookieName: 'psifi.x-csrf-token',

  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax', // 'strict' empêcherait l'envoi du cookie lors de navigations externes
    secure: isProd,
    path: '/',
    // En production, on peut spécifier le domaine via variable d'environnement
    // Exemple: COOKIE_DOMAIN=recetteranger.fr
    ...(isProd && process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  },

  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

  getCsrfTokenFromRequest: (req: Request) =>
    req.headers['x-csrf-token'] as string,
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Utiliser originalUrl pour obtenir le chemin complet de la requête
    // req.path peut être différent dans NestJS à cause du routing modulaire
    const fullPath = req.originalUrl?.split('?')[0] || req.path; // Enlever query params
    const path = normalizePath(fullPath);

    // ✅ skip CSRF pour login/register
    if (CSRF_IGNORED_PATHS.has(path)) {
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        console.log('[CSRF] Skipped for auth route:', req.method, path);
      }
      return next();
    }

    // ✅ skip CSRF pour toutes les routes API (sauf auth)
    // Les routes API utilisent JWT pour l'authentification, pas de formulaires HTML
    if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        console.log('[CSRF] Skipped for API route:', req.method, path);
      }
      return next();
    }

    // Debug
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      console.log('[CSRF] Request:', req.method, path);
      console.log('[CSRF] Original URL:', req.originalUrl);
      console.log('[CSRF] Token from header:', req.headers['x-csrf-token']);
      console.log('[CSRF] Cookies:', Object.keys(req.cookies || {}));
      console.log('[CSRF] CSRF cookie value:', req.cookies?.['psifi.x-csrf-token'] ? 'present' : 'missing');
      console.log('[CSRF] Session ID:', req.cookies?.access_token ? 'authenticated' : 'anonymous');
      console.log('[CSRF] All headers:', JSON.stringify(req.headers, null, 2));
    }

    try {
      return doubleCsrfProtection(req, res, next);
    } catch (error) {
      console.error('[CSRF] Validation failed:', error);
      throw error;
    }
  }
}

export { generateCsrfToken, validateRequest };
